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
import { ObjectifInterface } from '../../../Interfaces/objectif.interface';
import { ObjectifService } from '../../../Services/objectif.service';

@Component({
  selector: 'app-objectifs',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './objectifs.component.html',
  styleUrl: './objectifs.component.scss',
})
export class ObjectifsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'labelObjectif',
    'annee',
    'tdSeauBrute',
    'tdSeauOsmosee',
    'rendementMembranes',
    'rendement',
    'permanentFlow',
    'tauxExploitation',
    'deltaPMicrofiltre',
    'deltaPMembrane',
    'deltaPSable',
    'cout',
    'th',
    'ph',
    'tauxChlorure',
    'nomStation',
    'actions',
  ];
  dataSource: MatTableDataSource<ObjectifInterface> =
    new MatTableDataSource<ObjectifInterface>();
  objectif: ObjectifInterface | null = null;
  private objectifsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private objectifService: ObjectifService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchObjectifs();
    this.objectifsUpdatedSub = this.objectifService.objectifsUpdated$.subscribe(
      () => {
        this.fetchObjectifs();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.objectifsUpdatedSub) {
      this.objectifsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchObjectifs() {
    this.objectifService
      .getObjectifs()
      .subscribe((objectifs: ObjectifInterface[]) => {
        this.dataSource.data = objectifs;
      });
    //console.log(this.dataSource.data);
  }

  openDialog(objectif: ObjectifInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { objectif },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && objectif.idObjectif) {
        this.handleDelete(objectif.idObjectif);
      }
    });
  }

  handleDelete(idObjectif: string): void {
    this.objectifService.deleteObjectif(idObjectif).subscribe({
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
    this.router.navigate(['/objectifs']);
    this.fetchObjectifs();
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
        case 'labelObjectif':
          return compare(a.labelObjectif, b.labelObjectif, isAsc);
        case 'annee':
          return compare(a.annee, b.annee, isAsc);
        case 'tdSeauBrute':
          return compare(a.tdSeauBrute, b.tdSeauBrute, isAsc);
        case 'tdSeauOsmosee':
          return compare(a.tdSeauOsmosee, b.tdSeauOsmosee, isAsc);
        case 'rendementMembranes':
          return compare(a.rendementMembranes, b.rendementMembranes, isAsc);
        case 'rendement':
          return compare(a.rendement, b.rendement, isAsc);
        case 'permanentFlow':
          return compare(a.permanentFlow, b.permanentFlow, isAsc);
        case 'tauxExploitation':
          return compare(a.tauxExploitation, b.tauxExploitation, isAsc);
        case 'deltaPMicrofiltre':
          return compare(a.deltaPMicrofiltre, b.deltaPMicrofiltre, isAsc);
        case 'deltaPMembrane':
          return compare(a.deltaPMembrane, b.deltaPMembrane, isAsc);
        case 'deltaPSable':
          return compare(a.deltaPSable, b.deltaPSable, isAsc);
        case 'cout':
          return compare(a.cout, b.cout, isAsc);
        case 'th':
          return compare(a.th, b.th, isAsc);
        case 'ph':
          return compare(a.ph, b.ph, isAsc);
        case 'tauxChlorure':
          return compare(a.tauxChlorure, b.tauxChlorure, isAsc);
        case 'nomStation':
          return compare(a.nomStation, b.nomStation, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
