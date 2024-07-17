import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { Router, RouterModule, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';

import { StationService } from '../../../Services/station.service';
import { StationInterface } from '../../../Interfaces/station.interface';
import { MaterialModules } from '../../../material.modules';
import { DeleteConfirmationDialogComponent } from '../../../Components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './stations.component.html',
  styleUrl: './stations.component.scss',
})
export class StationsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'nomStation',
    'capaciteStation',
    'typeAmmortissement',
    'isActif',
    'nomAtelier',
    'actions',
  ];
  dataSource: MatTableDataSource<StationInterface> =
    new MatTableDataSource<StationInterface>();
  station: StationInterface | null = null;
  private stationsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private stationService: StationService,
    private router: Router,

    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchStations();
    // console.log(this.dataSource.data);

    this.stationsUpdatedSub = this.stationService.stationsUpdated$.subscribe(
      () => {
        this.fetchStations();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.stationsUpdatedSub) {
      this.stationsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchStations() {
    this.stationService
      .getStations()
      .subscribe((stations: StationInterface[]) => {
        this.dataSource.data = stations;
      });
  }

  toggleIsActive(id: string): void {
    this.stationService.toggleIsActive(id).subscribe({
      next: (response: MessageResponseInterface) => {
        if (this.station) {
          this.station.isActif = !this.station.isActif; // update local state
        }
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

  openDialog(station: StationInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { station },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && station.idStation) {
        this.handleDelete(station.idStation);
      }
    });
  }

  handleDelete(idStation: string): void {
    this.stationService.deleteStation(idStation).subscribe({
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
    this.router.navigate(['/stations']);
    this.fetchStations();
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
        case 'nomStation':
          return compare(a.nomStation, b.nomStation, isAsc);
        case 'capaciteStation':
          return compare(a.capaciteStation, b.capaciteStation, isAsc);
        case 'typeAmmortissement':
          return compare(a.typeAmmortissement, b.typeAmmortissement, isAsc);
        case 'isActif':
          return compareBoolean(a.isActif, b.isActif, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

// function compareBoolean(a: boolean, b: boolean, isAsc: boolean) {
//   return (a === b ? 0 : a ? -1 : 1) * (isAsc ? 1 : -1);
// }

function compareBoolean(
  a: boolean | undefined,
  b: boolean | undefined,
  isAsc: boolean
) {
  const valA = a !== undefined ? a : false;
  const valB = b !== undefined ? b : false;
  return (valA === valB ? 0 : valA ? 1 : -1) * (isAsc ? 1 : -1);
}
