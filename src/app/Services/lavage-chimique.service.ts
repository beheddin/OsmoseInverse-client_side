import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { LavageChimiqueInterface } from '../Interfaces/lavage-chimique.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class LavageChimiqueService {
  private baseUrl: string = environment.LAVAGE_CHIMIQUE_API_URL;

  private lavagesChimiquesUpdated = new Subject<void>();
  lavagesChimiquesUpdated$ = this.lavagesChimiquesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getLavagesChimiques(): Observable<LavageChimiqueInterface[]> {
    return this.http.get<LavageChimiqueInterface[]>(`${this.baseUrl}/get/all`);
  }

  getLavageChimiqueById(id: string): Observable<LavageChimiqueInterface> {
    return this.http.get<LavageChimiqueInterface>(`${this.baseUrl}/get/${id}`);
  }

  postLavageChimique(
    lavageChimique: LavageChimiqueInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, lavageChimique)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putLavageChimique(
    id: string,
    lavageChimique: LavageChimiqueInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        lavageChimique
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteLavageChimique(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyLavagesChimiquesUpdated() {
    this.lavagesChimiquesUpdated.next();
  }
}
