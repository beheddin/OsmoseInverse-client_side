import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

import { MaterialModules } from '../../material.modules';
import { StationFormComponent } from '../Module-Paramétrage/stations/station-form/station-form.component';

@Component({
  selector: 'app-add-edit-section',
  standalone: true,
  imports: [MaterialModules, RouterModule, NgIf, StationFormComponent],
  templateUrl: './add-edit-section.component.html',
  styleUrl: './add-edit-section.component.scss',
})
export class AddEditSectionComponent implements OnInit {
  // method 2
  // @Input() addLink: string = 'add';
  // @Input() isFormVisible: boolean = false;
  // isFormVisible: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.isFormVisible =
    //       event.url.includes('/add') || event.url.includes('/edit');
    //   }
    // });
  }

  // //method 2
  // constructor() {
  // //show add/edit/changePassword form based on url
  // this.router.events
  //   .pipe(
  //     filter(
  //       (event: Event): event is NavigationEnd =>
  //         event instanceof NavigationEnd
  //     )
  //   )
  //   .subscribe((event: NavigationEnd) => {
  //     this.isFormVisible =
  //       event.url.includes('/add') ||
  //       event.url.includes('/edit') ||
  //       event.url.includes('/changePassword');
  //   });
  // //toggleAccess
  // this.route.paramMap.subscribe((params) => {
  //   this.idCompte = params.get('id');
  //   if (this.idCompte) this.fetchCompte(this.idCompte);
  // });
  // }

  // method 2
  // showForm() {
  //   this.isFormVisible = true;
  // }

  // method 2
  // hideForm() {
  //   this.isFormVisible = false;
  // }
}
