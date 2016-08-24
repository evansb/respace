import initializeRespace from '../initialize'
import loadLibraries from '../loadLibraries'

function createSourceWeek(week: number) {
  return {
    template: '',
    value: '',
    language: `source-week-${week}`,
    title: `Source Week ${week}`,
    context: <{[name: string]: any}> {},
    globals: <string[]> []
  }
}

async function createSpecial(language: string, missionTitle: string,
                             title: string, week: number) {
  const { globals, context } = await loadLibraries(missionTitle)
  return { title, template: '', value: '', language, globals, context }
}

export default async function initialize() {
  const sourceCodes = [
    createSourceWeek(3),
    createSourceWeek(4),
    await createSpecial('rune_curve', 'Mission 4', 'Curve', 3),
  ]
  initializeRespace(sourceCodes)
}
