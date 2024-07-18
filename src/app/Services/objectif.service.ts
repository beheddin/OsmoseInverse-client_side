import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { ObjectifInterface } from '../Interfaces/objectif.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ObjectifService {
  private baseUrl: string = environment.OBJECTIF_API_URL;

  private objectifsUpdated = new Subject<void>();
  objectifsUpdated$ = this.objectifsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getObjectifs(): Observable<ObjectifInterface[]> {
    return this.http.get<ObjectifInterface[]>(`${this.baseUrl}/get/all`);
  }

  getObjectifById(id: string): Observable<ObjectifInterface> {
    return this.http.get<ObjectifInterface>(`${this.baseUrl}/get/${id}`);
  }

  postObjectif(
    objectif: ObjectifInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, objectif)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putObjectif(
    id: string,
    objectif: ObjectifInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, objectif)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteObjectif(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyObjectifsUpdated() {
    this.objectifsUpdated.next();
  }
}
