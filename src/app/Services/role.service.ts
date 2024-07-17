import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';

import { RoleInterface } from '../Interfaces/role.interface';
import { environment } from '../../environments/environment';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl: string = environment.ROLE_API_URL;

  private rolesUpdated = new Subject<void>();
  rolesUpdated$ = this.rolesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getRoles(): Observable<RoleInterface[]> {
    return this.http.get<RoleInterface[]>(`${this.baseUrl}/get/all`);
  }

  getRole(id: string): Observable<RoleInterface> {
    return this.http.get<RoleInterface>(`${this.baseUrl}/get/${id}`);
  }

  postRole(Role: RoleInterface): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, Role)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putRole(
    id: string,
    Role: RoleInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, Role)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteRole(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyRolesUpdated() {
    this.rolesUpdated.next();
  }
}
