import { LoginInterface } from "../Interfaces/login.interface";

//the model class binds data to the form
export class Login implements LoginInterface {
  constructor(public cin: string, public password: string) {}
}
