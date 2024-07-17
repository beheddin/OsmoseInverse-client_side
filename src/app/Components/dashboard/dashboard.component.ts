import { Component, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from 'ng-apexcharts';
import { ApexChartWrapperComponent } from './apex-chart-wrapper/apex-chart-wrapper.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ApexChartWrapperComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions;
  public isBrowser: boolean = false;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Example',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        // curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
        ],
      },
    };
  }

  afterNextRender() {
    this.isBrowser = true;
  }
}
