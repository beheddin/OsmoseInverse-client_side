import { Register } from '../register/register';

//the model class binds data to the form
export class Login extends Register {
  constructor(public override cin: string, public override password: string) {
    super('', '', '', cin, password);
  }
}
