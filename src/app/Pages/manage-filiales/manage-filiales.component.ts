import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgIf } from '@angular/common';

import { FilialeService } from '../../Services/filiale.service';
import { FilialeInterface } from '../../Interfaces/filiale.interface';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-manage-filiales',
  standalone: true,
  imports: [MaterialModule, NgIf],
  templateUrl: './manage-filiales.component.html',
  styleUrl: './manage-filiales.component.scss',
})
export class ManageFilialesComponent implements OnInit {
  // displayedColumns: string[] = ['filialeId', 'filialeLabel'];
  displayedColumns: string[] = ['nomFiliale', 'abbreviationNomFiliale', 'actions'];
  dataSource: MatTableDataSource<FilialeInterface> =
    new MatTableDataSource<FilialeInterface>();
  selectedFiliale: any = null;

  // private filialeService = inject(FilialeService);
  constructor(private filialeService: FilialeService) {}

  ngOnInit(): void {
    this.loadFiliales();
    //console.log(this.dataSource);
  }

  loadFiliales() {
    this.filialeService
      .getFiliales()
      .subscribe((filiales: FilialeInterface[]) => {
        this.dataSource.data = filiales;
      });
  }

  //checkbox selection handling
  toggleSelection(filiale: any): void {
    this.selectedFiliale = this.selectedFiliale === filiale ? null : filiale;
  }

  isCardSelected(filiale: any): boolean {
    return this.selectedFiliale === filiale;
  }

  isSelected(filiale: any): boolean {
    return this.selectedFiliale === filiale;
  }

  createAction(): void {
    console.log("created");
  }

  updateAction(filiale: any): void {
    console.log(filiale);
  }

  deleteAction(filiale: any): void {
    console.log(filiale);
  }
}
