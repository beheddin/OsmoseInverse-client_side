import { Component, OnInit, inject } from '@angular/core';
import { MaterialModules } from '../../material.modules';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, NavigationEnd, Event } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../Services/auth.service';
import { MessageResponseInterface } from '../../Interfaces/message-response.interface';
import { EntityResponseInterface } from '../../Interfaces/entity-response.interface';
import { CompteInterface } from '../../Interfaces/compte.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MaterialModules, MatIconModule, NgIf, NgFor, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  compteData: CompteInterface | null = null;
  isFormVisible: boolean = false;

  constructor(
    private authService: AuthService, // private compteService: CompteService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    //method 1
    //this.compteData = this.authService.getUserDetails();
    // console.log(this.compteData);
    //method 2
    this.getCompteData();

    //change this.isFormVisible value based on url to show/hide the change password form
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isFormVisible = event.url.includes('/changePassword');
      });
  }

  //method 2
  getCompteData(): void {
    this.authService.getAuthenticatedCompte().subscribe({
      next: (response: EntityResponseInterface<CompteInterface>) => {
        if (response.isSuccessful) {
          this.handleSuccess(response.entity);
        }
      },
      error: (error: any) => {
        this.handleError(error.error.message);
      },
      complete: () => {
        this.handleComplete();
      },
    });
  }

  handleSuccess(entity: CompteInterface): void {
    this.compteData = entity;
    console.log(this.compteData);
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

  hideForm(): void {
    this.router.navigate(['profile']);
  }
}
