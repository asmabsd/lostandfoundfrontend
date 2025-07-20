/*import { Component, OnInit } from '@angular/core';
import { Activity } from '../../models/activity.model';
import { CategoryA } from '../../models/category-a.enum';
import { Router } from '@angular/router';
declare var $: any; // For jQuery
@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  
  // Filter properties
  categoryFilter: string = 'ALL';
  priceRangeFilter: number = 1000; // Default max price
  categories = Object.values(CategoryA);
  
  constructor(
    private activityService: ActivityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadActivities();
  }
  
  ngAfterViewInit(): void {
    // Initialize parallax
    setTimeout(() => {
      $('.parallax-window').parallax({
        imageSrc: 'assets/travelix/images/activities_background.jpg',
        speed: 0.8
      });
    }, 200);
  }
  loadActivities(): void {
    this.loading = true;
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.filteredActivities = [...data]; // Create a copy for filtering
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load activities. Please try again later.';
        console.error('Error fetching activities:', error);
        this.loading = false;
      }
    });
  }
  
  // Apply filters based on category and price
  applyFilters(): void {
    this.filteredActivities = this.activities.filter(activity => {
      // Apply category filter if not 'ALL'
      const categoryMatches = this.categoryFilter === 'ALL' || 
                             activity.categoryA === this.categoryFilter;
      
      // Apply price range filter
      const priceMatches = activity.price <= this.priceRangeFilter;
      
      return categoryMatches && priceMatches;
    });
  }
  
  // Filter by category
  filterByCategory(category: string): void {
    this.categoryFilter = category;
    this.applyFilters();
  }
  
  // Filter by price range
  updatePriceRange(maxPrice: number): void {
    this.priceRangeFilter = maxPrice;
    this.applyFilters();
  }
  
  // Get image URL for an activity
  getImageUrl(activity: Activity): string {
    if (activity.imagePath) {
      return this.activityService.getImageUrl(activity.imagePath);
    }
    return 'assets/travelix/images/activity_default.jpg'; // Default image
  }
  
  // Navigate to detail page
  viewActivityDetails(activityId: number): void {
    this.router.navigate(['/activities', activityId]);
  }
  
  // Navigate to reservation page
  reserveActivity(activityId: number): void {
    this.router.navigate(['/frontoffice/reservation', activityId]);
  }

  // Helper method to get category icon
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'ADVENTURE': 'fa-mountain',
      'CULTURAL': 'fa-landmark',
      'WATER': 'fa-water',
      'OUTDOOR': 'fa-tree',
      'CULINARY': 'fa-utensils',
      'WELLNESS': 'fa-spa',
      'EDUCATIONAL': 'fa-graduation-cap'
    };
    
    return icons[category] || 'fa-star';
  }
}*/