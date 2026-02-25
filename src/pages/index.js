import Head from 'next/head'
import SerengetiHero from './components/SerengetiHero'
import SerengetiIntro from './components/SerengetiIntro'
import SerengetiRooms from './components/SerengetiRooms'
import SerengetiExperience from './components/SerengetiExperience'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>KwaTerry Village | Luxury Safari Experience</title>
        <meta property="og:title" content="KwaTerry Village" />
        <meta name="description" content="Experience luxury in the heart of the wild. Unforgettable safaris, exquisite dining, and serene relaxation." />
        <link rel='icon' href="/favicon.ico" />
        <meta name="keywords" content="luxury hotel, safari experience, boutique lodge, wildlife retreat, premium accommodation" />
        <meta property="og:description" content="Experience luxury in the heart of the wild. Unforgettable safaris, exquisite dining, and serene relaxation." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KwaTerry Lodge" />
        <meta name="twitter:description" content="Experience luxury in the heart of the wild." />
      </Head>
      
      <SerengetiHero />
      <SerengetiIntro />
      <SerengetiRooms />
      <SerengetiExperience />
    </div>
  )
}
