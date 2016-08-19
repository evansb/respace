import * as React from 'react'
import * as rs from '@respace/common'
import marked from 'marked'
import $ from 'jquery'

declare var MathJax: any
declare var window: any
declare var scale_independent: any

const icon: React.ComponentClass<void> =
  require('react-icons/fa/map').default

const MATHJAX_URL = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML' // tslint:disable-line

type Props = rs.IComponentProps<rs.documents.ISourceCode, void>

class MissionView extends React.Component<Props, { html: string}> {
  constructor(props, context) {
    super(props, context)
    this.state = {
      html: 'Parsing markdown, please wait...'
    }
  }

  componentDidMount() {
    const document = this.props.component.document
    const renderer = new marked.Renderer()
    renderer.image = function(href) {
      return `<img class="img-responsive" src="https://source-academy-assets.s3.amazonaws.com/markdown/${href}"/>` // tslint:disable-line
    }
    renderer.table = function(header, body) {
      return `<table class="table">${header}${body}</table>`
    }
    const callback = () => {
      if (!window.MathJax) { return }
      const buffer =
        $('<div id="mathjax-buffer" style="display:none">').appendTo('body')
      buffer.text($(document.volatile.description).text())
      MathJax.Hub.Config({
          tex2jax: { inlineMath: [['\\[', '\\]'], ['\\(', '\\)']] },
          asciimath2jax: {
            delimiters: [['$', '$']],
          }
      })
      MathJax.Hub.Queue([
        ['Typeset', MathJax.Hub, 'mathjax-buffer'],
        () => {
          const buf = window.document.getElementById('mathjax-buffer')
          const text = (buf && buf.innerHTML) || ''
          const html = marked(text, {
             gfm: true,
             tables: true,
             sanitize: false,
             renderer
          })
          this.setState({ html })
        }
     ])
    }
    const html = marked($(document.volatile.description).text(), {
       gfm: true,
       tables: true,
       sanitize: false,
       renderer
    })
    this.setState({ html })
    if (!window.MathJax && !window.mission_type) {
      $.getScript(MATHJAX_URL, callback)
    } else {
      callback()
    }
  }

  render() {
    const style = {
      padding: '10px'
    }
    return <div style={style} dangerouslySetInnerHTML={
      { __html: this.state.html}} />
  }
}

const Mission: rs.IComponentFactory<rs.documents.ISourceCode, void> = {
  name: 'ui-markdown-view',
  displayName: 'Briefing',
  icon,
  view: MissionView,
  acceptDocument(document: rs.AnyDocument) {
    return document.type === 'source-code' &&
      (typeof document.volatile.description === 'string')
  },
  createStore(document: rs.IDocument<rs.documents.ISourceCode>) {
    return
  }
}

export default Mission
