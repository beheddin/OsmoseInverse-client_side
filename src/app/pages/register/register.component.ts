import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
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
    NgFor, NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  register: Register = new Register('', '', '', '', '', '', ''); //template-driven form
  roles: string[] = ['User', 'Admin', 'SuperAdmin'];
  passwordsMatch: boolean = false;

  constructor(private httpClient: HttpClient, private router: Router) {}

  onSubmit(registerForm: any) {
    if (registerForm.valid) 
      console.log(this.register);
    
    //console.log(registerForm.value);
    //this.router.navigate(['login']);
  }

  /*Use the ngModelChange event on the confirmPassword field in the template
   to call this method which will check if the passwords match each time a character is entered in the confirmPassword field*/
  validatePasswords(): void {
    this.passwordsMatch = this.register.password === this.register.confirmPassword;
  }
}
