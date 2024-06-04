import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

import { MaterialModule } from '../../material.module';
import { SidenavService } from '../../Services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MaterialModule, NgFor],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit, OnDestroy {
  isSidenavOpened = false;
  private sidenavSubscription!: Subscription;

  // private sidenavService = inject(SidenavService);
  constructor(private sidenavService: SidenavService) {}

  menuBtnItems: string[] = [
    // 'Utilisateurs',
    'Users',
    'Roles',
    'Filiales',
    'Ateliers',
    'Stations',
  ];

  ngOnInit() {
    this.sidenavSubscription = this.sidenavService
      .getSidenavState()
      .subscribe((isOpened: boolean) => {
        this.isSidenavOpened = isOpened;
      });
  }

  ngOnDestroy(): void {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }

  toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }
}
