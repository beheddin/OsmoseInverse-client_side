import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { BassinInterface } from '../Interfaces/bassin.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class BassinService {
  private baseUrl: string = environment.BASSIN_API_URL;

  private bassinsUpdated = new Subject<void>();
  bassinsUpdated$ = this.bassinsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getBassins(): Observable<BassinInterface[]> {
    return this.http.get<BassinInterface[]>(`${this.baseUrl}/get/all`);
  }

  getBassinById(id: string): Observable<BassinInterface> {
    return this.http.get<BassinInterface>(`${this.baseUrl}/get/${id}`);
  }

  postBassin(bassin: BassinInterface): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, bassin)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putBassin(
    id: string,
    bassin: BassinInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, bassin)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteBassin(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyBassinsUpdated() {
    this.bassinsUpdated.next();
  }
}
