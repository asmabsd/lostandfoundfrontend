import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import  jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Reclamation, ReclamationService } from 'src/app/services/reclamation.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.scss']
})
export class ReclamationComponent implements OnInit {
  currentUserName: string = '';

  reclamations: Reclamation[] = [];
  showForm = false;
  formMode: 'add' | 'edit' = 'add';
  selectedReclamationId?: number;
  reclamationForm: FormGroup;

  constructor(
    private reclamationService: ReclamationService,
    private fb: FormBuilder,
      private authService: AuthServiceService

  ) {
    this.reclamationForm = this.fb.group({
      senderUserEmail: [''],
      targetUserEmail: [''],
      reason: [''],
      details: ['']
    });
  }

  ngOnInit(): void {
    this.loadReclamations();
     const user = this.authService.getCurrentUser(); 
  this.currentUserName = user?.name ?? '';
  }

  loadReclamations() {
      const currentUserEmail = this.authService.getUserEmail();
  this.reclamationService.getAll().subscribe(data => {
    // On filtre les réclamations du user connecté
    this.reclamations = data.filter(r => r.senderUserEmail === currentUserEmail);
  });
  }

  openForm(mode: 'add' | 'edit', rec?: Reclamation) {
    this.showForm = true;
    this.formMode = mode;
    if (mode === 'edit' && rec) {
      this.selectedReclamationId = rec.id;
      this.reclamationForm.patchValue(rec);
    } else {
    
       const email = this.authService.getUserEmail();
    console.log('EMAIL RÉCUPÉRÉ →', email);
    this.reclamationForm.reset(); // remet à zéro
    this.reclamationForm.patchValue({ senderUserEmail: email ,targetUserEmail: 'contact@lostandfound.com'}); // préremplit
           // valeur par défaut

    }
  }


  /* generateDescriptionFromReason(reason: string) {
    this.reclamationService.generateDescription(reason).subscribe({
      next: description => {
        // Mettre à jour le champ détails automatiquement
        this.reclamationForm.patchValue({ details: description });
      },
      error: err => {
        console.error('Erreur génération description:', err);
      }
    });
  }*/

    generateDescriptionFromReason(reason: string) {
  const userName = this.currentUserName;

  const prompt = `Je suis ${userName} et je souhaite faire une réclamation concernant : ${reason}.
  Peux-tu me générer un message professionnel pour l'envoyer au support ?`;

  this.reclamationService.generateDescription(prompt).subscribe({
    next: description => {
      this.reclamationForm.patchValue({ details: description });
    },
    error: err => {
      console.error('Erreur génération description:', err);
    }
  });
}

   onReasonChange() {
    const reason = this.reclamationForm.get('reason')?.value;
    if (reason && reason.length > 3) {
      this.generateDescriptionFromReason(reason);
    }
  }

  onSubmit() {
    if (this.formMode === 'add') {
      this.reclamationService.create(this.reclamationForm.value).subscribe(() => {
        this.showForm = false;
        this.loadReclamations();
      });
    } else if (this.formMode === 'edit' && this.selectedReclamationId) {
      this.reclamationService.update(this.selectedReclamationId, this.reclamationForm.value).subscribe(() => {
        this.showForm = false;
        this.loadReclamations();
      });
    }
  }

  delete(id: number) {
    this.reclamationService.delete(id).subscribe(() => this.loadReclamations());
  }

  downloadPdf(reclamation: Reclamation) {
    const doc = new jsPDF();
    doc.text(' CLAIM DETAILS ', 10, 10);
    autoTable(doc, {
      head: [['Field', 'Value']],
      body: [
        ['FROM', reclamation.senderUserEmail],
        ['TO', reclamation.targetUserEmail],
        ['REASON', reclamation.reason],
        ['DETAILS', reclamation.details],
        ['DATE', reclamation.createdAt ?? ''],
      ],
    });
    doc.save(`reclamation-${reclamation.id}.pdf`);
  }

  cancelForm() {
    this.showForm = false;
    this.reclamationForm.reset();
  }
}
function senderTargetEmailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const sender = control.get('senderUserEmail')?.value;
    const target = control.get('targetUserEmail')?.value;

    if (sender && target && sender === target) {
      return { sameEmail: true };
    }
    return null;
  };
}