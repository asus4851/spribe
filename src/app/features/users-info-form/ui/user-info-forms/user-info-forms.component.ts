import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormControl,
  AbstractControl,
  Validators
} from '@angular/forms';
import {CountryService} from "../../../../entities";
import {Observable, Subscription, takeWhile, tap, timer} from "rxjs";
import {UsersInfoFormService} from "../../api/users-info-form.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'app-user-info-forms',
  templateUrl: './user-info-forms.component.html',
  styleUrls: ['./user-info-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoFormsComponent implements OnInit {
  private readonly defaultTimerValue: number = 5;
  private timerSubscription: Subscription = new Subscription();

  forms: FormArray<FormControl>;
  showTimer: boolean = false;
  timerValue: number = this.defaultTimerValue;
  countries$: Observable<string[]> = this.countryService.getCountries$();

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef,
    private usersInfoFormService: UsersInfoFormService,
  ) {
    this.forms = this.fb.array([]);
  }

  ngOnInit(): void {
    this.addForm();
  }

  get formsArray(): FormControl[] {
    return this.forms.controls;
  }

  addForm(): void {
    if (this.forms.length < 10) {
      const control = new FormControl(null, Validators.required);
      this.forms.push(control);
    }
  }

  deleteForm(index: number): void {
    const confirmation = window.confirm('Are you sure you want to delete this form?');
    if (confirmation) {
      this.forms.removeAt(index);
    }
  }

  submitForms(): void {
    if (this.areAllFormsValid()) {
      this.disableForms();
      this.startSubmissionTimer(() => {
        this.submitFormsToApi();
        this.resetSubmission();
      });
    } else {
      alert('Please correct the errors before submitting.');
    }
  }

  cancelSubmission(): void {
    this.resetSubmission();
    this.enableForms();
  }

  disableForms(): void {
    this.forms.controls.forEach(control => {
      control.disable()
    });
  }

  enableForms(): void {
    this.forms.controls.forEach(control => control.enable());
  }

  areAllFormsValid(): boolean {
    return this.forms.controls.every((control: AbstractControl) => control.valid);
  }

  countInvalidForms(): number {
    return this.forms.controls.filter((control: AbstractControl) => control.invalid).length;
  }

  private startSubmissionTimer(onFinishCallBack: () => void): void {
    this.showTimer = true;
    this.timerValue = this.defaultTimerValue;
    this.timerSubscription = timer(0, 1000).pipe(
      untilDestroyed(this),
      takeWhile(() => this.timerValue > 0),
      tap(() => {
        this.timerValue--;
        if (this.timerValue === 0) {
          onFinishCallBack();
        }
        this.cdr.markForCheck();
      })
    ).subscribe();
  }

  private resetSubmission(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.showTimer = false;
    this.timerValue = this.defaultTimerValue;
  }

  private submitFormsToApi(): void {
    const formData = this.forms.getRawValue();
    this.usersInfoFormService.submitForm$(formData).subscribe(
      _ => {
        alert('Forms submitted successfully')
        this.resetForms();
        this.cdr.detectChanges();
      },
      error => {
        console.error(error);
        alert('Error submitting forms')
      }
    );
  }

  private resetForms(): void {
    this.forms.clear();
    this.addForm();
  }
}
