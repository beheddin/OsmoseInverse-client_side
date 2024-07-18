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

import { MaterialModules } from '../../../material.modules';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';
import { EquipementInterface } from '../../../Interfaces/equipement.interface';
import { EquipementService } from '../../../Services/equipement.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-equipements',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './equipements.component.html',
  styleUrl: './equipements.component.scss',
})
export class EquipementsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'labelEquipement',
    'nomStation',
    'labelNatureEquipement',
    'labelTypeEquipement',
    'actions',
  ];
  dataSource: MatTableDataSource<EquipementInterface> =
    new MatTableDataSource<EquipementInterface>();
  equipement: EquipementInterface | null = null;
  private equipementsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private equipementService: EquipementService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchEquipements();
    this.equipementsUpdatedSub =
      this.equipementService.equipementsUpdated$.subscribe(() => {
        this.fetchEquipements();
      });
  }

  ngOnDestroy(): void {
    if (this.equipementsUpdatedSub) {
      this.equipementsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchEquipements() {
    this.equipementService
      .getEquipements()
      .subscribe((equipements: EquipementInterface[]) => {
        this.dataSource.data = equipements;
      });
  }

  openDialog(equipement: EquipementInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { equipement },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && equipement.idEquipement) {
        this.handleDelete(equipement.idEquipement);
      }
    });
  }

  handleDelete(idEquipement: string): void {
    this.equipementService.deleteEquipement(idEquipement).subscribe({
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
    this.router.navigate(['/equipements']);
    this.fetchEquipements();
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
        case 'labelEquipement':
          return compare(a.labelEquipement, b.labelEquipement, isAsc);
        case 'nomStation':
          return compare(a.nomStation, b.nomStation, isAsc);
        case 'labelNatureEquipement':
          return compare(
            a.labelNatureEquipement,
            b.labelNatureEquipement,
            isAsc
          );
        case 'labelTypeEquipement':
          return compare(a.labelTypeEquipement, b.labelTypeEquipement, isAsc);

        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
