import { useMemo } from 'react'
import type { Mechanism, MechanismId } from '../../data/types'
import { Glyph } from './Glyphs'
import { C, SECTOR_DEG, arcPath, polar, pt, sectorMid, wedge } from './geometry'

interface Props {
  mechanisms: Mechanism[]
  selected: number
  /** Current rotation of the ring, degrees. */
  angle: number
  onSelect: (index: number) => void
}

/**
 * The index ring: a fixed graduated bezel, a rotating cream disc with six
 * sectors, a pointer at twelve o'clock and a drive shaft out to the readout
 * unit. Purely visual; the accessible controls are the keys on the housing.
 */
export function IndexRing({ mechanisms, selected, angle, onSelect }: Props) {
  const bezelTicks = useMemo(() => {
    const out: { d: string; major: boolean }[] = []
    for (let a = 0; a < 360; a += 5) {
      const major = a % 30 === 0
      const deg = a - 90
      out.push({ d: `M ${pt(251, deg)} L ${pt(major ? 264 : 257, deg)}`, major })
    }
    return out
  }, [])

  const discTicks = useMemo(() => {
    const out: string[] = []
    for (let a = 0; a < 360; a += 3) {
      const long = a % 15 === 0
      out.push(`M ${pt(long ? 233 : 239, a - 90)} L ${pt(245, a - 90)}`)
    }
    return out.join(' ')
  }, [])

  const screws: [number, number][] = [
    [62, 62],
    [578, 62],
    [62, 578],
    [578, 578],
  ]

  return (
    <svg
      className="ring"
      viewBox="0 0 640 640"
      role="img"
      aria-label={`Index ring of the Timire Machine, turned to mechanism ${mechanisms[selected].id}: ${mechanisms[selected].label}.`}
    >
      <defs>
        {mechanisms.map((m, i) => (
          <g key={m.id}>
            <path id={`arc-label-${m.id}`} d={arcPath(197, sectorMid(i) - 29, sectorMid(i) + 29)} />
            <path id={`arc-part-${m.id}`} d={arcPath(178, sectorMid(i) - 29, sectorMid(i) + 29)} />
          </g>
        ))}
      </defs>

      {/* Mounting plate, chamfered, with scratches and four screws */}
      <path className="m-plate" d="M 60 20 H 580 L 620 60 V 580 L 580 620 H 60 L 20 580 V 60 Z" />
      <path className="m-seam" d="M 60 32 H 574 L 608 66 V 574 L 574 608 H 66 L 32 574 V 66 Z" />
      <path className="m-scratch" d="M 96 548 l 46 -9 M 520 108 l 30 -14 M 470 590 l 60 -4 M 40 300 l 6 40" />
      {screws.map(([x, y]) => (
        <g key={`${x}-${y}`} className="m-screw">
          <circle cx={x} cy={y} r={9} />
          <path d={`M ${x - 6} ${y - 2} L ${x + 6} ${y + 2}`} />
        </g>
      ))}

      {/* Drive shaft out to the readout unit */}
      <g className="m-linkage">
        <rect x={590} y={311} width={50} height={18} />
        <circle cx={616} cy={320} r={11} className="m-joint" />
        <circle cx={616} cy={320} r={3.5} className="m-joint-pin" />
      </g>

      {/* Fixed bezel, graduated 000 to 330 */}
      <circle className="m-bezel" cx={C} cy={C} r={277} />
      <circle className="m-bezel-edge" cx={C} cy={C} r={250} />
      {bezelTicks.map((t, i) => (
        <path key={i} className={t.major ? 'm-tick m-tick--major' : 'm-tick'} d={t.d} />
      ))}
      {Array.from({ length: 12 }, (_, k) => {
        const [x, y] = polar(270.5, k * 30 - 90)
        return (
          <text
            key={k}
            className="m-scale-num"
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(${k * 30} ${x} ${y})`}
          >
            {String(k * 30).padStart(3, '0')}
          </text>
        )
      })}

      {/* The rotating disc */}
      <g
        className="m-disc"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <circle className="m-disc-face" cx={C} cy={C} r={246} />
        <path className="m-disc-ticks" d={discTicks} />
        <circle className="m-disc-line" cx={C} cy={C} r={228} />
        <circle className="m-disc-line" cx={C} cy={C} r={166} />
        <circle className="m-disc-line" cx={C} cy={C} r={118} />

        {mechanisms.map((m, i) => {
          const mid = sectorMid(i)
          const a0 = mid - SECTOR_DEG / 2
          const a1 = mid + SECTOR_DEG / 2
          const [gx, gy] = polar(142, mid)
          const [lx, ly] = polar(94, mid)
          const isSel = i === selected
          return (
            <g
              key={m.id}
              className={isSel ? 'm-sector is-selected' : 'm-sector'}
              onClick={() => onSelect(i)}
              data-mechanism={m.id as MechanismId}
            >
              <path className="m-sector-hit" d={wedge(66, 246, a0, a1)} />
              {isSel && <path className="m-rim-lit" d={wedge(229, 245.5, a0 + 1.2, a1 - 1.2)} />}
              <path className="m-sector-line" d={`M ${pt(66, a0)} L ${pt(246, a0)}`} />
              <text className="m-label">
                <textPath href={`#arc-label-${m.id}`} startOffset="50%" textAnchor="middle">
                  {m.label}
                </textPath>
              </text>
              <text className="m-part">
                <textPath href={`#arc-part-${m.id}`} startOffset="50%" textAnchor="middle">
                  {m.partName}
                </textPath>
              </text>
              <g transform={`translate(${gx} ${gy}) rotate(${mid + 90}) scale(0.92)`}>
                <Glyph id={m.id} />
              </g>
              <g transform={`translate(${lx} ${ly}) rotate(${mid + 90})`}>
                <circle className="m-letter-disc" r={15} />
                <text className="m-letter" textAnchor="middle" dominantBaseline="central">
                  {m.id}
                </text>
              </g>
            </g>
          )
        })}
      </g>

      {/* Hub and retaining screw (fixed) */}
      <circle className="m-hub" cx={C} cy={C} r={64} />
      <circle className="m-hub-ring" cx={C} cy={C} r={44} />
      <circle className="m-hub-screw" cx={C} cy={C} r={15} />
      <path className="m-hub-slot" d={`M ${C - 11} ${C + 4} L ${C + 11} ${C - 4}`} />

      {/* Index pointer and lamp at twelve o'clock */}
      <g className="m-pointer">
        <rect x={306} y={4} width={28} height={46} />
        <path d="M 302 48 H 338 L 320 74 Z" />
        <rect className="m-lamp" x={314} y={12} width={12} height={12} />
      </g>

      {/* Schematic-only drafting marks */}
      <g className="m-draft" aria-hidden="true">
        <path className="m-centre" d={`M ${C} 8 V 632 M 8 ${C} H 632`} />
        <path className="m-dim" d="M 74 628 H 566 M 74 620 V 636 M 566 620 V 636" />
        <path className="m-dim-arrow" d="M 74 628 l 10 -4 v 8 Z M 566 628 l -10 -4 v 8 Z" />
        <text className="m-dim-text" x={C} y={622} textAnchor="middle">
          {'Ø'}492 index ring, six sectors at 60{'°'}
        </text>
        {[
          { n: 1, from: [336, 18], to: [420, 18] },
          { n: 2, from: polar(272, -40), to: [560, 112] },
          { n: 3, from: polar(206, 205), to: [92, 150] },
          { n: 4, from: [356, 350], to: [430, 430] },
          { n: 5, from: [628, 320], to: [628, 384] },
        ].map(({ n, from, to }) => (
          <g key={n} className="m-callout">
            <path d={`M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`} />
            <circle cx={to[0] + (n === 5 ? 0 : 0)} cy={to[1] + (n === 5 ? 0 : 0)} r={12} />
            <text x={to[0]} y={to[1]} textAnchor="middle" dominantBaseline="central">
              {n}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}
