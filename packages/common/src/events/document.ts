import {AnyDocument} from '../document'

export class DocumentEvent {}

/**
 * Fired when a document is added.
 */
export class DocumentAdded extends DocumentEvent {
  constructor(public document: AnyDocument) { super() }
}

/**
 * Fired when a document is added.
 */
export class DocumentChanged extends DocumentEvent {
  constructor(public document: AnyDocument) { super() }
}

/**
 * Fired when a document is removed.
 */
export class DocumentRemoved extends DocumentEvent {
  constructor(public document: AnyDocument) { super() }
}
