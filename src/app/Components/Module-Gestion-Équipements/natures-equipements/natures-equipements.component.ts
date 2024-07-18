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

import { MaterialModules } from '../../../material.modules';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';
import { NatureEquipementInterface } from '../../../Interfaces/nature-equipement.interface';
import { NatureEquipementService } from '../../../Services/nature-equipement.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-natures-equipements',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './natures-equipements.component.html',
  styleUrl: './natures-equipements.component.scss',
})
export class NaturesEquipementsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = ['labelNatureEquipement', 'actions'];
  dataSource: MatTableDataSource<NatureEquipementInterface> =
    new MatTableDataSource<NatureEquipementInterface>();
  naturesEquipement: NatureEquipementInterface | null = null;
  private naturesEquipementsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private naturesEquipementService: NatureEquipementService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchNaturesEquipements();
    this.naturesEquipementsUpdatedSub =
      this.naturesEquipementService.naturesEquipementsUpdated$.subscribe(() => {
        this.fetchNaturesEquipements();
      });
  }

  ngOnDestroy(): void {
    if (this.naturesEquipementsUpdatedSub) {
      this.naturesEquipementsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchNaturesEquipements() {
    this.naturesEquipementService
      .getNaturesEquipements()
      .subscribe((naturesEquipements: NatureEquipementInterface[]) => {
        this.dataSource.data = naturesEquipements;
      });
  }

  openDialog(naturesEquipement: NatureEquipementInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { naturesEquipement },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && naturesEquipement.idNatureEquipement) {
        this.handleDelete(naturesEquipement.idNatureEquipement);
      }
    });
  }

  handleDelete(idNaturesEquipement: string): void {
    this.naturesEquipementService
      .deleteNatureEquipement(idNaturesEquipement)
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
    this.router.navigate(['/natures-equipements']);
    this.fetchNaturesEquipements();
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
        case 'labelNatureEquipement':
          return compare(
            a.labelNatureEquipement,
            b.labelNatureEquipement,
            isAsc
          );

        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
