export enum DocumentColor {
  Red, Orange, Yellow, Green, Blue, Violet, Purple
}

export interface IDocumentMeta {
  id: string,
  title?: string,
  color?: DocumentColor
}

export interface IDocumentJSON<T> {
  type: string
  meta: IDocumentMeta
  data: T
}

export interface IDocument<T> extends IDocumentJSON<T> {
  type: string
  id: string
  title: string
}

export type AnyDocument = IDocument<any>
export type AnyDocumentJSON = IDocumentJSON<any>
