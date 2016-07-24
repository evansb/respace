export enum DocumentColor {
  Red, Orange, Yellow, Green, Blue, Violet, Purple
}

export interface IDocumentMeta {
  id: string,
  title?: string,
  color?: DocumentColor
}

export interface IDocument<T> {
  type: string
  meta: IDocumentMeta
  data: T
}

export type AnyDocument = IDocument<any>
