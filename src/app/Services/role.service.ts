import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RoleInterface } from '../Interfaces/role.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl: string = environment.ROLE_API_URL;

  constructor() {}

  getRoles(): Observable<RoleInterface[]> {
    return this.http.get<RoleInterface[]>(`${this.apiUrl}/get/all`);
  }

  getRole(id: string): Observable<RoleInterface> {
    return this.http.get<RoleInterface>(`${this.apiUrl}/get/${id}`);
  }
}
