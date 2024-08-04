import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CheckUserResponseData} from "../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  checkUsername$(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername', {username});
  }
}
