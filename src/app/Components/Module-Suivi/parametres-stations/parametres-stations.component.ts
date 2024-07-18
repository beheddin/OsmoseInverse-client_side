import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe, NgIf } from '@angular/common';
import { Router, RouterModule, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';

import { MaterialModules } from '../../../material.modules';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';
import { ParametreStationInterface } from '../../../Interfaces/parametre-station.interface';
import { ParametreStationService } from '../../../Services/parametre-station.service';

@Component({
  selector: 'app-parametres-stations',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './parametres-stations.component.html',
  styleUrl: './parametres-stations.component.scss',
})
export class ParametresStationsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = [
    'labelParametreStation',
    'nomStation',
    'labelParametreSuivi',
    'actions',
  ];
  dataSource: MatTableDataSource<ParametreStationInterface> =
    new MatTableDataSource<ParametreStationInterface>();
  parametreStation: ParametreStationInterface | null = null;
  private parametresStationsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private parametreStationService: ParametreStationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchParametresStations();
    this.parametresStationsUpdatedSub =
      this.parametreStationService.parametresStationsUpdated$.subscribe(() => {
        this.fetchParametresStations();
      });
  }

  ngOnDestroy(): void {
    if (this.parametresStationsUpdatedSub) {
      this.parametresStationsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchParametresStations() {
    this.parametreStationService
      .getParametresStations()
      .subscribe((parametreStations: ParametreStationInterface[]) => {
        this.dataSource.data = parametreStations;
      });
  }

  openDialog(parametreStation: ParametreStationInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { parametreStation },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && parametreStation.idParametreStation) {
        this.handleDelete(parametreStation.idParametreStation);
      }
    });
  }

  handleDelete(idParametreStation: string): void {
    this.parametreStationService
      .deleteParametreStation(idParametreStation)
      .subscribe({
        next: (response: MessageResponseInterface) => {
          this.handleSuccess(response.message);
        },
        error: (error: MessageResponseInterface) => {
          this.handleError(error.message);
        },
        complete: () => {
          this.handleComplete();
        },
      });
  }

  handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['/lavages-chimiques']);
    this.fetchParametresStations();
  }

  handleError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
  }

  handleComplete(): void {
    console.log('operation complete');
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'labelParametreStation':
          return compare(
            a.labelParametreStation,
            b.labelParametreStation,
            isAsc
          );
        case 'nomStation':
          return compare(
            new Date(a.nomStation).getTime(),
            new Date(b.nomStation).getTime(),
            isAsc
          );
        case 'labelParametreSuivi':
          return compare(a.labelParametreSuivi, b.labelParametreSuivi, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
