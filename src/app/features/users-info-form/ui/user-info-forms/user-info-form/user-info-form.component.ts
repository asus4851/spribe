import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  Validators,
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  ValidationErrors
} from '@angular/forms';
import {debounceTime, map, switchMap, catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {UserService} from "../../../../../entities";
import {UserInfoFormGroup, UserInfoFormValue} from "../../../models/users-info-form.model";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'app-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: ['./user-info-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserInfoFormComponent),
      multi: true
    },
  ]
})
export class UserInfoFormComponent implements OnInit, ControlValueAccessor {
  readonly errorMessages: { [key: string]: string } = {
    invalidCountry: 'Please provide a correct Country',
    required: 'This field is required',
    usernameTaken: 'Username is taken, please choose another',
    invalidBirthday: 'Please provide a correct Birthday'
  };

  @Input() countries: string[] = [];

  form: FormGroup<UserInfoFormGroup> = this.fb.nonNullable.group({
    country: ['', [Validators.required, this.countryValidator.bind(this)]],
    username: ['', [Validators.required], [this.usernameAsyncValidator()]],
    birthday: ['', [Validators.required, this.birthdayValidator.bind(this)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private chRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.onChange(this.form.valid ? this.form.getRawValue() : null);
      this.onTouched();
      this.chRef.markForCheck();
    });

    this.form.statusChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.onChange(this.form.valid ? this.form.getRawValue() : null);
      this.chRef.markForCheck();
    });
  }

  writeValue(value: UserInfoFormValue): void {
    if (value) {
      this.form.setValue(value, {emitEvent: false});
    }
  }

  registerOnChange(fn: (value: UserInfoFormValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({emitEvent: false});
    } else {
      this.form.enable({emitEvent: false});
    }
  }

  onChange: (value: UserInfoFormValue | null) => void = () => {};
  onTouched: () => void = () => {};

  countryValidator(control: AbstractControl): ValidationErrors | null {
    return this.countries.includes(control.value) ? null : {invalidCountry: true};
  }

  usernameAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(value => this.userService.checkUsername$(value)),
        map(response => (response.isAvailable ? null : {usernameTaken: true})),
        catchError(err => {
          console.error(err); // log the error better by Sentry or other service
          return of(null);
        })
      );
    };
  }

  birthdayValidator(control: AbstractControl): ValidationErrors | null {
    const today = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate <= today ? null : {invalidBirthday: true};
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? [] : this.countries.filter(v => v.toLowerCase().includes(term.toLowerCase())).slice(0, 10))
    );

  formatter = (result: string) => result;
}

