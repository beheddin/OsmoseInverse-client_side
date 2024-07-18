import { Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { positiveNumberValidator } from '../validators/positive-number.validator';

//Custom Directive
@Directive({
  standalone: true,
  selector: '[positiveNumber]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PositiveNumberValidatorDirective,
      multi: true,
    },
  ],
})
export class PositiveNumberValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return positiveNumberValidator()(control);
  }
}
