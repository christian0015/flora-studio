import { flowers, getFlowerBySlug, getSimilarFlowers } from '@/libs/data'
import { notFound } from 'next/navigation'
import FleurPage from './FleurPage'

/* ── SSG ───────────────────────────────────────── */
export async function generateStaticParams() {
  return flowers.map(f => ({ slug: f.slug }))
}

/* ── Metadata dynamique ───────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params

  const flower = getFlowerBySlug(slug)
  if (!flower) return {}

  return {
    title: flower.seo.title,
    description: flower.seo.description,
    keywords: flower.seo.keywords,
    openGraph: {
      title: flower.seo.title,
      description: flower.seo.description,
      images: [{ url: flower.images[0] }],
    },
  }
}

/* ── Page ─────────────────────────────────────── */
export default async function Page({ params }) {
  const { slug } = await params

  const flower = getFlowerBySlug(slug)
  if (!flower) notFound()

  const similar = getSimilarFlowers(flower, 4)

  return <FleurPage flower={flower} similar={similar} />
}