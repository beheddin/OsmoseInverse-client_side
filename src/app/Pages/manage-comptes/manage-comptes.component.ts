import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CompteService } from '../../Services/compte.service';
import { CompteInterface } from '../../Interfaces/compte.interface';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-manage-comptes',
  standalone: true,
  imports: [MaterialModule, NgIf, RouterModule],
  templateUrl: './manage-comptes.component.html',
  styleUrl: './manage-comptes.component.scss',
})
export class ManageComptesComponent {
  displayedColumns: string[] = ['nom', 'nomRole', 'nomFiliale', 'actions'];
  dataSource: MatTableDataSource<CompteInterface> =
    new MatTableDataSource<CompteInterface>();
  selectedCompte: any = null;

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadComptes();
    console.log(this.dataSource);
  }

  loadComptes() {
    this.compteService.getComptes().subscribe((comptes: CompteInterface[]) => {
      this.dataSource.data = comptes;
    });
  }

  //checkbox selection handling
  toggleSelection(compte: any): void {
    this.selectedCompte = this.selectedCompte === compte ? null : compte;
  }

  isCardSelected(compte: any): boolean {
    return this.selectedCompte === compte;
  }

  isSelected(compte: any): boolean {
    return this.selectedCompte === compte;
  }

  infoAction(filiale: any): void {
    console.log(filiale);
  }

  createAction(filiale: any): void {
    console.log(filiale);
  }

  updateAction(filiale: any): void {
    console.log(filiale);
  }

  deleteAction(filiale: any): void {
    console.log(filiale);
  }
}
