import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MaterialModules } from '../../../material.modules';

@Component({
  selector: 'app-sources-eaux',
  standalone: true,
  imports: [MaterialModules, RouterModule],
  templateUrl: './sources-eau.component.html',
  styleUrl: './sources-eau.component.scss',
})
export class SourcesEauComponent {
  constructor(private router: Router) {}

  onTabChange(event: any) {
    if (event.index === 0) {
      this.router.navigate(['/sources-eau/bassins']);
    } else if (event.index === 1) {
      this.router.navigate(['/sources-eau/puits']);
    }
  }
}
