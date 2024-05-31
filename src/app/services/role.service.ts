import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Role } from '../interfaces/role';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl: string = environment.ROLE_API_URL;

  constructor() {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/get/all`);
  }

  getRole(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/get/${id}`);
  }
}
