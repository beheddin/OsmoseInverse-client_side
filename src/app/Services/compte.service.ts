import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CompteInterface } from '../Interfaces/compte.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompteService {
  private http = inject(HttpClient);
  private apiUrl: string = environment.COMPTE_API_URL;

  constructor() {}

  getComptes(): Observable<CompteInterface[]> {
    return this.http.get<CompteInterface[]>(`${this.apiUrl}/get/all`);
  }

  getCompte(id: string): Observable<CompteInterface> {
    return this.http.get<CompteInterface>(`${this.apiUrl}/get/${id}`);
  }
}
