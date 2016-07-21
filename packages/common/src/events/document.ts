import {AnyDocument} from '../document'

export class DocumentEvent {}

export class DocumentAdded extends DocumentEvent {
  constructor(public document: AnyDocument) { super() }
}

export class DocumentChanged extends DocumentEvent {
  constructor(public document: AnyDocument) { super() }
}

export class DocumentRemoved extends DocumentEvent {
  constructor(public document: AnyDocument) { super() }
}
