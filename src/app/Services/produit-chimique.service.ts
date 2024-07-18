import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { ProduitChimiqueInterface } from '../Interfaces/produit-chimique.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProduitChimiqueService {
  private baseUrl: string = environment.PRODUIT_CHIMIQUE_API_URL;

  private produitsChimiquesUpdated = new Subject<void>();
  produitsChimiquesUpdated$ = this.produitsChimiquesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getProduitsChimiques(): Observable<ProduitChimiqueInterface[]> {
    return this.http.get<ProduitChimiqueInterface[]>(`${this.baseUrl}/get/all`);
  }

  getProduitChimiqueById(id: string): Observable<ProduitChimiqueInterface> {
    return this.http.get<ProduitChimiqueInterface>(`${this.baseUrl}/get/${id}`);
  }

  postProduitChimique(
    produitChimique: ProduitChimiqueInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, produitChimique)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putProduitChimique(
    id: string,
    produitChimique: ProduitChimiqueInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        produitChimique
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteProduitChimique(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyProduitsChimiquesUpdated() {
    this.produitsChimiquesUpdated.next();
  }
}
