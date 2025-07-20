import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Item, ItemService } from 'src/app/services/item.service';
import { NotificationRequest, NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-itemtrouve',
  templateUrl: './itemtrouve.component.html',
  styleUrls: ['./itemtrouve.component.scss']
})
export class ItemtrouveComponent {
currentUserEmail: string | null = null;
user: User | undefined;  // adapte le type selon ton modèle

  item?: Item;
  selectedFile?: File;

 items: Item[] = [];
  showForm = false;
  formMode: 'add' | 'edit' = 'add';
  currentItemId?: number;
  itemForm: FormGroup;
get foundItems() {
  return this.items.filter(i => i.status === 'FOUND');
}

  constructor(private itemService:ItemService, private authService:AuthServiceService,private fb: FormBuilder, private notificationservice:NotificationService) {
    this.itemForm = this.fb.group({
      type: [''],
      description: [''],
      location: [''],
      date: [''],
      status: ['LOST'],
   
       useremail:   ['']   
    });
  }

  ngOnInit(): void {
    this.loadItems();

const email = this.authService.getUserEmail();
console.log('EMAIL RÉCUPÉRÉ →', email); // ← vérifie dans la console navigateur

this.itemForm.patchValue({ useremail: email });
 this.currentUserEmail = this.authService.getUserEmail(); // ← Important

  }
 contacterUtilisateur(item: Item) {
  const toEmail = item.useremail?.trim();

  if (!toEmail || !toEmail.includes('@')) {
    alert('❌ Adresse email invalide ou manquante.');
    return;
  }

  const request = {
    toEmail,
    subject: 'Intérêt pour votre objet trouvé publié',
    message: `Bonjour, je suis intéressé(e) par l'objet "${item.type}" que vous avez publié sur Smart Lost and Found. Pourriez-vous me contacter ?`
  };

  this.notificationservice.sendNotification(request).subscribe({
    next: () => alert('📧 Email envoyé avec succès au propriétaire !'),
    error: (err) => {
      console.error('Erreur d\'envoi de l\'email', err);
      alert('❌ Une erreur est survenue lors de l\'envoi.');
    }
  });
}



uploadImage(itemId: number) {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.itemService.uploadImage(itemId, formData).subscribe({
      next: () => this.loadItems(),
      error: err => console.error('Erreur upload image', err)
    });
  }
}

  loadItems() {
    this.itemService.getAllItems().subscribe(data => this.items = data);
  }
onAddClick() {
   const email = this.authService.getUserEmail();
  this.itemForm.reset({
    status: 'LOST',
 
    useremail: email
  });
  this.formMode = 'add';
  this.showForm = true;
  }

  onEdit(item: Item) {
    this.itemForm.patchValue(item);
    this.currentItemId = item.id;
    this.formMode = 'edit';
    this.showForm = true;
  }

  onDelete(id: number) {
    this.itemService.deleteItem(id).subscribe(() => this.loadItems());
  }
onSubmit() {
  const itemFormValue = { ...this.itemForm.value }; // pas de champ photo ici
  const isAddingFoundItem = this.formMode === 'add' && itemFormValue.status === 'FOUND';

  if (this.formMode === 'add') {
    this.itemService.createItem(itemFormValue).subscribe((createdItem) => {
      if (this.selectedFile) {
        this.uploadImage(createdItem.id!);
         this.loadItems();
      } else {
        this.loadItems();
      }
      this.showForm = false;
      this.selectedFile = undefined;
        if (isAddingFoundItem) {
        this.incrementUserScore();
      }
    });
  } else if (this.formMode === 'edit' && this.currentItemId != null) {
    this.itemService.updateItem(this.currentItemId, itemFormValue).subscribe(() => {
      if (this.selectedFile) {
        this.uploadImage(this.currentItemId!);
      } else {
        this.loadItems();
      }
      this.showForm = false;
      this.selectedFile = undefined;
    });
  }
}

incrementUserScore() {
  if (!this.user) return;

  this.user.score = (this.user.score || 0) + 1;

  // Mets à jour le user dans localStorage ou via backend selon ton appli
  localStorage.setItem('user', JSON.stringify(this.user));

  alert(`🎉 Congratulations! Your score increased by 1. Your current score is ${this.user.score}.`);

  if (this.user.score > 20) {
    alert(`🏆 You have earned a super score! You can now claim special vouchers as a thank you for helping the community.`);
  }
}


onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
  }
}
  cancelForm() {
    this.showForm = false;
  }
}


