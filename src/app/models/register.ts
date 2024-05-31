import { Login } from './login';

export class Register extends Login {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public role: string,
    public override cin: string,
    public override password: string,
    public confirmPassword: string,
  ) {
    super(cin, password);
  }
}
