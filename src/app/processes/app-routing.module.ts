import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Feature-Sliced Design

// try to use lazy load for better performance
// would be better to use linter and forbid import high level module in low level module
const routes: Routes = [
  {path: '', redirectTo: 'users-info', pathMatch: 'full'},
  {
    path: 'users-info',
    loadChildren: () => import('../pages/user-forms-page/user-forms-page.module').then(m => m.UserFormsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

