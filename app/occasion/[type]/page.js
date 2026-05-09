import { occasions, getOccasionBySlug, getOccasionFlowers } from '@/libs/data'
import { notFound } from 'next/navigation'
import OccasionPage from './OccasionPage'

/* ── SSG : pré-génère toutes les occasions ──────────────────── */
export async function generateStaticParams() {
  return occasions.map(o => ({ type: o.slug }))
}

/* ── Metadata dynamique ─────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { type } = await params

  const occ = getOccasionBySlug(type)
  if (!occ) return {}

  return {
    title: `${occ.label} — Flora Casablanca`,
    description: occ.longDesc,
    keywords: [
      `fleurs ${occ.label.toLowerCase()} casablanca`,
      'bouquet maroc',
      'livraison fleurs casablanca'
    ],
  }
}

/* ── Page ───────────────────────────────────────────────────── */
export default async function Page({ params }) {
  const { type } = await params

  const occ = getOccasionBySlug(type)
  console.log("-----------Type: ", "----------Occasion: ",occ)
  if (!occ) notFound()

  const flowers = getOccasionFlowers(type)
  const rest = occasions.filter(o => o.slug !== type)

  return (
    <OccasionPage
      occasion={occ}
      flowers={flowers}
      otherOccasions={rest}
    />
  )
}