import type { Mechanism } from './types'
import { places } from './places'

/**
 * Identity and contact details. Every value here was supplied by Tawanda.
 * Leave a field `undefined` rather than guessing; components hide empty ones.
 */
export const profile = {
  name: 'Tawanda Timire',
  givenName: 'Tawanda',
  familyName: 'Timire',
  location: 'Harare, Zimbabwe',
  roles: [
    'Software engineer',
    'Data scientist',
    'Founder and Managing Director, FiscalStack Solutions',
  ],
  primaryStack: 'C# / .NET and API development',
  alsoDoes: ['Data science', 'QA and software testing', 'System architecture', 'Product', 'Running a business'],
  /**
   * Path under public/images/ for your photograph, e.g. 'profile/portrait.jpg'.
   * Leave undefined until a real photograph is supplied.
   */
  portrait: 'profile/tawanda-timire.jpg',
  voiceLine: 'A dossier assembled from repositories, products, writing and the subject’s own account.',
  contact: {
    email: 'tawandattimire@gmail.com',
    phoneDisplay: '+263 78 334 1752',
    phoneHref: 'tel:+263783341752',
    whatsappHref: 'https://wa.me/263783341752',
    github: 'https://github.com/timiretimzzy',
    githubHandle: 'timiretimzzy',
    linkedin: 'https://www.linkedin.com/in/tawanda-timire-91137b149/',
    instagram: 'https://www.instagram.com/timire.tawanda/',
    x: 'https://x.com/timiretimzzy2',
    facebook: 'https://www.facebook.com/tawanda.timire.98',
  },
  companySites: [
    { label: 'fiscalstack.co.zw', href: places.fiscalstackZw, note: 'FiscalStack Solutions, Zimbabwe' },
    { label: 'fiscalstack.co.ls', href: places.fiscalstackLs, note: 'FiscalStack, Lesotho site' },
  ],
  interests: [
    'Technology and software',
    'Data science and predictive analytics',
    'Cricket',
    'Football',
    'Economics and business',
    'African history',
    'Philosophy and questions about belief',
    'Creative writing and humour',
  ],
} as const

/**
 * Career log. Source: the portfolio context dossier supplied by Tawanda.
 * `evidence: 'stated'` until checked against a CV or records.
 */
export const experience = [
  {
    org: 'FiscalStack Solutions',
    role: 'Founder and Managing Director; software developer',
    period: undefined as string | undefined,
    place: 'Harare',
    notes: 'Product direction, architecture and implementation of Windows and web business software, fiscalisation-related integration, client onboarding, support, and running the company.',
    evidence: 'stated' as const,
  },
  {
    org: 'BrainStake Technologies',
    role: 'Graduate Trainee, Data and Software Engineering',
    period: '2025',
    place: undefined as string | undefined,
    notes: 'Educational technology; backend and frontend work, data integration on SQL Server, validation, reporting, functional and regression testing in a shared codebase.',
    evidence: 'stated' as const,
  },
  {
    org: 'Axis Solutions Africa',
    role: 'Software Developer and Data Scientist',
    period: '2022–2024',
    place: 'Harare',
    notes: 'C#/.NET and SQL business software around POS and ERP workflows, fiscalisation and integrations, reconciliation, dashboards, data preprocessing, machine-learning prototypes, testing, deployment and support.',
    evidence: 'stated' as const,
  },
  {
    org: 'Brain Bunchy Consultancy',
    role: 'Part-time co-owner; quizmaster, adjudicator, operations',
    period: undefined as string | undefined,
    place: 'Zimbabwe',
    notes: 'School quiz tournaments, educational events, debate and drama programmes, training and adjudication. Took winning students to Botswana as patron.',
    evidence: 'stated' as const,
  },
]

export const education = [
  {
    institution: 'University of Zimbabwe',
    award: 'BSc Honours, Data Science and Systems',
    period: '2021–2025',
    note: 'Dissertation on real-time ODI cricket outcome prediction.',
  },
  {
    institution: 'Namibia University of Science and Technology',
    award: 'BSc Electronics and Telecommunications Engineering (two years, not completed)',
    period: '2018–2020',
    note: 'Completed two years of study before moving to the next stage of his work and training.',
  },
]

/**
 * The six mechanisms of the machine, in index-ring order.
 * The ring is divided into six 60-degree sectors in this order, clockwise.
 */
export const mechanisms: Mechanism[] = [
  {
    id: 'A',
    shortLabel: 'Commerce',
    label: 'Commercial systems',
    partName: 'The Ledger',
    summary: 'Software people pay for and run their businesses on: point of sale, fiscalisation, accounting, integrations.',
  },
  {
    id: 'B',
    shortLabel: 'Architecture',
    label: 'Software architecture',
    partName: 'The Frame',
    summary: 'The structural part: C# and .NET services, APIs, data models and the decisions that hold them together.',
  },
  {
    id: 'C',
    shortLabel: 'Data',
    label: 'Data and research',
    partName: 'The Estimator',
    summary: 'Predictive analytics, feature engineering and the habit of asking what the numbers can actually support.',
  },
  {
    id: 'D',
    shortLabel: 'Testing',
    label: 'Testing and verification',
    partName: 'The Gauge',
    summary: 'QA practice: checking that the thing does what it claims, including when the network, the device or the user misbehaves.',
  },
  {
    id: 'E',
    shortLabel: 'Experiments',
    label: 'Products and experiments',
    partName: 'The Loose Gear',
    summary: 'Games, prototypes and product bets. The part of the machine that is allowed to rattle.',
  },
  {
    id: 'F',
    shortLabel: 'Writing',
    label: 'Writing and teaching',
    partName: 'The Mouthpiece',
    summary: 'Quizmastering, adjudication, educational events and Rumblings of a Fool.',
  },
]

export function mechanismById(id: string) {
  return mechanisms.find((m) => m.id === id)
}
