import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { MembraneInterface } from '../Interfaces/membrane.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MembraneService {
  private baseUrl: string = environment.MEMBRANE_API_URL;

  private membranesUpdated = new Subject<void>();
  membranesUpdated$ = this.membranesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getMembranes(): Observable<MembraneInterface[]> {
    return this.http.get<MembraneInterface[]>(`${this.baseUrl}/get/all`);
  }

  getMembraneById(id: string): Observable<MembraneInterface> {
    return this.http.get<MembraneInterface>(`${this.baseUrl}/get/${id}`);
  }

  postMembrane(
    membrane: MembraneInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, membrane)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putMembrane(
    id: string,
    membrane: MembraneInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, membrane)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteMembrane(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyMembranesUpdated() {
    this.membranesUpdated.next();
  }
}
