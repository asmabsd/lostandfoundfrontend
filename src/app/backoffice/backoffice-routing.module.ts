import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from '../frontoffice/login/login.component';
import { RegisterComponent } from '../frontoffice/register/register.component';
import { AcceuilComponent } from '../acceuil/acceuil.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
 

    { path: 'home', component: HomeComponent /*, canActivate: [AuthGuard]*/ },
    {
      path: 'acceuil',
      component: AcceuilComponent,
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent }
      ]
    }
  ]



      

        
       
        
       
        

  



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
