import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { ParametreSuiviInterface } from '../Interfaces/parametre-suivi.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ParametreSuiviService {
  private baseUrl: string = environment.PARAMETRE_SUIVI_API_URL;

  private parametresSuivisUpdated = new Subject<void>();
  parametresSuivisUpdated$ = this.parametresSuivisUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getParametresSuivis(): Observable<ParametreSuiviInterface[]> {
    return this.http.get<ParametreSuiviInterface[]>(`${this.baseUrl}/get/all`);
  }

  getParametreSuiviById(id: string): Observable<ParametreSuiviInterface> {
    return this.http.get<ParametreSuiviInterface>(`${this.baseUrl}/get/${id}`);
  }

  postParametreSuivi(
    parametreSuivi: ParametreSuiviInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, parametreSuivi)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putParametreSuivi(
    id: string,
    parametreSuivi: ParametreSuiviInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        parametreSuivi
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteParametreSuivi(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyParametresSuivisUpdated() {
    this.parametresSuivisUpdated.next();
  }
}
