import { Component } from '@angular/core';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SalesOverviewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
