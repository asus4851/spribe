import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserInfoFormsComponent } from './user-info-forms.component';
import { CountryService } from '../../../../entities';
import { UsersInfoFormService } from '../../api/users-info-form.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {UserInfoFormValue} from "../../models/users-info-form.model";

class MockCountryService {
  getCountries$() {
    return of(['USA', 'Canada']);
  }
}

class MockUsersInfoFormService {
  submitForm$(formData: UserInfoFormValue[]) {
    return of({ success: true });
  }
}

@Component({
  selector: 'app-user-info-form',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockUserInfoFormComponent),
      multi: true,
    },
  ],
})
class MockUserInfoFormComponent implements ControlValueAccessor {
  @Input() countries: string[] = [];

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}

describe('UserInfoFormsComponent', () => {
  let component: UserInfoFormsComponent;
  let fixture: ComponentFixture<UserInfoFormsComponent>;
  let countryService: CountryService;
  let usersInfoFormService: UsersInfoFormService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserInfoFormsComponent, MockUserInfoFormComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: CountryService, useClass: MockCountryService },
        { provide: UsersInfoFormService, useClass: MockUsersInfoFormService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoFormsComponent);
    component = fixture.componentInstance;
    countryService = TestBed.inject(CountryService);
    usersInfoFormService = TestBed.inject(UsersInfoFormService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with one form control', () => {
    expect(component.forms.length).toBe(1);
  });

  it('should add a form when addForm is called', () => {
    component.addForm();
    expect(component.forms.length).toBe(2);
  });

  it('should not add more than 10 forms', () => {
    for (let i = 0; i < 10; i++) {
      component.addForm();
    }
    expect(component.forms.length).toBe(10);
    component.addForm();
    expect(component.forms.length).toBe(10);
  });

  it('should remove a form when deleteForm is called', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.addForm();
    component.deleteForm(0);
    expect(component.forms.length).toBe(1);
  });

  it('should disable forms and show timer on submit', fakeAsync(() => {
    spyOn(window, 'alert');
    component.forms.controls[0].setValue('valid');
    component.submitForms();
    expect(component.showTimer).toBeTrue();
    tick(5000);
    fixture.detectChanges();
    expect(component.showTimer).toBeFalse();
    expect(window.alert).toHaveBeenCalledWith('Forms submitted successfully');
  }));

  it('should enable forms and reset timer on cancel', fakeAsync(() => {
    component.forms.controls[0].setValue('valid');
    component.submitForms();
    expect(component.showTimer).toBeTrue();
    component.cancelSubmission();
    expect(component.showTimer).toBeFalse();
    component.forms.controls.forEach(control => {
      expect(control.enabled).toBeTrue();
    });
  }));

  it('should count invalid forms correctly', () => {
    component.forms.controls[0].setValue(null);
    expect(component.countInvalidForms()).toBe(1);
    component.forms.controls[0].setValue('valid');
    expect(component.countInvalidForms()).toBe(0);
  });
});
