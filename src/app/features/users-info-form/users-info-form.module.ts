import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserInfoFormsComponent} from "./ui/user-info-forms/user-info-forms.component";
import {UserInfoFormComponent} from "./ui/user-info-forms/user-info-form/user-info-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {ErrorMessageDirective} from "../../shared/directives/error-message.directive";
import {UsersInfoFormService} from "./api/users-info-form.service";

// Feature-Sliced Design
@NgModule({
  declarations: [UserInfoFormsComponent, UserInfoFormComponent, ErrorMessageDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbTypeahead
  ],
  providers: [UsersInfoFormService],
  exports: [UserInfoFormsComponent]
})
export class UsersInfoFormModule {
}
