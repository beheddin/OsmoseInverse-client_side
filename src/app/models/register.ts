import { Login } from './login';

export class Register extends Login {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public override cin: string,
    public override password: string,
    public confirmPassword: string,
    public role: string
  ) {
    super(cin, password);
  }
}
