import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ApexTheme,
  NgApexchartsModule,
  ApexChart,
  ApexAnnotations,
  ApexDataLabels,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexStroke,
  ApexLegend,
  ApexMarkers,
  ApexNoData,
  ApexFill,
  ApexTooltip,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexYAxis,
  ApexForecastDataPoints,
  ApexGrid,
  ApexStates,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

@Component({
  selector: 'app-apex-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './apex-chart.component.html',
  styleUrl: './apex-chart.component.scss',
})
export class ApexChartComponent {
  @Input() chart!: ApexChart;
  @Input() annotations!: ApexAnnotations;
  @Input() colors!: any[];
  @Input() dataLabels!: ApexDataLabels;
  @Input() series!: ApexAxisChartSeries | ApexNonAxisChartSeries;
  @Input() stroke!: ApexStroke;
  @Input() labels!: string[];
  @Input() legend!: ApexLegend;
  @Input() markers!: ApexMarkers;
  @Input() noData!: ApexNoData;
  @Input() fill!: ApexFill;
  @Input() tooltip!: ApexTooltip;
  @Input() plotOptions!: ApexPlotOptions;
  @Input() responsive!: ApexResponsive[];
  @Input() xaxis!: ApexXAxis;
  @Input() yaxis!: ApexYAxis | ApexYAxis[];
  @Input() forecastDataPoints!: ApexForecastDataPoints;
  @Input() grid!: ApexGrid;
  @Input() states!: ApexStates;
  @Input() title!: ApexTitleSubtitle;
  @Input() subtitle!: ApexTitleSubtitle;
  @Input() theme!: ApexTheme;

  @Input() autoUpdateSeries = true;

  @Output() chartReady = new EventEmitter();
}
