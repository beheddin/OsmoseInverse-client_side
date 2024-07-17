import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { CategorieProduitChimiqueInterface } from '../Interfaces/categorie-produit-chimique.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CategorieProduitChimiqueService {
  private baseUrl: string = environment.CATEGORIE_PRODUIT_CHIMIQUE_API_URL;

  private categoriesProduitsChimiquesUpdated = new Subject<void>();
  categoriesProduitsChimiquesUpdated$ =
    this.categoriesProduitsChimiquesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getCategoriesProduitsChimiques(): Observable<
    CategorieProduitChimiqueInterface[]
  > {
    return this.http.get<CategorieProduitChimiqueInterface[]>(
      `${this.baseUrl}/get/all`
    );
  }

  getCategorieProduitChimiqueById(
    id: string
  ): Observable<CategorieProduitChimiqueInterface> {
    return this.http.get<CategorieProduitChimiqueInterface>(
      `${this.baseUrl}/get/${id}`
    );
  }

  postCategorieProduitChimique(
    categorieProduitChimique: CategorieProduitChimiqueInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(
        `${this.baseUrl}/post`,
        categorieProduitChimique
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putCategorieProduitChimique(
    id: string,
    categorieProduitChimique: CategorieProduitChimiqueInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        categorieProduitChimique
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteCategorieProduitChimique(
    id: string
  ): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyCategoriesProduitsChimiquesUpdated() {
    this.categoriesProduitsChimiquesUpdated.next();
  }
}
