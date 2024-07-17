import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MaterialModules } from '../../material.modules';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [MaterialModules],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
