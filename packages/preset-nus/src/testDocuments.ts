import createMission2 from './createMission2'

const { globals, context } = createMission2()

context['alert'] = alert
globals.push('alert')

const saveHandler = function (action, document) {
  if (action === 'save') {
    console.log('Saved!')
    console.log(JSON.stringify(document))
    return Promise.resolve()
  } else {
    return Promise.resolve()
  }
}

const submitHandler = function (action, document) {
  if (action === 'submit') {
    return Promise.resolve()
  } else {
    return Promise.resolve()
  }
}

export default [
{
  type: 'source-code',
  meta: {
    id: '2D Rune',
    title: '2D Rune',
    submitted: false
  },
  data: {
    template: '',
    value: '',
  },
  handlers: [ saveHandler, submitHandler ],
  volatile: {
    context,
    globals
  }
},
{
  type: 'source-code',
  meta: {
    id: 'Source Week 3',
    title: 'Source Week 3',
    submitted: false
  },
  data: {
    template: '',
    value: ''
  },
  handlers: [ saveHandler, submitHandler ]
}
]
