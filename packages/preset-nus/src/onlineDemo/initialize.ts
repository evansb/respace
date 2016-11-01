import initializeRespace from '../initialize'
import loadLibraries from '../loadLibraries'

declare var window: any

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
    createSourceWeek(5),
    createSourceWeek(6),
    createSourceWeek(8),
    createSourceWeek(9),
    createSourceWeek(10),
    createSourceWeek(12),
    await createSpecial('rune_curve', 'Mission 4', 'Curve', 3),
    await createSpecial('practical-exam', 'PE 2015', 'PE 2015', 12),
    await createSpecial('practical-exam', 'PE 2014', 'PE 2014', 12)
    // Await createSpecial('sound_tone_matrix', 'Mission 15', 'Tone Matrix', 6),
  ]
  initializeRespace(sourceCodes)
  window.define_solution()
 }
