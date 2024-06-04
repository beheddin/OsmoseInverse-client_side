import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserService } from '../../Services/user.service';
import { UserInterface } from '../../Interfaces/user.interface';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [MaterialModule, NgIf, RouterModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
})
export class ManageUsersComponent {
  displayedColumns: string[] = ['firstName', 'lastName'];
  dataSource: MatTableDataSource<UserInterface> =
    new MatTableDataSource<UserInterface>();
  selectedUser: any = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    console.log(this.dataSource);
  }

  loadUsers() {
    this.userService.getUsers().subscribe((users: UserInterface[]) => {
      this.dataSource.data = users;
    });
  }

  //checkbox selection handling
  toggleSelection(user: any): void {
    this.selectedUser = this.selectedUser === user ? null : user;
  }

  isCardSelected(user: any): boolean {
    return this.selectedUser === user;
  }

  isSelected(user: any): boolean {
    return this.selectedUser === user;
  }
}
