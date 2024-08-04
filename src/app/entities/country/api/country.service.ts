import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) {
  }

  getCountries$(): Observable<string[]> {
    return this.http.get<string[]>('/api/countries');
  }
}

