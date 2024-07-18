import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { TypeEquipementInterface } from '../Interfaces/type-equipement.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TypeEquipementService {
  private baseUrl: string = environment.TYPE_EQUIPEMENT_API_URL;

  private typesEquipementsUpdated = new Subject<void>();
  typesEquipementsUpdated$ = this.typesEquipementsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getTypesEquipements(): Observable<TypeEquipementInterface[]> {
    return this.http.get<TypeEquipementInterface[]>(`${this.baseUrl}/get/all`);
  }

  getTypeEquipementById(id: string): Observable<TypeEquipementInterface> {
    return this.http.get<TypeEquipementInterface>(`${this.baseUrl}/get/${id}`);
  }

  postTypeEquipement(
    typeEquipement: TypeEquipementInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, typeEquipement)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putTypeEquipement(
    id: string,
    typeEquipement: TypeEquipementInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        typeEquipement
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteTypeEquipement(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyTypesEquipementsUpdated() {
    this.typesEquipementsUpdated.next();
  }
}
