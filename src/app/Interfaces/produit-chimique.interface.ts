import { ProduitConsommableInterface } from './produit-consommable.interface';

export interface ProduitChimiqueInterface extends ProduitConsommableInterface {
  nomCategorieProduitChimique: string;
}
