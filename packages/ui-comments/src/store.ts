import * as uuid from 'uuid'
import * as rs from '@respace/common'
import { asMap, observable, ObservableMap, action, computed } from 'mobx'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/debounceTime'

export type IAnnotation = rs.documents.IAnnotation
export type Document = rs.IComponentProps<rs.documents.ISourceCode, void>

class CommentStore {

  annotations: ObservableMap<IAnnotation>

  // User Data
  posterName = 'You'
  profileUrl = ''
  posterRole = 'student'
  profilePicture: ''

  @observable newAnnotationValue = ''

  @observable isEditMode = true

  private change$: Subject<string> = new Subject<string>()

  constructor(private document: rs.IDocument<rs.documents.ISourceCode>) {
    this.annotations = <any> observable(asMap({}))
    if (document.volatile.user) {
      const user = document.volatile.user
      this.posterName = user.name || 'You'
      this.posterRole = user.role || 'normal'
      this.profilePicture = user.profile_photo.small.url || ''
    }
    if (!document.volatile.annotations) {
      document.volatile.annotations = <any> this.annotations
      document.dispatch('save')
    } else {
      const annotations = document.volatile.annotations
      for (const key of Object.keys(annotations)) {
        if (annotations.hasOwnProperty(key)) {
          this.annotations.set(key, observable(annotations[key]))
        }
      }
    }
    this.change$.debounceTime(10).subscribe((value) => {
      this.newAnnotationValue = value
    })
  }

  newCommentChange(value: string) {
    this.change$.next(value)
  }

  @computed get allAnnotations(): IAnnotation[] {
    const annotations = this.annotations.values()
      .sort((a, b) => (b.createdAt as any) - (a.createdAt as any))
    return annotations
  }

  @action('comments:add')
  async addAnnotation() {
    const key = uuid.v4()
    const annotation = {
      posterName: this.posterName,
      profileUrl: this.profileUrl,
      posterRole: this.posterRole,
      value: this.newAnnotationValue,
      createdAt: new Date()
    }
    this.annotations.set(key, annotation)
    this.document.volatile.annotations[key] = annotation
    await this.document.dispatch('save')
    await this.document.dispatch('annotationAdded', annotation)
    this.newAnnotationValue = ''
    this.isEditMode = true
  }
}

export default CommentStore
