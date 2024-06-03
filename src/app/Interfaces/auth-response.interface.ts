import { UserInterface } from './user.interface';

export interface AuthResponseInterface {
  isSuccessful: boolean;
  message: string;
  //entity: UserInterface;
  token: string;
}
