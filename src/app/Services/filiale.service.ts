import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { FilialeInterface } from '../Interfaces/filiale.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class FilialeService {
  private baseUrl: string = environment.FILIALE_API_URL;

  private filialesUpdated = new Subject<void>();
  filialesUpdated$ = this.filialesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getFiliales(): Observable<FilialeInterface[]> {
    return this.http.get<FilialeInterface[]>(`${this.baseUrl}/get/all`);
  }

  getFilialeById(id: string): Observable<FilialeInterface> {
    return this.http.get<FilialeInterface>(`${this.baseUrl}/get/${id}`);
  }

  postFiliale(filiale: FilialeInterface): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, filiale)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putFiliale(
    id: string,
    filiale: FilialeInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, filiale)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteFiliale(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyFilialesUpdated() {
    this.filialesUpdated.next();
  }
}
