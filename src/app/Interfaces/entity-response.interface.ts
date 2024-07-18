import { MessageResponseInterface } from "./message-response.interface";

export interface EntityResponseInterface<T> extends MessageResponseInterface {
    entity: T;
  }
