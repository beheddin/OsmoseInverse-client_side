import { MessageResponseInterface } from "./message-response.interface";

export interface LoginResponseInterface extends MessageResponseInterface {
  //isSuccessful: boolean;
  //message: string;
  token: string;
}
