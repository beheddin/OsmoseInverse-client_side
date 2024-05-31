import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { MaterialModule } from '../../material.module';
import { Register } from '../../models/register';
import { RoleService } from '../../services/role.service';
import { Role } from '../../interfaces/role';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    JsonPipe,
    HttpClientModule,
    RouterModule,
    NgFor,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  register: Register = new Register('', '', '', '', '', '', ''); //template-driven form
  // roles: string[] = ['User', 'Admin', 'SuperAdmin'];
  passwordsMatch: boolean = false;
  // roles:Observable<Role[]> | undefined;
  roles$!: Observable<Role[]>; //Observable var.
  // role$!: Observable<Role>; //Observable var.
  // roleId!: string;

  private roleService = inject(RoleService); //inject the service
  // private route = inject(ActivatedRoute);

  // constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnInit(): void {
    //getRoles
    this.roles$ = this.roleService.getRoles();
    // console.log(this.roles$);

    // //getRoleById
    // this.route.paramMap.subscribe((params) => {
    //   this.roleId = params.get('id')!;
    //   this.role$ = this.roleService.getRole(this.roleId);
    // });
  }

  onSubmit(registerForm: any) {
    if (registerForm.valid) console.log(this.register);

    //console.log(registerForm.value);
    //this.router.navigate(['login']);
  }

  /*Use the ngModelChange event on the confirmPassword field in the template
   to call this method which will check if the passwords match each time a character is entered in the confirmPassword field*/
  validatePasswords(): void {
    this.passwordsMatch =
      this.register.password === this.register.confirmPassword;
  }
}
