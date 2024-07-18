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
import { TypeCartoucheInterface } from '../../../Interfaces/type-cartouche.interface';
import { TypeCartoucheService } from '../../../Services/type-cartouche.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-types-cartouches',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './types-cartouches.component.html',
  styleUrl: './types-cartouches.component.scss',
})
export class TypesCartouchesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  displayedColumns: string[] = ['labelTypeCartouche', 'actions'];
  dataSource: MatTableDataSource<TypeCartoucheInterface> =
    new MatTableDataSource<TypeCartoucheInterface>();
  typeCartouche: TypeCartoucheInterface | null = null;
  private typesCartouchesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private typeCartoucheService: TypeCartoucheService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchTypesCartouches();
    this.typesCartouchesUpdatedSub =
      this.typeCartoucheService.typesCartouchesUpdated$.subscribe(() => {
        this.fetchTypesCartouches();
      });
  }

  ngOnDestroy(): void {
    if (this.typesCartouchesUpdatedSub) {
      this.typesCartouchesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchTypesCartouches() {
    this.typeCartoucheService
      .getTypesCartouches()
      .subscribe((typesCartouches: TypeCartoucheInterface[]) => {
        this.dataSource.data = typesCartouches;
      });
  }

  openDialog(typeCartouche: TypeCartoucheInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { typeCartouche },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeCartouche.idTypeCartouche) {
        this.handleDelete(typeCartouche.idTypeCartouche);
      }
    });
  }

  handleDelete(idTypeCartouche: string): void {
    this.typeCartoucheService.deleteTypeCartouche(idTypeCartouche).subscribe({
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
    this.router.navigate(['/types-cartouches']);
    this.fetchTypesCartouches();
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
        case 'labelTypeCartouche':
          return compare(a.labelTypeCartouche, b.labelTypeCartouche, isAsc);

        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
