import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent {
  public lineChartData = {
    datasets: [{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  };

  // public lineChartLabels: string[] = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  // ];

  public lineChartOptions = {
    responsive: true,
  };

  // public lineChartColors = [
  //   {
  //     backgroundColor: 'rgba(255,0,0,0.3)',
  //     borderColor: 'red',
  //     pointBackgroundColor: 'rgba(255,0,0,0.3)',
  //     pointBorderColor: 'red',
  //     pointHoverBackgroundColor: 'red',
  //     pointHoverBorderColor: 'rgba(255,0,0,0.3)',
  //   },
  // ];
  // public lineChartType = 'line';
  // public lineChartLegend = true;

  constructor() {}
}
