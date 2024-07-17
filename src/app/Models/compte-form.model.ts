import { CompteInterface } from '../Interfaces/compte.interface';

export class CompteFormModel implements CompteInterface {
  constructor(
    public nom: string,
    public cin: string,
    public password: string,
    public confirmPassword: string,
    public nomRole: string,
    public nomFiliale: string,
    // public access?: boolean,
    public access: boolean,
    public idCompte?: string
  ) {}
}
