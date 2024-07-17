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
import { TypeEquipementInterface } from '../../../Interfaces/type-equipement.interface';
import { TypeEquipementService } from '../../../Services/type-equipement.service';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-types-equipements',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './types-equipements.component.html',
  styleUrl: './types-equipements.component.scss',
})
export class TypesEquipementsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = ['labelTypeEquipement', 'actions'];
  dataSource: MatTableDataSource<TypeEquipementInterface> =
    new MatTableDataSource<TypeEquipementInterface>();
  typeEquipement: TypeEquipementInterface | null = null;
  private typesEquipementsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private typeEquipementService: TypeEquipementService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchTypesEquipements();
    this.typesEquipementsUpdatedSub =
      this.typeEquipementService.typesEquipementsUpdated$.subscribe(() => {
        this.fetchTypesEquipements();
      });
  }

  ngOnDestroy(): void {
    if (this.typesEquipementsUpdatedSub) {
      this.typesEquipementsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchTypesEquipements() {
    this.typeEquipementService
      .getTypesEquipements()
      .subscribe((typesEquipements: TypeEquipementInterface[]) => {
        this.dataSource.data = typesEquipements;
      });
  }

  openDialog(typeEquipement: TypeEquipementInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { typeEquipement },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeEquipement.idTypeEquipement) {
        this.handleDelete(typeEquipement.idTypeEquipement);
      }
    });
  }

  handleDelete(idTypeEquipement: string): void {
    this.typeEquipementService
      .deleteTypeEquipement(idTypeEquipement)
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
    this.router.navigate(['/types-equipements']);
    this.fetchTypesEquipements();
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
