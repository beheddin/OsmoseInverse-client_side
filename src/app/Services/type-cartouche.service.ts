import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { TypeCartoucheInterface } from '../Interfaces/type-cartouche.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TypeCartoucheService {
  private baseUrl: string = environment.TYPE_CARTOUCHE_API_URL;

  private typesCartouchesUpdated = new Subject<void>();
  typesCartouchesUpdated$ = this.typesCartouchesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getTypesCartouches(): Observable<TypeCartoucheInterface[]> {
    return this.http.get<TypeCartoucheInterface[]>(`${this.baseUrl}/get/all`);
  }

  getTypeCartoucheById(id: string): Observable<TypeCartoucheInterface> {
    return this.http.get<TypeCartoucheInterface>(`${this.baseUrl}/get/${id}`);
  }

  postTypeCartouche(
    typeCartouche: TypeCartoucheInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, typeCartouche)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putTypeCartouche(
    id: string,
    typeCartouche: TypeCartoucheInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, typeCartouche)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteTypeCartouche(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyTypesCartouchesUpdated() {
    this.typesCartouchesUpdated.next();
  }
}
