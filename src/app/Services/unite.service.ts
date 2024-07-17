import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { UniteInterface } from '../Interfaces/unite.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UniteService {
  private baseUrl: string = environment.UNITE_API_URL;

  private unitesUpdated = new Subject<void>();
  unitesUpdated$ = this.unitesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getUnites(): Observable<UniteInterface[]> {
    return this.http.get<UniteInterface[]>(`${this.baseUrl}/get/all`);
  }

  getUniteById(id: string): Observable<UniteInterface> {
    return this.http.get<UniteInterface>(`${this.baseUrl}/get/${id}`);
  }

  postUnite(Unite: UniteInterface): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, Unite)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putUnite(
    id: string,
    Unite: UniteInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, Unite)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteUnite(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  toggleIsActive(id: string): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/toggleIsActive/${id}`, {})
      .pipe(map((response: MessageResponseInterface) => response));
  }

  notifyUnitesUpdated() {
    this.unitesUpdated.next();
  }
}
