import uuid from 'uuid'
import { toJS } from 'mobx'
import { Snapshot, ISnapshotError, printErrorToString, createSourceParser,
  printValueToString, listToString, parseAndEvaluate,
  parseAndSanitize, lint } from 'the-source'
import { service } from '@respace/ui-interpreter'

declare var window: any

function weekOfLanguage(language: string): number {
  if (/source-week/.test(language)) {
    return parseInt(language.split('-')[2], 10)
  } else if (/rune/.test(language)) {
    return 4
  } else if (/rsa/.test(language)) {
    return 5
  } else if (typeof window.interpreter === 'number') {
    return window.interpreter
  } else {
    return 3
  }
}

type IRequest = any

function createRuntimeObject() {
  const defaultTimeout = parseInt(window.timeout, 10) || 10000
  const runtime_limit = {
    id: uuid.v4(),
    stackSize: 65536,
    timeout: defaultTimeout,
    set_stack_size(stackSize) {
      if (stackSize > 0) {
        this.stackSize = stackSize
      } else {
        throw new Error('Stack size must be >0')
      }
    },
    get_stack_size()  {
      return this.stackSize
    },
    get_timeout()  {
      return this.timeout
    },
    set_timeout(timeout) {
      if (timeout > 0) {
        this.timeout = timeout
      } else {
        throw new Error('Timeout must be >0')
      }
    }
  }
  const system = { runtime_limit, get_globals: () => '' }
  return system
}

export default function createSourceService(init: {
  language: string
  context: any
  globals: string[]
}): service.ILanguageService<Snapshot, ISnapshotError> {
  let system = createRuntimeObject()

  init.context.system = system
  init.globals.push('system')

  const service =  {
    language: init.language,
    publish(action: service.SnapshotAction<Snapshot, ISnapshotError>,
            store: any) {
      const actionRequest = <service.SnapshotRequest<Snapshot>> action
      const { id, code, parent } = actionRequest.payload
      const week = weekOfLanguage(init.language)
      let request: IRequest = { id, code, week }

      if (!parent) {
        request.globals = toJS(init.globals)
        request.context = toJS(init.context)
        if (week >= 4) {
          request.globals.push('display')
          request.context.display = (value) => {
            let str: string
            if (value instanceof Array) {
              str = listToString(value)
            } else if (typeof value.toString === 'function') {
              str = value.toString()
            } else {
              str = value + ''
            }
            store.handleLog(str)
          }
          window['display'] = request.context.display
        }

        if (week >= 10) {
          const parse = createSourceParser(week)
          request.globals.push('parse')
          request.context.parse = parse
        }

        const globals = request.globals || []
        system.get_globals = () => {
          let str = ''
          for (var x = 0; x < globals.length; x++) {
            if (x !== globals.length - 1) {
              str += globals[x] + '\n'
            } else {
              str += globals[x]
            }
          }
          return str
        }
      }
      request.parent = parent
      if (parent) {
        request.runtime = parent.runtime
      }
      system = toJS(system)
      request.timeout = system.runtime_limit.get_timeout()
      request.maxCallStack = system.runtime_limit.get_stack_size()
      request.lines = code.split('\n')
      try {
        const lintErrors = lint(request.code, request)
        if (lintErrors.length > 0) {
          return lintErrors[0]
        }
        const parsedSnapshot = parseAndSanitize(request)
        if (parsedSnapshot instanceof Array) {
          return parsedSnapshot[0]
        }
        let result = parseAndEvaluate(request)
        return result
      } catch (e) {
        return e
      }
    },
    errorToString(error: ISnapshotError) {
      return printErrorToString(error)
    },
    valueToString(snapshot: Snapshot) {
      return printValueToString(snapshot.value, snapshot.context)
    }
  }

  window.parse_and_evaluate = (code, isMore, snapshot) => {
    return parseAndEvaluate(snapshot, code, isMore)
  }
  return service
}
