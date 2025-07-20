import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'frontoffice',
    loadChildren: () =>
      import('./frontoffice/frontoffice.module').then(m => m.FrontofficeModule)
  },
  {
    path: 'backoffice',
    loadChildren: () =>
      import('./backoffice/backoffice.module').then(m => m.BackofficeModule)
  },
  {
    path: '',
    redirectTo: 'frontoffice/acceuil',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
