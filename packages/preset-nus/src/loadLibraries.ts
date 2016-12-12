import $ from 'jquery'

declare interface WindowWithExportSymbol extends Window {
  export_symbol: any
  missionTitle?: string
}

declare var window: WindowWithExportSymbol

const baseLib = 'https://source-academy-assets.s3.amazonaws.com/lib'

const __LIBRARY_CACHE__: { [index: string]: boolean } = {}

async function getScript(libraryName: string) {
  console.log(`Loading ${libraryName}`)
  return new Promise((resolve, reject) => {
    if (__LIBRARY_CACHE__[libraryName]) {
      console.log(`Cache hit ${libraryName}`)
      resolve()
    } else {
      $.getScript(`${baseLib}/${libraryName}`).then(() => {
        __LIBRARY_CACHE__[libraryName] = true
        console.log(`Loaded ${libraryName}`)
        resolve()
      }).fail(reject)
    }
  })
}

interface IMissionMetadata {
  interpreter: number
  libraries: string[]
}

function isValidLibrary(json: any) {
  return json.libraries instanceof Array &&
    (<any[]> json.libraries).every(s => typeof s === 'string')
}

export default async function loadLibraries(missionTitle: string) {
  missionTitle = missionTitle.toLowerCase().replace(' ', '-')
  console.log(`Mission: ${missionTitle}`)
  const missionNumber = parseInt(missionTitle.split('-')[1], 10)
  let globals: string[] = []
  let context: {[name: string]: any} = {}

  window.export_symbol = (s, m) => {
    globals.push(s)
    context[s] = m
  }

  window.missionTitle = missionTitle

  await getScript(missionTitle + '.js')

  return { globals, context }
}
