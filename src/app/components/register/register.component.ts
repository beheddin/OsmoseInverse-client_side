import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

import { Register } from '../../models/register/register';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    JsonPipe,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  register: Register = new Register('', '', '', '', '');

  constructor(private httpClient: HttpClient, private router: Router) {}

  submit(form: any) {
    console.log(form.value);
    this.router.navigate(['login']);
  }
}
