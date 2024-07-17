import { BassinInterface } from './bassin.interface';

export interface PuitInterface extends BassinInterface {
  profondeur: number;
  typeAmortissement: string;
}
