import styles from './TechnicalDiagram.module.css'

type Id = 'fiscal-problem-space' | 'zivvvo-layers'

function Box({ x, y, w, h, title, sub, strong }: { x: number; y: number; w: number; h: number; title: string; sub?: string; strong?: boolean }) {
  return (
    <g className={strong ? 'd-box d-box--strong' : 'd-box'}>
      <rect x={x} y={y} width={w} height={h} />
      <text x={x + 10} y={y + 21} className="d-title">
        {title}
      </text>
      {sub && (
        <text x={x + 10} y={y + 38} className="d-sub">
          {sub}
        </text>
      )}
    </g>
  )
}

function Arrow({ d, dashed }: { d: string; dashed?: boolean }) {
  return <path d={d} className={dashed ? 'd-arrow d-arrow--dashed' : 'd-arrow'} markerEnd="url(#d-head)" />
}

const Head = () => (
  <defs>
    <marker id="d-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" className="d-head" />
    </marker>
  </defs>
)

/**
 * Original technical diagrams, drawn in blue pencil. Each carries a plain-text
 * description for screen readers and for anyone who prefers words.
 */
export function TechnicalDiagram({ id }: { id: Id }) {
  if (id === 'fiscal-problem-space') {
    return (
      <figure className={styles.fig}>
        <div className={styles.stamp}>The general problem</div>
        <div className={styles.scroll} tabIndex={0} role="region" aria-label="Diagram, scrollable on narrow screens">
          <svg viewBox="0 0 800 360" className={styles.svg} role="img" aria-labelledby="dg1-t dg1-d">
            <title id="dg1-t">Offline sales and fiscalisation: the problem space</title>
            <desc id="dg1-d">
              A sale is recorded locally first, then placed in an outbound queue. When a connection is available the queued
              transaction is submitted for fiscalisation and the acknowledgement is stored. Without a connection it stays
              queued and is retried. Each transaction carries one key so a retry cannot submit it twice. Local records are
              reconciled against acknowledgements.
            </desc>
            <Head />
            <Box x={10} y={40} w={140} h={52} title="Sale at the till" sub="basket, payment" />
            <Box x={190} y={40} w={150} h={52} title="Local record" sub="written first" strong />
            <Box x={380} y={40} w={140} h={52} title="Outbound queue" sub="one key per sale" />
            <Box x={560} y={40} w={150} h={52} title="Fiscal submission" sub="ZIMRA" />
            <Box x={560} y={170} w={150} h={52} title="Acknowledgement" sub="stored with the sale" />
            <Box x={190} y={270} w={330} h={52} title="Reconciliation" sub="local records against acknowledgements" strong />

            <Arrow d="M 150 66 H 188" />
            <Arrow d="M 340 66 H 378" />
            <Arrow d="M 520 66 H 558" />
            <Arrow d="M 635 92 V 168" />
            <Arrow d="M 450 92 C 450 150, 380 150, 380 118 C 380 104, 392 98, 404 94" dashed />
            <text x={300} y={150} className="d-note">
              no connection: stays queued, retried
            </text>
            <Arrow d="M 265 92 V 268" />
            <Arrow d="M 635 222 V 296 H 522" />
            <text x={645} y={124} className="d-note">
              same key,
            </text>
            <text x={645} y={139} className="d-note">
              submitted once
            </text>
            <text x={10} y={20} className="d-label">
              Fig. 2. Why offline business software is harder than it looks.
            </text>
          </svg>
        </div>
        <figcaption className={styles.caption}>
          Fig. 2. The general shape of the problem FiscalStack&rsquo;s products deal with: sales that must become
          valid fiscal documents even when the network is down. Each product sheet describes how that product
          answers it.
        </figcaption>
      </figure>
    )
  }

  return (
    <figure className={styles.fig}>
      <div className={styles.stamp}>Where the parts run</div>
      <div className={styles.scroll} tabIndex={0} role="region" aria-label="Diagram, scrollable on narrow screens">
        <svg viewBox="0 0 800 300" className={styles.svg} role="img" aria-labelledby="dg2-t dg2-d">
          <title id="dg2-t">Zivvvo: where the parts run</title>
          <desc id="dg2-d">
            On the phone: the interface built with React and Tailwind CSS, application state in Zustand, and a local store
            in IndexedDB through Dexie, so practice works offline. On the server side: Supabase for authentication or
            synchronisation, and the AI tutor, which calls a language model from the server rather than from the browser.
          </desc>
          <Head />
          <rect x={10} y={30} width={430} height={250} className="d-zone" />
          <text x={22} y={52} className="d-label">
            On the phone (PWA)
          </text>
          <rect x={480} y={30} width={310} height={250} className="d-zone" />
          <text x={492} y={52} className="d-label">
            Server side
          </text>
          <Box x={30} y={70} w={390} h={52} title="Interface" sub="React, Tailwind CSS" />
          <Box x={30} y={140} w={180} h={52} title="State" sub="Zustand" />
          <Box x={240} y={140} w={180} h={52} title="Local store" sub="IndexedDB via Dexie" strong />
          <text x={30} y={226} className="d-note">
            Practice, progress and mistakes kept on the device,
          </text>
          <text x={30} y={242} className="d-note">
            so the study loop survives a lost connection.
          </text>
          <Box x={500} y={70} w={270} h={52} title="Supabase" sub="authentication / sync" />
          <Box x={500} y={160} w={270} h={52} title="AI tutor" sub="model called from the server" />
          <Arrow d="M 420 96 H 498" dashed />
          <Arrow d="M 420 120 C 460 140, 460 180, 498 186" dashed />
          <text x={442} y={88} className="d-note">
            online
          </text>
        </svg>
      </div>
      <figcaption className={styles.caption}>
        Fig. 3. Zivvvo&rsquo;s components, grouped by where they run. Arrows are dashed because they cross the
        network, which is exactly the part a learner on mobile data cannot count on.
      </figcaption>
    </figure>
  )
}
