import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { TypeMembraneInterface } from '../Interfaces/type-membrane.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TypeMembraneService {
  private baseUrl: string = environment.TYPE_MEMBRANE_API_URL;

  private typesMembranesUpdated = new Subject<void>();
  typesMembranesUpdated$ = this.typesMembranesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getTypesMembranes(): Observable<TypeMembraneInterface[]> {
    return this.http.get<TypeMembraneInterface[]>(`${this.baseUrl}/get/all`);
  }

  getTypeMembraneById(id: string): Observable<TypeMembraneInterface> {
    return this.http.get<TypeMembraneInterface>(`${this.baseUrl}/get/${id}`);
  }

  postTypeMembrane(
    typeMembrane: TypeMembraneInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, typeMembrane)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putTypeMembrane(
    id: string,
    typeMembrane: TypeMembraneInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, typeMembrane)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteTypeMembrane(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyTypesMembranesUpdated() {
    this.typesMembranesUpdated.next();
  }
}
