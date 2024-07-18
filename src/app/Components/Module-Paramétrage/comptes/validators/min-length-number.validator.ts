import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// convert a number to a string then check its length
export function minLengthNumberValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined) {
      return null; // Handle optional fields
    }

    const stringValue = control.value.toString();
    return stringValue.length >= minLength ? null : { minLengthNumber: true };
  };
}
