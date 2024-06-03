import { UserInterface } from '../Interfaces/user.interface';
// import { Login } from './Login';

export class Registration implements UserInterface {
  constructor(
    // public userId: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public cin: string,
    // public override cin: string,
    // public override password: string,
    public password: string,
    public confirmPassword: string,
    public roleLabel: string,
    public filialeLabel: string
  ) {
    //super(cin, password);
  }
}
