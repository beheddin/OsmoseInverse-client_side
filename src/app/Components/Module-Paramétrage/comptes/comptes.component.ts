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
import {
  Router,
  RouterModule,
  ActivatedRoute,
  NavigationEnd,
  Event,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';

import { CompteService } from '../../../Services/compte.service';
import { CompteInterface } from '../../../Interfaces/compte.interface';
import { MaterialModules } from '../../../material.modules';
import { DeleteConfirmationDialogComponent } from '../../../Components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageResponseInterface } from '../../../Interfaces/message-response.interface';
import { AddEditSectionComponent } from '../../add-edit-section/add-edit-section.component';

@Component({
  selector: 'app-comptes',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    AddEditSectionComponent,
  ],
  templateUrl: './comptes.component.html',
  styleUrl: './comptes.component.scss',
})
export class ComptesComponent implements OnInit {
  displayedColumns: string[] = [
    'nom',
    'nomRole',
    'nomFiliale',
    'access',
    'actions',
  ];
  dataSource: MatTableDataSource<CompteInterface> =
    new MatTableDataSource<CompteInterface>();
  idCompte: string | null = '';
  compte: CompteInterface | null = null;

  //service to trigger ComptesComponent from CompteFormComponent to refresh the table
  private comptesUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private compteService: CompteService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchComptes();
    //console.log(this.dataSource);

    //service to trigger ComptesComponent from CompteFormComponent to refresh the table
    this.comptesUpdatedSub = this.compteService.comptesUpdated$.subscribe(
      () => {
        this.fetchComptes();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.comptesUpdatedSub) {
      this.comptesUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchComptes() {
    this.compteService.getComptes().subscribe((comptes: CompteInterface[]) => {
      this.dataSource.data = comptes;
    });
  }

  // method 2
  // handleEdit(id: string): void {
  //   this.isFormVisible = true;
  //   this.router.navigate([`/comptes/edit/${id}`]);
  // }

  fetchCompte(id: string): void {
    // Assuming you have a method in compteService to fetch compte by id
    this.compteService.getCompteById(id).subscribe({
      next: (compte: CompteInterface) => {
        this.compte = compte;
      },
      error: (error: any) => {
        this.handleError(error.error.message);
      },
      complete: () => {
        this.handleComplete();
      },
    });
  }

  //toggleAccess(id: string, access: boolean): void {
  toggleAccess(id: string): void {
    this.compteService.toggleAccess(id).subscribe({
      next: (response: MessageResponseInterface) => {
        if (this.compte) {
          this.compte.access = !this.compte.access; // update local state
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

  //delete
  openDialog(compte: CompteInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { compte }, //ensure data is passed correctly as an object to the dialog component
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Check if result is true and idCompte is defined
      if (result && compte.idCompte) {
        this.handleDelete(compte.idCompte);
      }
    });
  }

  //delete
  handleDelete(idCompte: string): void {
    console.log(idCompte);

    this.compteService.deleteCompte(idCompte).subscribe({
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
    this.router.navigate(['comptes']);
    this.fetchComptes(); //refresh the comptes list
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
        case 'nom':
          return compare(a.nom, b.nom, isAsc);
        case 'nomRole':
          return compare(a.nomRole, b.nomRole, isAsc);
        case 'nomFiliale':
          return compare(a.nomFiliale, b.nomFiliale, isAsc);
        case 'access':
          return compareBoolean(a.access, b.access, isAsc);
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
