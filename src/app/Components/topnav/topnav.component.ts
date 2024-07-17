import { Component, OnInit, inject } from '@angular/core';
import { MaterialModules } from '../../material.modules';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../Services/auth.service';
import { SidenavService } from '../../Services/sidenav.service';
import { MessageResponseInterface } from '../../Interfaces/message-response.interface';
import { EntityResponseInterface } from '../../Interfaces/entity-response.interface';
import { CompteInterface } from '../../Interfaces/compte.interface';
import { ToggleThemeComponent } from '../toggle-theme/toggle-theme.component';

@Component({
  selector: 'app-topnav',
  standalone: true,
  imports: [
    MaterialModules,
    ToggleThemeComponent,
    MatIconModule,
    NgIf,
    NgFor,
    RouterModule,
  ],
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss',
})
export class TopnavComponent implements OnInit {
  //compteData: CompteInterface | null = null;

  constructor(
    protected authService: AuthService,
    private sidenavService: SidenavService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //this.fetchCompteData();
    //console.log(this.compteData);
  }

  // fetchCompteData(): void {
  //   this.authService.getAuthenticatedCompte().subscribe({
  //     next: (response: EntityResponseInterface<CompteInterface>) => {
  //       if (response.isSuccessful) {
  //         this.compteData = response.entity;
  //       }
  //     },
  //     error: (error: any) => {
  //       this.handleError(error.error.message);
  //     },
  //     complete: () => {
  //       this.handleComplete();
  //     },
  //   });
  // }

  toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }

  logout(): void {
    //method 1
    this.authService.logout();
    this.router.navigate(['login']);

    //  //method 2
    // this.authService.logout().subscribe({
    //   next: (response: MessageResponseInterface) => {
    //     if (response.isSuccessful) {
    //       this.handleSuccess(response.message);
    //     } else {
    //       this.handleError(response.message);
    //     }
    //   },
    //   error: (error: any) => {
    //     this.handleError(error.error.message || 'An error occurred');
    //   },
    //   complete: () => {
    //     this.handleComplete();
    //   },
    // });
  }

  handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['login']);
  }

  handleError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
  }

  handleComplete(): void {
    console.log('logout complete');
  }
}
