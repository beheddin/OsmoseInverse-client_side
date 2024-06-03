import { EventEmitter } from '@angular/core';

// the Emitter is used to emit(transmit) data between components
export class Emitter {
  static userIsAuthenticatedEmitter = new EventEmitter<boolean>();  //static: acces this property without creating an instance
  static sidenavIsOpenEmitter = new EventEmitter<boolean>();
}