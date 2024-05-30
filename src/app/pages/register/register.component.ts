import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

import { MaterialModule } from '../../material.module';
import { Register } from '../../models/register';

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
  register: Register = new Register('', '', '', '', '', '', '');  //template-driven form

  constructor(private httpClient: HttpClient, private router: Router) {}

  submit(registerForm: any) {
    if (registerForm.invalid) return;

    if (
      !this.verifyPassword(
        registerForm.value.password,
        registerForm.value.confirmPassword
      )
    )
      console.log("pwds don't match");

    console.log(registerForm.value);
    //this.router.navigate(['login']);
  }

  verifyPassword(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
}
