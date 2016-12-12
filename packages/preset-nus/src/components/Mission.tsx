import * as React from 'react'
import * as rs from '@respace/common'
import MissionIcon from 'react-icons/fa/map'
import marked from 'marked'
import $ from 'jquery'

declare var MathJax: any
declare var window: any

const MATHJAX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML' // tslint:disable-line

type Props = rs.IComponentProps<MissionDescription, void>

interface IMissionDescription {
  description: string
}

export class MissionDescription extends rs.Document<IMissionDescription, any> {
  get description() {
    return this.data.description
  }
}

(String.prototype as any).replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

class MissionView extends React.Component<Props, { html: string}> {
  constructor(props, context) {
    super(props, context)
    this.state = {
      html: 'Parsing markdown, please wait...'
    }
  }

  async componentDidMount() {
    const document = this.props.component.document
    const renderer = new marked.Renderer()
    renderer.image = function(href) {
      return `<img class="img-responsive" src="http://source-academy-assets.s3.amazonaws.com/markdown/${href}"/>` // tslint:disable-line
    }
    renderer.table = function(header, body) {
      return `<table class="table">${header}${body}</table>`
    }
    renderer.codespan = function(code) {
      const result = `<code>${(code as any)
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', '\'')}</code>`
      return result
    }
    renderer.code = function(code) {
      const result = `<pre><code>${(code as any)
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', '\'')}</code></pre>`
      return result
    }
    const description: string = $(document.description).text()
    const callback = () => {
      if (!window.MathJax) { return }
      const buffer =
        $('<div id="mathjax-buffer" style="display:none">').appendTo('body')
      buffer.text(description)
      MathJax.Hub.Config({
          tex2jax: { inlineMath: [['\\[', '\\]'], ['\\(', '\\)']] },
          asciimath2jax: { delimiters: [] }
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

    const html = marked(description, {
       gfm: true,
       tables: true,
       sanitize: false,
       renderer
    })
    this.setState({ html })
    if (!window.MathJax) {
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

class Mission extends rs.ComponentFactory<MissionDescription, void> {
  name = 'ui-markdown-view'
  displayName = 'Briefing'
  icon = MissionIcon
  view = MissionView
  acceptDocument(document: rs.AnyDocument) {
    return document.type === 'mission'
  }
  createStore(document) {
    return
  }
}

export default Mission
