import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './about/about.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { OffersComponent } from './offers/offers.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AcceuilComponent } from '../acceuil/acceuil.component';
import { StartComponent } from './start/start.component';
import { ItemperduComponent } from './itemperdu/itemperdu.component';
import { ItemtrouveComponent } from './itemtrouve/itemtrouve.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { PaymentComponent } from './payment/payment.component';
import { MatchingComponent } from './matching/matching.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { UserProfileComponentComponent } from './user-profile-component/user-profile-component.component';

const routes: Routes = [
 { path: 'start', component: StartComponent,
   children: [

        { path: 'itemperdu', component: ItemperduComponent },

                { path: 'itemtrouve', component:ItemtrouveComponent },
                                { path: 'reclamation', component:ReclamationComponent },
                               { path: 'payment', component:PaymentComponent },
{ path: 'match', component: MatchingComponent },
  { path: 'item-details/:id', component: ItemDetailsComponent },
  { path: 'userprofile', component: UserProfileComponentComponent },


 ] },


  {       

    path: '',
    component: HomeComponent,
    children: [

        { path: 'acceuil', component: AcceuilComponent },
{ path: 'login', component: LoginComponent},
{ path: 'register', component: RegisterComponent},


    ]
  },


 /*   children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'contact', component: ContactComponent },
   
    ]
  }*/
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { }
