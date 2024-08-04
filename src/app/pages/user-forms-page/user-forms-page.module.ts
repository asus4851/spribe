import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {UserFormsPageComponent} from "./ui/user-forms-page.component";
import {UsersInfoFormModule} from "../../features/users-info-form/users-info-form.module";

// Feature-Sliced Design
const routes: Routes = [
  {path: '', component: UserFormsPageComponent}
];

@NgModule({
  declarations: [UserFormsPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UsersInfoFormModule
  ]
})
export class UserFormsPageModule {
}
