// Most of these types are extracted from schema/document
// When the schema is updated this need to be updated as well.
export enum DocumentColor {
  Red, Orange, Yellow, Green, Blue, Violet, Purple
}

/**
 * Document Metadata
 */
export interface IDocumentMeta {
  id?: string,
  title?: string,
  color?: DocumentColor
}

/**
 * A document with internal data type T
 */
export interface IDocument<T> {
  type: string
  meta: IDocumentMeta
  data: T
}

export type AnyDocument = IDocument<any>



