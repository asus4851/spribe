import { ErrorMessageDirective } from './error-message.directive';
import { Component, DebugElement } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <form [formGroup]="form">
      <input formControlName="name" appErrorMessage="name" [formGroup]="form" [errorMessages]="errorMessages">
    </form>
  `
})
class TestHostComponent {
  form: FormGroup;
  errorMessages = {
    required: 'This field is required'
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }
}

describe('ErrorMessageDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, ErrorMessageDirective],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(inputEl).toBeTruthy();
  });

  it('should display error message when control is invalid', () => {
    const control = component.form.get('name');
    control!.markAsTouched();
    control!.updateValueAndValidity();
    fixture.detectChanges();

    const errorElement = inputEl.nativeElement.parentNode.querySelector('.text-danger');
    expect(errorElement).not.toBeNull();
    expect(errorElement.innerText).toBe('This field is required');
  });

  it('should remove error message when control becomes valid', () => {
    const control = component.form.get('name');
    control!.markAsTouched();
    control!.updateValueAndValidity();
    fixture.detectChanges();

    control!.setValue('Valid value');
    control!.updateValueAndValidity();
    fixture.detectChanges();

    const errorElement = inputEl.nativeElement.parentNode.querySelector('.text-danger');
    expect(errorElement).toBeNull();
  });
});
