import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserInfoFormComponent } from './user-info-form.component';
import { UserService } from '../../../../../entities';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockUserService {
  checkUsername$(username: string) {
    return of({ isAvailable: true });
  }
}

describe('UserInfoFormComponent', () => {
  let component: UserInfoFormComponent;
  let fixture: ComponentFixture<UserInfoFormComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserInfoFormComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.form;
    expect(form).toBeDefined();
    expect(form.get('country')?.value).toBe('');
    expect(form.get('username')?.value).toBe('');
    expect(form.get('birthday')?.value).toBe('');
  });


  it('should call userService to check username availability', () => {
    spyOn(userService, 'checkUsername$').and.callThrough();
    component.form.get('username')?.setValue('newusername');
    component.form.updateValueAndValidity();

    expect(userService.checkUsername$).toHaveBeenCalledWith('newusername');
  });

  it('should update the form value when writeValue is called', () => {
    const formValue = { country: 'USA', username: 'testuser', birthday: '1990-01-01' };
    component.writeValue(formValue);

    const form = component.form;
    expect(form.get('country')?.value).toBe('USA');
    expect(form.get('username')?.value).toBe('testuser');
    expect(form.get('birthday')?.value).toBe('1990-01-01');
  });

  it('should disable and enable the form', () => {
    component.setDisabledState(true);
    expect(component.form.disabled).toBeTrue();

    component.setDisabledState(false);
    expect(component.form.enabled).toBeTrue();
  });
});
