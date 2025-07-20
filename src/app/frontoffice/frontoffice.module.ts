import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MenuComponent } from './layout/menu/menu.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { OffersComponent } from './offers/offers.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { ChatbotComponent } from '../chatbot/chatbot.component';


@NgModule({
  declarations: [
    HomeComponent,
AcceuilComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    
    AboutComponent,
    OffersComponent,
    BlogComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    StartComponent,
    ItemperduComponent,
    ItemtrouveComponent,
    ReclamationComponent,
    PaymentComponent,
    MatchingComponent,
    ItemDetailsComponent,
    UserProfileComponentComponent,
    
   
  ],
  imports: [
      

    CommonModule,
    FrontofficeRoutingModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    
    
  ],
 providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('447815519820-p22sjoklsfup367rrm9hqktrlj4vl6ap.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ]
})

export class FrontofficeModule { }
