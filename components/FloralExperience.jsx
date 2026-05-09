'use client'
/**
 * FloralExperience — VERSION 1 (Ma version)
 * ─────────────────────────────────────────
 * Approche : Pure CSS + GSAP ScrollTrigger. Zéro WebGL.
 * Concept   : SVG botanique auto-dessiné au scroll + headline
 *             à masque clip-path, fond sombre pinné.
 * Perf      : Aucune dépendance 3D. Tourne partout, même sur
 *             des appareils Android bas de gamme.
 */
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './FloralExperience.module.css'

/* ── Données ──────────────────────────────────────────────── */
const PILLARS = [
  {
    num: '01',
    label: 'Sélection rigoureuse',
    desc: 'Chaque tige choisie pour sa fraîcheur et sa beauté intrinsèque.',
  },
  {
    num: '02',
    label: 'Préparation artisanale',
    desc: 'Assemblés à la main le jour même, jamais en avance.',
  },
  {
    num: '03',
    label: 'Livraison Casablanca',
    desc: 'Dans les mains du destinataire en quelques heures.',
  },
]

/* ── Composant ────────────────────────────────────────────── */
export default function FloralExperience() {
  const sectionRef = useRef(null)
  const ctxRef     = useRef(null)

  useEffect(() => {
    // Chargement dynamique → pas d'erreur SSR Next.js
    async function init() {
      const { default: gsap }      = await import('gsap')
      const { ScrollTrigger }      = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      if (!section) return

      /* ── Préparer les chemins SVG pour l'animation stroke ── */
      section.querySelectorAll('[data-stroke]').forEach(path => {
        const len = path.getTotalLength?.() ?? 500
        path.style.strokeDasharray  = len
        path.style.strokeDashoffset = len
      })

      /* ── Contexte GSAP (nettoyage propre au unmount) ──────── */
      ctxRef.current = gsap.context(() => {

        /* Master timeline pinned sur 280vh */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger:           section,
            start:             'top 60%', // cetait top top mtnant top 50%
            end:               '+=100%', //280%
            // pin:               true, c'etait true
            scrub:             1.4,          // lag smooth, pas scrub:true
            anticipatePin:     1,            // évite le saut de layout
            invalidateOnRefresh: true,       // recalcul sur resize
            // markers: 1
          }
        })

        /* ── Phase 0 (0 → 0.20) : Fond sombre + cercles ────── */
        tl
          .to('[data-el="bg"]',       { opacity: 1, duration: 0.2 }, -0.15) // c'etais 0 mtnant -0.15
          .to('[data-el="ring1"]',    { scale: 1,  opacity: 0.18, duration: 0.35, ease: 'power2.out' }, 0.04)
          .to('[data-el="ring2"]',    { scale: 1,  opacity: 0.08, duration: 0.45, ease: 'power2.out' }, 0.07)
          .to('[data-el="eyebrow"]',  { opacity: 1, y: 0, duration: 0.25 }, 0.18)

        /* ── Phase 1 (0.10 → 0.50) : SVG se dessine ─────────── */
        section.querySelectorAll('[data-stroke]').forEach((path, i) => {
          tl.to(path, {
            strokeDashoffset: 0,
            duration:  0.5 + i * 0.08,
            ease:      'power2.inOut',
          }, 0.12 + i * 0.07)
        })

        /* ── Phase 2 (0.35 → 0.65) : Headline mot par mot ───── */
        tl.to('[data-word]', {
          y:        '0%',
          duration:  0.45,
          stagger:   0.18,
          ease:      'power3.out',
        }, 0.38)

        /* ── Phase 3 (0.58 → 0.80) : Piliers philosophiques ─── */
        tl.to('[data-pillar]', {
          opacity: 1,
          y:       0,
          duration: 0.3,
          stagger:  0.14,
        }, 0.60)

        /* ── Phase 4 (0.78 → 1.00) : Ligne + CTA ────────────── */
        tl
          .to('[data-el="rule"]', { scaleX: 1, duration: 0.4 }, 0.80)
          .to('[data-el="cta"]',  { opacity: 1, y: 0, duration: 0.3 }, 0.88)

      }, section)

      /* Refresh après fonts/images chargées */
      window.addEventListener('load', ScrollTrigger.refresh, { once: true })
    }

    init()
    return () => ctxRef.current?.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label="L'expérience florale — Notre philosophie"
    >
      {/* ── Fond sombre overlay ─────────────────────────────── */}
      <div data-el="bg" className={styles.bg} aria-hidden />

      {/* ── Cercles géométriques (fond) ─────────────────────── */}
      <span data-el="ring1" className={styles.ring1} aria-hidden />
      <span data-el="ring2" className={styles.ring2} aria-hidden />

      {/* ── SVG Botanique qui se trace au scroll ────────────── */}
      <svg
        className={styles.botanicalSvg}
        viewBox="0 0 280 440"
        fill="none"
        aria-hidden
        role="img"
      >
        {/* Tige principale */}
        <path
          data-stroke
          d="M140 430 C138 385 134 340 138 295 C142 250 136 205 140 160"
          stroke="#C9A96E" strokeWidth="1" strokeLinecap="round"
        />
        {/* Feuille gauche basse */}
        <path
          data-stroke
          d="M140 330 C118 323 96 308 88 286 C108 290 128 306 140 330"
          stroke="#C9A96E" strokeWidth="0.8" strokeLinecap="round"
        />
        {/* Feuille droite */}
        <path
          data-stroke
          d="M140 278 C162 268 184 250 190 228 C170 234 153 248 140 278"
          stroke="#C9A96E" strokeWidth="0.8" strokeLinecap="round"
        />
        {/* Tige secondaire droite */}
        <path
          data-stroke
          d="M140 240 C160 230 176 210 182 192"
          stroke="#C9A96E" strokeWidth="0.5" strokeLinecap="round"
          strokeDasharray="3 6"
        />
        {/* Pétale gauche principal */}
        <path
          data-stroke
          d="M140 160 C120 140 104 116 108 88 C122 96 136 120 140 160"
          stroke="#C9A96E" strokeWidth="0.75" strokeLinecap="round"
        />
        {/* Pétale droit principal */}
        <path
          data-stroke
          d="M140 160 C160 138 178 114 174 86 C160 94 146 118 140 160"
          stroke="#C9A96E" strokeWidth="0.75" strokeLinecap="round"
        />
        {/* Pétale haut gauche */}
        <path
          data-stroke
          d="M140 160 C118 148 96 144 86 122 C102 118 124 130 140 160"
          stroke="#C9A96E" strokeWidth="0.65" strokeLinecap="round"
        />
        {/* Pétale haut droit */}
        <path
          data-stroke
          d="M140 160 C162 150 184 146 196 125 C180 120 160 132 140 160"
          stroke="#C9A96E" strokeWidth="0.65" strokeLinecap="round"
        />
        {/* Pétale intérieur 1 */}
        <path
          data-stroke
          d="M140 160 C132 148 130 136 134 124 C142 126 146 140 140 160"
          stroke="#C9A96E" strokeWidth="0.55" strokeLinecap="round"
        />
        {/* Pétale intérieur 2 */}
        <path
          data-stroke
          d="M140 160 C148 150 152 136 148 124 C140 124 136 140 140 160"
          stroke="#C9A96E" strokeWidth="0.55" strokeLinecap="round"
        />
        {/* Cercle décoratif autour de la rose */}
        <circle
          data-stroke
          cx="140" cy="148" r="38"
          stroke="#C9A96E" strokeWidth="0.35" opacity="0.45"
        />
        {/* Cercle extérieur discret */}
        <circle
          data-stroke
          cx="140" cy="148" r="56"
          stroke="#C9A96E" strokeWidth="0.25" opacity="0.2"
          strokeDasharray="4 8"
        />
        {/* Point cœur */}
        <circle cx="140" cy="144" r="4" fill="#C9A96E" opacity="0.6" />
      </svg>

      {/* ── Contenu principal ───────────────────────────────── */}
      <div className={styles.content}>

        {/* Eyebrow */}
        <p data-el="eyebrow" className={styles.eyebrow}>
          Le soin de l'essentiel
        </p>

        {/* Headline avec masque ascendant (overflow hidden + translateY) */}
        <h2
          className={styles.headline}
          aria-label="Chaque fleur raconte une histoire."
        >
          <span className={styles.maskOuter}>
            <span data-word className={styles.maskWord}>Chaque fleur</span>
          </span>
          <span className={`${styles.maskOuter} ${styles.maskOuterAccent}`}>
            <em data-word className={styles.maskItalic}>raconte</em>
          </span>
          <span className={styles.maskOuter}>
            <span data-word className={styles.maskWord}>une histoire.</span>
          </span>
        </h2>

        {/* Piliers */}
        <div className={styles.pillars}>
          {PILLARS.map(({ num, label, desc }) => (
            <article
              key={label}
              data-pillar
              className={styles.pillar}
            >
              <span className={styles.pillarNum}>{num}</span>
              <h3 className={styles.pillarLabel}>{label}</h3>
              <p  className={styles.pillarDesc}>{desc}</p>
            </article>
          ))}
        </div>

        {/* Ligne + CTA */}
        <div className={styles.bottom}>
          <div data-el="rule" className={styles.rule} aria-hidden />
          <Link
            href="/boutique"
            data-el="cta"
            className={styles.cta}
          >
            Découvrir les bouquets
            <span className={styles.ctaArrow} aria-hidden>→</span>
          </Link>
        </div>

      </div>
    </section>
  )
}
