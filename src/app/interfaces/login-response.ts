import { User } from "./user";

export interface LoginResponse {
  isSuccessful: boolean;
  message: string;
  //entity: User;
  //entity: Entity;
  token: string;
}

