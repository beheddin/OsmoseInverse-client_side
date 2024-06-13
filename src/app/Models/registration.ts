import { CompteInterface } from '../Interfaces/compte.interface';
// import { Login } from './Login';

export class Registration implements CompteInterface {
  constructor(
    public nom: string,
    public cin: string,
    public password: string,
    public confirmPassword: string,
    public nomRole: string,
    public nomFiliale: string
  ) {}
}
