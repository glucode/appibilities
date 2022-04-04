import { resolve } from 'path'
import { testAssistant } from '@sketch-hq/sketch-assistant-utils'

import Assistant from '..'

describe('Appibilities Assistant', () => {
  describe('Smoke Tests', () => {
    test('Test everything is installed and the Assistant runs properly', async () => {
      const { violations, ruleErrors } = await testAssistant(
        resolve(__dirname, './empty.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(0)
      expect(ruleErrors).toHaveLength(0)
    })
  })
  describe('Artboard Rules', () => {
    test('Artboards are sized according to Apple guidelines', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './artboard-sizes-correct.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(0)
    })
    test('Assistant warns when Artboards are not sized according to Apple guidelines', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './artboard-sizes-incorrect.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(2)
    })
  })
  describe('Typography Rules', () => {
    test('Font weights allowed', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './font-weights-allowed.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(2)
    })
    test('San Francisco rules', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './san-francisco-font.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(2)
    })
    test('New York rules', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './new-york-font.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(0)
    })
  })
  describe('Ellipsis Rules', () => {
    test('Assistant warns if ellipsis are used in text layers', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './text-includes-ellipsis.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(3)
    })
  })
  describe('Hotspots Rules', () => {
    test('Hotspots are sized according to Apple guidelines', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './hotspot-sizes-correct.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(0)
    })
    test('Assistant warns when Hotspots are not sized according to Apple guidelines', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './hotspot-sizes-incorrect.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(5)
    })
    test('Button Symbols are sized according to Apple guidelines', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './button-sizes-correct.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(0)
    })
    test('Assistant warns when Button Symbols are not sized according to Apple guidelines', async () => {
      const { violations } = await testAssistant(
        resolve(__dirname, './button-sizes-incorrect.sketch'),
        Assistant,
      )
      expect(violations).toHaveLength(2)
    })
  })
})
