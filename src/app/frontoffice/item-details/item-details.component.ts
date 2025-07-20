import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item, ItemService } from 'src/app/services/item.service';
import { NotificationRequest, NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit{
  item?: Item;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private notificationService: NotificationService
  ) {}
 contacterUtilisateur() {
    const request:NotificationRequest = {
      toEmail: this.item?.useremail ? this.item.useremail.toString() : '',
      subject: 'Intérêt pour votre objet publié',
      message: `Bonjour, je suis intéressé(e) par l'objet "${this.item?.type ?? ''}" que vous avez publié sur Smart Lost and Found. Pourriez-vous me contacter ?`
    };

    this.notificationService.sendNotification(request).subscribe({
      next: () => alert('📧 Email envoyé avec succès au propriétaire !'),
      error: (err) => {
        console.error('Erreur d\'envoi de l\'email', err);
        alert('❌ Une erreur est survenue lors de l\'envoi.');
      }
    });
  }
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemService.getItemById(id).subscribe({
      next: (data) => this.item = data,
      error: (err) => console.error('Erreur lors du chargement', err)
    });
  }}
