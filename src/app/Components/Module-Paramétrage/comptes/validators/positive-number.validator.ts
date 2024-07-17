import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

//Custom Validator Function
export function positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // const isPositive = control.value > 0;
    // const value = control.value;
    // const isPositive = /^[1-9]\d*$/.test(value); //Regex to check if value is positive
    // return isPositive ? null : { notPositive: { value: value } }; // Return notPositive error if value is not positive

    if (control.value != null && control.value <= 0) {
      return { notPositive: true };
    }
    return null;
  };
}
