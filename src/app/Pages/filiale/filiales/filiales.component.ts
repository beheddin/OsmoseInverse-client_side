import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
// import { MatTableModule } from '@angular/material/table';

import { FilialeService } from '../../../Services/filiale.service';
import { FilialeInterface } from '../../../Interfaces/filiale.interface';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-filiales',
  standalone: true,
  imports: [
    MaterialModule, 
    // MatTableDataSource
  ],
  templateUrl: './filiales.component.html',
  styleUrl: './filiales.component.scss',
})
export class FilialesComponent implements OnInit {
  displayedColumns: string[] = ['filialeId', 'filialeLabel'];
  dataSource: MatTableDataSource<FilialeInterface> = new MatTableDataSource<FilialeInterface>();

  // private filialeService = inject(FilialeService);
  constructor(private filialeService: FilialeService) {}

  ngOnInit(): void {
    this.loadFiliales();
    //console.log(this.dataSource);
  }

  loadFiliales() {
    this.filialeService.getFiliales().subscribe((filiales: FilialeInterface[]) => {
      this.dataSource.data = filiales;
    });
  }
}
