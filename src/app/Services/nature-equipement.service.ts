import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { NatureEquipementInterface } from '../Interfaces/nature-equipement.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class NatureEquipementService {
  private baseUrl: string = environment.NATURE_EQUIPEMENT_API_URL;

  private naturesEquipementsUpdated = new Subject<void>();
  naturesEquipementsUpdated$ = this.naturesEquipementsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getNaturesEquipements(): Observable<NatureEquipementInterface[]> {
    return this.http.get<NatureEquipementInterface[]>(
      `${this.baseUrl}/get/all`
    );
  }

  getNatureEquipementById(id: string): Observable<NatureEquipementInterface> {
    return this.http.get<NatureEquipementInterface>(
      `${this.baseUrl}/get/${id}`
    );
  }

  postNatureEquipement(
    naturesEquipement: NatureEquipementInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, naturesEquipement)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putNatureEquipement(
    id: string,
    naturesEquipement: NatureEquipementInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        naturesEquipement
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteNatureEquipement(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyNaturesEquipementsUpdated() {
    this.naturesEquipementsUpdated.next();
  }
}
