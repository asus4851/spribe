import {FormControl} from "@angular/forms";

export interface UserInfoFormValue {
  country: string;
  username: string;
  birthday: string;
}

export type UserInfoFormGroup = {
  [K in keyof UserInfoFormValue]: FormControl<UserInfoFormValue[K]>;
};

export interface SubmitFormResponseData {
  result: string
}
