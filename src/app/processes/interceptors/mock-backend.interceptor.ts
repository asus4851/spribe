import {HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {delay, Observable, of, tap} from "rxjs";
import {CountryMock} from '../../entities/country/api/mocks/country';
import {CheckUserResponseData} from "../../entities/user/model/user.model";
import {SubmitFormResponseData} from "../../features/users-info-form/models/users-info-form.model";

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpResponse<CheckUserResponseData | SubmitFormResponseData | string[]>> {

    if (req.url.endsWith('/api/checkUsername') && req.method === 'POST') {
      return this.handleCheckUsername(req);
    }
    if (req.url.endsWith('/api/countries') && req.method === 'GET') {
      return this.handleGetCountries();
    }

    if (req.url.endsWith('/api/submitForm') && req.method === 'POST') {
      return this.handleSubmitForm();
    }

    return of(new HttpResponse({status: 404, body: {result: 'You are using the wrong endpoint'}}));
  }

  private handleGetCountries(): Observable<HttpResponse<string[]>> {
    const countries = Object.values(CountryMock);
    const response = new HttpResponse({status: 200, body: countries});

    return of(response).pipe(
      delay(500),
    );
  }


  private handleCheckUsername(req: HttpRequest<any>): Observable<HttpResponse<CheckUserResponseData>> {
    const isAvailable = req.body.username.includes('new');
    const response = new HttpResponse({status: 200, body: {isAvailable}});

    return of(response).pipe(
      delay(500),
      tap(() => console.log('checkUsername response:', {isAvailable}))
    );
  }

  private handleSubmitForm(): Observable<HttpResponse<SubmitFormResponseData>> {
    const response = new HttpResponse({status: 200, body: {result: 'nice job'}});

    return of(response).pipe(
      delay(500),
      tap(() => console.log('submitForm response'))
    );
  }
}
