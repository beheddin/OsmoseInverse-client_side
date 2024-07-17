import { Directive, Input } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[minLengthNumber]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MinLengthNumberValidatorDirective,
      multi: true,
    },
  ],
})
export class MinLengthNumberValidatorDirective implements Validator {
  @Input('minLengthNumber') minLength!: number;

  validate(control: AbstractControl): ValidationErrors | null {
    if (
      control.value === null ||
      control.value === undefined ||
      isNaN(control.value)
    ) {
      return null; // Handle optional fields or non-numeric values
    }

    const stringValue = control.value.toString();
    return stringValue.length >= this.minLength
      ? null
      : { minLengthNumber: { requiredLength: this.minLength } };
  }
}
