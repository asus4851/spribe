import {Directive, ElementRef, Input, Renderer2, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Directive({
  selector: '[appErrorMessage]'
})
export class ErrorMessageDirective implements OnInit {
  @Input('appErrorMessage') controlName!: string;
  @Input() formGroup!: FormGroup;
  @Input() errorMessages: { [key: string]: string } = {};
  errorElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    const control = this.formGroup.get(this.controlName);
    if (control) {
      control.statusChanges.subscribe(() => {
        this.updateErrorMessage();
      });
      this.updateErrorMessage();
    }
  }

  private updateErrorMessage(): void {
    const control = this.formGroup.get(this.controlName);
    if (control && control.invalid) {
      this.showErrorMessage();
    } else {
      this.hideErrorMessage();
    }
  }

  private showErrorMessage(): void {
    const control = this.formGroup.get(this.controlName);
    if (!control || !control.errors) return;

    const errorKey = Object.keys(control.errors)[0];
    const errorMessage = this.errorMessages[errorKey];

    if (!errorMessage) return;

    if (!this.errorElement) {
      this.errorElement = this.renderer.createElement('div');
      this.renderer.addClass(this.errorElement, 'text-danger');
      this.renderer.setStyle(this.errorElement, 'margin-top', '5px');
      this.renderer.setStyle(this.errorElement, 'font-size', '0.875em');
      this.renderer.setProperty(this.errorElement, 'innerText', errorMessage);
      this.renderer.appendChild(this.el.nativeElement.parentNode, this.errorElement);
    } else {
      this.renderer.setProperty(this.errorElement, 'innerText', errorMessage);
    }
  }

  private hideErrorMessage(): void {
    if (this.errorElement) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, this.errorElement);
      this.errorElement = null;
    }
  }
}
