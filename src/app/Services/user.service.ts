import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserInterface } from '../Interfaces/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl: string = environment.USER_API_URL;

  constructor() {}

  getUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.apiUrl}/get/all`);
  }

  getUser(id: string): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${this.apiUrl}/get/${id}`);
  }
}
