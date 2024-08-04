import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SubmitFormResponseData, UserInfoFormValue} from "../models/users-info-form.model";

@Injectable()
export class UsersInfoFormService {

  constructor(private http: HttpClient) { }

  submitForm$(formData: UserInfoFormValue[]): Observable<SubmitFormResponseData> {
      return this.http.post<SubmitFormResponseData>('/api/submitForm', formData);
  }
}
