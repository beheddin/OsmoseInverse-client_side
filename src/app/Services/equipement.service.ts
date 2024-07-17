import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { EquipementInterface } from '../Interfaces/equipement.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class EquipementService {
  private baseUrl: string = environment.EQUIPEMENT_API_URL;

  private equipementsUpdated = new Subject<void>();
  equipementsUpdated$ = this.equipementsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getEquipements(): Observable<EquipementInterface[]> {
    return this.http.get<EquipementInterface[]>(`${this.baseUrl}/get/all`);
  }

  getEquipementById(id: string): Observable<EquipementInterface> {
    return this.http.get<EquipementInterface>(`${this.baseUrl}/get/${id}`);
  }

  postEquipement(
    equipement: EquipementInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, equipement)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putEquipement(
    id: string,
    equipement: EquipementInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, equipement)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteEquipement(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyEquipementsUpdated() {
    this.equipementsUpdated.next();
  }
}
