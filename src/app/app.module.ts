import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterOutlet} from "@angular/router";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MockBackendInterceptor} from "./processes/interceptors/mock-backend.interceptor";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from "./processes/app-routing.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterOutlet,
    NgbModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
