import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

import { Login } from '../../models/login/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MaterialModule,

    FormsModule, // If using template-driven forms
    //ReactiveFormsModule, // If using reactive forms
    JsonPipe,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  login: Login = new Login('', '');

  constructor(private httpClient: HttpClient, private router: Router) {}

  submit(form: any) {
    // console.log(form.value);
    this.httpClient
      .post(
        //'https://localhost:44386/Users/login',
        'https://localhost:5001/Users/login',
        form.value,
        {
          withCredentials: true,
        }
      )
      .subscribe((res) => {
        // console.log(res);
        this.router.navigate(['']);
      });
  }
}
