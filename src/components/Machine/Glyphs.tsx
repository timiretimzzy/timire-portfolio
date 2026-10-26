import type { MechanismId } from '../../data/types'

/**
 * Engraved symbols for each mechanism, drawn in a 48 x 48 box centred on
 * the origin. Single-weight strokes, like marks cut into a plastic dial.
 */
export function Glyph({ id }: { id: MechanismId }) {
  switch (id) {
    case 'A': // The Ledger: a till receipt with a torn edge
      return (
        <g className="glyph">
          <path d="M -13 -20 H 13 V 14 L 9 19 L 4.5 14 L 0 19 L -4.5 14 L -9 19 L -13 14 Z" />
          <path d="M -8 -12 H 8 M -8 -5 H 8 M -8 2 H 3 M 0 8 H 8" />
        </g>
      )
    case 'B': // The Frame: a truss
      return (
        <g className="glyph">
          <path d="M -22 14 H 22 L 0 -18 Z" />
          <path d="M -11 14 L -11 -2 M 11 14 L 11 -2 M -11 -2 L 0 14 L 11 -2 M 0 14 V -18" />
        </g>
      )
    case 'C': // The Estimator: points and a fitted line
      return (
        <g className="glyph">
          <path d="M -20 18 V -20 M -20 18 H 21" />
          <path d="M -17 12 L 19 -14" strokeDasharray="3 2.5" />
          {[
            [-12, 11],
            [-8, 4],
            [-2, 5],
            [3, -2],
            [8, -1],
            [13, -9],
            [16, -6],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={1.9} className="glyph-dot" />
          ))}
        </g>
      )
    case 'D': // The Gauge: a dial with a needle in tolerance
      return (
        <g className="glyph">
          <path d="M -21 10 A 21 21 0 0 1 21 10" />
          <path d="M -15.5 3.5 L -12.6 5.4 M -8 -6.6 L -6.4 -3.8 M 0 -10 V -6.8 M 8 -6.6 L 6.4 -3.8 M 15.5 3.5 L 12.6 5.4" />
          <path d="M 0 10 L 7 -5" />
          <circle cx={0} cy={10} r={2.6} />
          <path d="M -21 16 H 21" />
        </g>
      )
    case 'E': // The Loose Gear: a gear with one tooth missing
      return (
        <g className="glyph">
          <path
            d={(() => {
              const teeth = 8
              const parts: string[] = []
              for (let t = 0; t < teeth; t++) {
                const a = (t / teeth) * Math.PI * 2 - Math.PI / 2
                const w = Math.PI / teeth / 2
                const r1 = 14
                const r2 = t === 2 ? 14 : 20 // the missing tooth
                const p = (r: number, ang: number) => `${(r * Math.cos(ang)).toFixed(2)} ${(r * Math.sin(ang)).toFixed(2)}`
                parts.push(`${t === 0 ? 'M' : 'L'} ${p(r1, a - w * 1.5)} L ${p(r2, a - w * 0.8)} L ${p(r2, a + w * 0.8)} L ${p(r1, a + w * 1.5)}`)
              }
              return parts.join(' ') + ' Z'
            })()}
          />
          <circle cx={0} cy={0} r={5.5} />
        </g>
      )
    case 'F': // The Mouthpiece: a pen nib
      return (
        <g className="glyph">
          <path d="M 0 21 L -11 -2 L -8 -16 H 8 L 11 -2 Z" />
          <path d="M 0 21 V 3" />
          <circle cx={0} cy={0} r={2.6} />
          <path d="M -8 -16 L -6 -21 H 6 L 8 -16" />
        </g>
      )
  }
}
