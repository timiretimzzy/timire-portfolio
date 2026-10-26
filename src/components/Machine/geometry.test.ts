import { describe, expect, it } from 'vitest'
import { sectorMid, shortestTurn } from './geometry'

describe('index ring geometry', () => {
  it('turns the short way round', () => {
    expect(shortestTurn(0, -300)).toBe(60)
    expect(shortestTurn(-300, 0)).toBe(-360)
    expect(shortestTurn(-60, -120)).toBe(-120)
    expect(shortestTurn(720, -60)).toBe(660)
  })

  it('puts sector 0 at twelve o’clock', () => {
    expect(sectorMid(0)).toBe(-90)
    expect(sectorMid(3)).toBe(90)
  })
})
