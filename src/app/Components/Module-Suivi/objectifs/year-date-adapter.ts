import { Injectable } from '@angular/core';
import {
  NativeDateAdapter,
  MatDateFormats,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material/core';

@Injectable()
export class YearDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.length === 4) {
      // return new Date(value);
      const year = parseInt(value, 10);
      return new Date(year, 0, 1); // only consider the year
    }
    return value ? new Date(value) : null;
  }

  override format(date: Date, displayFormat: Object): string {
    return date.getFullYear().toString();
  }
}

export const YEAR_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};
