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
import { TypeMembraneInterface } from '../../../Interfaces/type-membrane.interface';
import { TypeMembraneService } from '../../../Services/type-membrane.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-types-membranes',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './types-membranes.component.html',
  styleUrl: './types-membranes.component.scss',
})
export class TypesMembranesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = [
    'labelTypeMembrane',
    'tailleTypeMembrane',
    'actions',
  ];
  dataSource: MatTableDataSource<TypeMembraneInterface> =
    new MatTableDataSource<TypeMembraneInterface>();
  typeMembrane: TypeMembraneInterface | null = null;
  private typesMembranesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private typeMembraneService: TypeMembraneService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchTypesMembranes();
    this.typesMembranesUpdatedSub =
      this.typeMembraneService.typesMembranesUpdated$.subscribe(() => {
        this.fetchTypesMembranes();
      });
  }

  ngOnDestroy(): void {
    if (this.typesMembranesUpdatedSub) {
      this.typesMembranesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchTypesMembranes() {
    this.typeMembraneService
      .getTypesMembranes()
      .subscribe((typesMembranes: TypeMembraneInterface[]) => {
        this.dataSource.data = typesMembranes;
      });
  }

  openDialog(typeMembrane: TypeMembraneInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { typeMembrane },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeMembrane.idTypeMembrane) {
        this.handleDelete(typeMembrane.idTypeMembrane);
      }
    });
  }

  handleDelete(idTypeMembrane: string): void {
    this.typeMembraneService.deleteTypeMembrane(idTypeMembrane).subscribe({
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
    this.router.navigate(['/types-membranes']);
    this.fetchTypesMembranes();
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
        case 'labelTypeMembrane':
          return compare(a.labelTypeMembrane, b.labelTypeMembrane, isAsc);
        case 'tailleTypeMembrane':
          return compare(a.tailleTypeMembrane, b.tailleTypeMembrane, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
