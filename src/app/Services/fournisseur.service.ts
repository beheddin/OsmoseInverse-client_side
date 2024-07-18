import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { FournisseurInterface } from '../Interfaces/fournisseur.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class FournisseurService {
  private baseUrl: string = environment.FOURNISSEUR_API_URL;

  private fournisseursUpdated = new Subject<void>();
  fournisseursUpdated$ = this.fournisseursUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getFournisseurs(): Observable<FournisseurInterface[]> {
    return this.http.get<FournisseurInterface[]>(`${this.baseUrl}/get/all`);
  }

  getFournisseurById(id: string): Observable<FournisseurInterface> {
    return this.http.get<FournisseurInterface>(`${this.baseUrl}/get/${id}`);
  }

  postFournisseur(
    fournisseur: FournisseurInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, fournisseur)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putFournisseur(
    id: string,
    fournisseur: FournisseurInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, fournisseur)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteFournisseur(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyFournisseursUpdated() {
    this.fournisseursUpdated.next();
  }
}
