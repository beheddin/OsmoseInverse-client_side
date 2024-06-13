import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

import { MaterialModule } from '../../material.module';
import { SidenavService } from '../../Services/sidenav.service';
import { MenuBtnItemsInterface } from '../../Interfaces/menu-btn-items.interface';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MaterialModule, NgFor, NgIf, NgClass],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})

export class SidenavComponent implements OnInit, OnDestroy {
  isOpenSidenav = false;
  private sidenavSubscription!: Subscription;
  isOpenPanel: boolean = false;

  // private sidenavService = inject(SidenavService);
  constructor(private sidenavService: SidenavService) {}

  menuBtnItems: MenuBtnItemsInterface[] = [
    {
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      label: 'Gestion des Comptes',
      route: 'comptes',
    },
    {
      label: 'Paramétrage',
      route: 'parametrage',
      subItems: [
        { label: 'Filiales', route: 'parametrage/filiales' },
        { label: 'Ateliers', route: 'parametrage/ateliers' },
        { label: 'Stations', route: 'parametrage/stations' },
      ],
    },
  ];

  ngOnInit() {
    this.sidenavSubscription = this.sidenavService
      .getSidenavState()
      .subscribe((isOpen: boolean) => {
        this.isOpenSidenav = isOpen;
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
