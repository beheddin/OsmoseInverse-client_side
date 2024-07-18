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
import { ChecklistInterface } from '../../../Interfaces/checklist.interface';
import { ChecklistService } from '../../../Services/checklist.service';

@Component({
  selector: 'app-checklists',
  standalone: true,
  imports: [
    MaterialModules,
    RouterModule,
    MatSortModule,
    NgIf,
    DatePipe,
    AddEditSectionComponent,
  ],
  templateUrl: './checklists.component.html',
  styleUrl: './checklists.component.scss',
})
export class ChecklistsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['labelChecklist', 'nomStation', 'actions'];
  dataSource: MatTableDataSource<ChecklistInterface> =
    new MatTableDataSource<ChecklistInterface>();
  checklist: ChecklistInterface | null = null;
  private checklistsUpdatedSub: Subscription = new Subscription();

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private checklistService: ChecklistService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchChecklists();
    this.checklistsUpdatedSub =
      this.checklistService.checklistsUpdated$.subscribe(() => {
        this.fetchChecklists();
      });
  }

  ngOnDestroy(): void {
    if (this.checklistsUpdatedSub) {
      this.checklistsUpdatedSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  fetchChecklists() {
    this.checklistService
      .getChecklists()
      .subscribe((checklists: ChecklistInterface[]) => {
        this.dataSource.data = checklists;
      });
  }

  openDialog(checklist: ChecklistInterface): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { checklist },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && checklist.idChecklist) {
        this.handleDelete(checklist.idChecklist);
      }
    });
  }

  handleDelete(idChecklist: string): void {
    this.checklistService.deleteChecklist(idChecklist).subscribe({
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
    this.router.navigate(['/checklists']);
    this.fetchChecklists();
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
        case 'labelChecklist':
          return compare(a.labelChecklist, b.labelChecklist, isAsc);

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
