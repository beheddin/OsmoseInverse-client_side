import { FilialeInterface } from '../Interfaces/filiale.interface';

export class FilialeFormModel implements FilialeInterface {
  constructor(
    public nomFiliale: string,
    public abbreviationNomFiliale: string,
    public idFiliale?: string,
  ) {}
}
