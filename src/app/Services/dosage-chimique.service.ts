import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { DosageChimiqueInterface } from '../Interfaces/dosage-chimique.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class DosageChimiqueService {
  private baseUrl: string = environment.DOSAGE_CHIMIQUE_API_URL;

  private dosagesChimiquesUpdated = new Subject<void>();
  dosagesChimiquesUpdated$ = this.dosagesChimiquesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getDosagesChimiques(): Observable<DosageChimiqueInterface[]> {
    return this.http.get<DosageChimiqueInterface[]>(`${this.baseUrl}/get/all`);
  }

  getDosageChimiqueById(id: string): Observable<DosageChimiqueInterface> {
    return this.http.get<DosageChimiqueInterface>(`${this.baseUrl}/get/${id}`);
  }

  postDosageChimique(
    dosageChimique: DosageChimiqueInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, dosageChimique)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putDosageChimique(
    id: string,
    dosageChimique: DosageChimiqueInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        dosageChimique
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteDosageChimique(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyDosagesChimiquesUpdated() {
    this.dosagesChimiquesUpdated.next();
  }
}
