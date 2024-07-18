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
import { FournisseurInterface } from '../../../Interfaces/fournisseur.interface';
import { FournisseurService } from '../../../Services/fournisseur.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';

@Component({
  selector: 'app-fournisseurs',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './fournisseurs.component.html',
  styleUrl: './fournisseurs.component.scss',
})
export class FournisseursComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'nomFournisseur',
    'numTelFournisseur',
    'numFaxFournisseur',
    'emailFournisseur',
    'addresseFournisseur',
    'actions',
  ];
  dataSource: MatTableDataSource<FournisseurInterface> =
    new MatTableDataSource<FournisseurInterface>();
  fournisseur: FournisseurInterface | null = null;
  private fournisseursUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private fournisseurService: FournisseurService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchFournisseurs();
    this.fournisseursUpdatedSub =
      this.fournisseurService.fournisseursUpdated$.subscribe(() => {
        this.fetchFournisseurs();
      });
  }

  ngOnDestroy(): void {
    if (this.fournisseursUpdatedSub) {
      this.fournisseursUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchFournisseurs() {
    this.fournisseurService
      .getFournisseurs()
      .subscribe((fournisseurs: FournisseurInterface[]) => {
        this.dataSource.data = fournisseurs;
      });
  }

  openDialog(fournisseur: FournisseurInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { fournisseur },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && fournisseur.idFournisseur) {
        this.handleDelete(fournisseur.idFournisseur);
      }
    });
  }

  handleDelete(idFournisseur: string): void {
    this.fournisseurService.deleteFournisseur(idFournisseur).subscribe({
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
    this.router.navigate(['/fournisseurs']);
    this.fetchFournisseurs();
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
        case 'nomFournisseur':
          return compare(a.nomFournisseur, b.nomFournisseur, isAsc);
        case 'numTelFournisseur':
          return compare(a.numTelFournisseur, b.numTelFournisseur, isAsc);
        case 'numFaxFournisseur':
          return compare(a.numFaxFournisseur, b.numFaxFournisseur, isAsc);
        case 'emailFournisseur':
          return compare(a.emailFournisseur, b.emailFournisseur, isAsc);
        case 'addresseFournisseur':
          return compare(a.addresseFournisseur, b.addresseFournisseur, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
