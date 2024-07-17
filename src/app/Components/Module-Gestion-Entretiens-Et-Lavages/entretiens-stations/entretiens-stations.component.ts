import {
  AfterViewInit,
  Component,
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

import { EntretienStationService } from '../../../Services/entretien-station.service';
import { EntretienStationInterface } from '../../../Interfaces/entretien-station.interface';
import { DeleteConfirmationDialogComponent } from '../../../Components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';
import { MaterialModules } from '../../../material.modules';

@Component({
  selector: 'app-entretiens-stations',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './entretiens-stations.component.html',
  styleUrls: ['./entretiens-stations.component.scss'],
})
export class StationsEntretiensComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = [
    'nomEntretienStation',
    'descriptionEntretienStation',
    'chargeEntretienStation',
    'isExternalEntretienStation',
    'nomStation',
    'nomFournisseur',
    'actions',
  ];
  dataSource: MatTableDataSource<EntretienStationInterface> =
    new MatTableDataSource<EntretienStationInterface>();
  entretienStation: EntretienStationInterface | null = null;
  private entretienStationsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private entretienStationService: EntretienStationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchEntretienStations();
    this.entretienStationsUpdatedSub =
      this.entretienStationService.entretiensStationsUpdated$.subscribe(() => {
        this.fetchEntretienStations();
      });
  }

  ngOnDestroy(): void {
    if (this.entretienStationsUpdatedSub) {
      this.entretienStationsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchEntretienStations() {
    this.entretienStationService
      .getEntretiensStations()
      .subscribe((entretienStations: EntretienStationInterface[]) => {
        this.dataSource.data = entretienStations;
      });
  }

  toggleIsExternalEntretienStation(id: string): void {
    this.entretienStationService
      .toggleIsExternalEntretienStation(id)
      .subscribe({
        next: (response: MessageResponseInterface) => {
          if (this.entretienStation) {
            this.entretienStation.isExternalEntretienStation =
              !this.entretienStation.isExternalEntretienStation; // update local state
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

  openDialog(entretienStation: EntretienStationInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { entretienStation },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && entretienStation.idEntretienStation) {
        this.handleDelete(entretienStation.idEntretienStation);
      }
    });
  }

  handleDelete(idEntretienStation: string): void {
    this.entretienStationService
      .deleteEntretienStation(idEntretienStation)
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
    this.router.navigate(['/entretiens-stations']);
    this.fetchEntretienStations();
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
        case 'nomEntretienStation':
          return compare(a.nomEntretienStation, b.nomEntretienStation, isAsc);
        case 'chargeEntretienStation':
          return compare(
            a.chargeEntretienStation,
            b.chargeEntretienStation,
            isAsc
          );
        case 'isExternalEntretienStation':
          return compareBoolean(
            a.isExternalEntretienStation,
            b.isExternalEntretienStation,
            isAsc
          );
        case 'nomStation':
          return compare(a.nomStation, b.nomStation, isAsc);
        case 'nomFournisseur':
          return compare(a.nomFournisseur, b.nomFournisseur, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareBoolean(
  a: boolean | undefined,
  b: boolean | undefined,
  isAsc: boolean
) {
  const valA = a !== undefined ? a : false;
  const valB = b !== undefined ? b : false;
  return (valA === valB ? 0 : valA ? 1 : -1) * (isAsc ? 1 : -1);
}
