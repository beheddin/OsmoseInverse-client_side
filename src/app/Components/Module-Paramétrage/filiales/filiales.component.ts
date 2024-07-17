import {
  AfterViewInit,
  Component,
  inject,
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

import { FilialeService } from '../../../Services/filiale.service';
import { FilialeInterface } from '../../../Interfaces/filiale.interface';
import { MaterialModules } from '../../../material.modules';
import { DeleteConfirmationDialogComponent } from '../../../Components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-filiales',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './filiales.component.html',
  styleUrl: './filiales.component.scss',
})
export class FilialesComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'nomFiliale',
    'abbreviationNomFiliale',
    'actions',
  ];
  dataSource: MatTableDataSource<FilialeInterface> =
    new MatTableDataSource<FilialeInterface>();
  isFormVisible: boolean = false;
  filiale: FilialeInterface | null = null;
  private filialesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private filialeService: FilialeService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    //show add/edit form based on url
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isFormVisible =
          event.url.includes('/add') || event.url.includes('/edit');
      });
  }

  ngOnInit(): void {
    this.fetchFiliales();
    //console.log(this.dataSource);

    this.filialesUpdatedSub = this.filialeService.filialesUpdated$.subscribe(
      () => {
        this.fetchFiliales();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.filialesUpdatedSub) {
      this.filialesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchFiliales() {
    this.filialeService
      .getFiliales()
      .subscribe((filiales: FilialeInterface[]) => {
        this.dataSource.data = filiales;
      });
  }

  fetchFiliale(id: string): void {
    this.filialeService.getFilialeById(id).subscribe({
      next: (filiale: FilialeInterface) => {
        this.filiale = filiale;
      },
      error: (error) => {
        this.handleError(error.error.message);
      },
      complete: () => {
        this.handleComplete();
      },
    });
  }

  hideForm(): void {
    this.router.navigate(['/filiales']);
  }

  //delete
  openDialog(filiale: FilialeInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      // width: '300px',
      data: { filiale }, //ensure data is passed correctly as an object to the dialog component
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Check if result is true and idFiliale is defined
      if (result && filiale.idFiliale) {
        this.handleDelete(filiale.idFiliale);
      }
    });
  }

  handleDelete(idFiliale: string): void {
    console.log(idFiliale);

    this.filialeService.deleteFiliale(idFiliale).subscribe({
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
    this.router.navigate(['/filiales']);
    this.fetchFiliales(); //refresh the filiales list
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
        case 'nomFiliale':
          return compare(a.nomFiliale, b.nomFiliale, isAsc);
        case 'abbreviationNomFiliale':
          return compare(
            a.abbreviationNomFiliale,
            b.abbreviationNomFiliale,
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
