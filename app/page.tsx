import Hero from '@/components/Hero'
import FloralExperience from '@/components/FloralExperience'
import FloralExperience3D from '@/components/FloralExperience3D'
import OccasionGrid from '@/components/OccasionGrid'
import FeaturedFlowers from '@/components/FeaturedFlowers'
// import FeaturedFlowers02 from '@/components/FeaturedFlowers02'
import TrustSection from '@/components/TrustSection'
import FAQ from '@/components/FAQ'

export const metadata = {
  title: 'Flora — Fleurs de Prestige, Casablanca',
  description:
    'Bouquets d\'exception préparés à la main et livrés le jour même à Casablanca. Offrez une intention, une émotion élégante.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      
        {/* Prochaines sections à ajouter ici dans l'ordre : */}
         {/*– Section 3D sombre (wow premium) */}       
        <FloralExperience />   
        <FloralExperience3D />   
        {/*– Explorer par émotion */}
        <OccasionGrid /> 
        {/*– Fleurs populaires */}
        <FeaturedFlowers />     
        {/* <FeaturedFlowers02 />      */}
        {/*– Livraison, qualité, rapidité */}
        <TrustSection />      
          {/*- Qestions  */}
        <FAQ/>  
     
    </>
  )
}
