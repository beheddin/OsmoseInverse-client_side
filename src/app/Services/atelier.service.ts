import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AtelierInterface } from '../Interfaces/atelier.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AtelierService {
  private baseUrl: string = environment.ATELIER_API_URL;

  private ateliersUpdated = new Subject<void>();
  ateliersUpdated$ = this.ateliersUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getAteliers(): Observable<AtelierInterface[]> {
    return this.http.get<AtelierInterface[]>(`${this.baseUrl}/get/all`);
  }

  getAtelierById(id: string): Observable<AtelierInterface> {
    return this.http.get<AtelierInterface>(`${this.baseUrl}/get/${id}`);
  }

  postAtelier(atelier: AtelierInterface): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, atelier)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putAtelier(
    id: string,
    atelier: AtelierInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, atelier)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteAtelier(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyAteliersUpdated() {
    this.ateliersUpdated.next();
  }
}
