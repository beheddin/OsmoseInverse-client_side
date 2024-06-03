import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FilialeInterface } from '../Interfaces/filiale.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilialeService {

  private http = inject(HttpClient);
  private apiUrl: string = environment.FILIALE_API_URL;

  constructor() {}

  getFiliales(): Observable<FilialeInterface[]> {
    return this.http.get<FilialeInterface[]>(`${this.apiUrl}/get/all`);
  }

  getFiliale(id: string): Observable<FilialeInterface> {
    return this.http.get<FilialeInterface>(`${this.apiUrl}/get/${id}`);
  }
}
