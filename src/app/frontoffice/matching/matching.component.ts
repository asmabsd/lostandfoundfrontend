import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Item, ItemService } from 'src/app/services/item.service';
import { MatchingService, Status } from 'src/app/services/matching.service';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent   implements OnInit {

  userEmail: string = '';
  isPremium: boolean = false;
  lostItems: Item[] = [];
  matchesMap: { [key: number]: Item[] } = {};
  messageMap: { [key: number]: string } = {};
  iconMap: { [key: number]: string } = {};

  constructor(
    private authService: AuthServiceService,
    private matchingService: MatchingService,
    private itemService: ItemService,
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail() ?? '';
    this.checkUserPlan();
  }

  checkUserPlan() {
    this.matchingService.isUserPremium(this.userEmail).subscribe({
      next: (premium) => {
        this.isPremium = premium;
        this.loadUserLostItems();
      },
      error: (err) => {
        console.error('Erreur lors de la vérification du plan premium :', err);
        this.isPremium = false;
        this.loadUserLostItems();  // Fallback même si erreur
      }
    });
  }

  loadUserLostItems() {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        this.lostItems = items.filter(item =>
          item.status === 'LOST' && item.useremail === this.userEmail
        );
      },
      error: (err) => {
        console.error('Erreur lors du chargement des objets perdus :', err);
      }
    });
  }

  getMatches(itemId: number) {
    this.matchingService.getMatchingItems(itemId, this.isPremium).subscribe({
      next: (matches) => {
        this.matchesMap[itemId] = matches;

        if (this.isPremium) {
          this.messageMap[itemId] = matches.length > 0
            ? '<b>✨ Plan Premium :</b> voici les correspondances IA trouvées pour votre objet.'
            : '<b>🤖 Aucun match IA trouvé.</b> Essayez plus tard ou modifiez la description.';
          this.iconMap[itemId] = '🤖';
        } else {
          this.messageMap[itemId] = matches.length > 0
            ? '<b>🔎 Plan Gratuit :</b> matching basique trouvé avec :'
            : '<b>⚠️ Aucun match trouvé.</b> Passez au plan Premium pour un matching avancé.';
          this.iconMap[itemId] = '🧠';
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des correspondances :', err);
        this.messageMap[itemId] = '⚠️ Erreur lors de la recherche de matching.';
      }
    });
  }
}