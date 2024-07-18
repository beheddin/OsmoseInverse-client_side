import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { TypeSuiviInterface } from '../Interfaces/type-suivi.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TypeSuiviService {
  private baseUrl: string = environment.TYPE_SUIVI_API_URL;

  private typesSuivisUpdated = new Subject<void>();
  typesSuivisUpdated$ = this.typesSuivisUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getTypesSuivis(): Observable<TypeSuiviInterface[]> {
    return this.http.get<TypeSuiviInterface[]>(`${this.baseUrl}/get/all`);
  }

  getTypeSuiviById(id: string): Observable<TypeSuiviInterface> {
    return this.http.get<TypeSuiviInterface>(`${this.baseUrl}/get/${id}`);
  }

  postTypeSuivi(
    typeSuivi: TypeSuiviInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, typeSuivi)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putTypeSuivi(
    id: string,
    typeSuivi: TypeSuiviInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, typeSuivi)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteTypeSuivi(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyTypesSuivisUpdated() {
    this.typesSuivisUpdated.next();
  }
}
