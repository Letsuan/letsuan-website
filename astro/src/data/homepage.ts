export { responsiveSrcset, avifPath } from '../utils/images';

export interface Slide {
  num: string;
  titleLine1: string;
  titleLine2: string;
  subtitleLine1: string;
  subtitleLine2: string;
  ctaLabel: string;
  href: string;
  realImg: string;
  bgWidth: number;
  bgHeight: number;
  alt: string;
  personImg?: string;
  personAlt?: string;
  personWidth?: number;
  personHeight?: number;
  titleLineHeight?: number;
  subtitleLineHeight?: number;
  titleFontScale?: number;
  ctaMarginTop?: string;
  introImg?: string;
  introAlt?: string;
  introBgWidth?: number;
  introBgHeight?: number;
  particles?: {
    count: number;
    sizeMin: number;
    sizeMax: number;
    colors: string[];
    speedMin: number;
    speedMax: number;
    centerConcentration: boolean;
    concentration?: number;
    opacityBase: number;
  };
}

export interface Service {
  id: string;
  title: string;
  desc: string;
  href: string;
  realImg: string;
  alt: string;
  imgWidth: number;
  imgHeight: number;
}

export interface FeaturedProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  href: string;
  realImg: string;
  alt: string;
  imgWidth: number;
  imgHeight: number;
  objectPosition?: string;
}

export const slides: Slide[] = [
  {
    num: '01',
    titleLine1: 'We Craft Moments',
    titleLine2: 'Not Just Spaces',
    subtitleLine1: 'Every project starts with a story',
    subtitleLine2: 'we want people to feel.',
    ctaLabel: 'VIEW PORTFOLIO',
    href: './portfolio',
    realImg: '/images/letsuan-hero-slide1-marine-illusion-bg-letsuan-design.jpg',
    bgWidth: 4560,
    bgHeight: 3440,
    alt: 'Visitors viewing the Ocean Mimic Master exhibit in a dim blue-lit gallery of illuminated marine display cases',
  },
  {
    num: '02',
    titleLine1: 'Exhibitions Come Down.',
    titleLine2: "Memories Don't.",
    subtitleLine1: 'From national museums to global brands —',
    subtitleLine2: "we've built spaces that last.",
    ctaLabel: 'OUR STORY',
    href: './about',
    particles: {
      count: 108,
      sizeMin: 0.3,
      sizeMax: 2.1,
      colors: ['#7ec8e3', '#a0d8ff', '#c2e6ff', '#6bb6d6'],
      speedMin: 0.25,
      speedMax: 0.9,
      centerConcentration: true,
      concentration: 45,
      opacityBase: 0.85,
    },
    realImg: '/images/letsuan-hero-slide2-blue-floral-installation-letsuan-design.jpg',
    bgWidth: 2560,
    bgHeight: 1440,
    alt: 'Blue floral light installation with cascading illuminated strands and scattered petals',
    personImg: '/images/letsuan-hero-slide2-woman-cutout-letsuan-design.png',
    personAlt: 'Woman in an iridescent holographic ruffled gown, side profile looking upward, cut out',
    personWidth: 696,
    personHeight: 1133,
  },
  {
    num: '03',
    titleLine1: 'One Team',
    titleLine2: 'Start to Finish',
    subtitleLine1: 'Nothing lost in translation.',
    subtitleLine2: '',
    ctaLabel: 'HOW WE WORK',
    href: './what-we-do',
    realImg: '/images/letsuan-hero-slide3-milky-way-bg-letsuan-design.jpg',
    bgWidth: 4963,
    bgHeight: 2970,
    alt: 'Milky Way night sky with dense stars',
    introImg: '/images/letsuan-hero-slide3-intro-motion-blur-bg-letsuan-design.jpg',
    introAlt: 'Abstract blue motion-blur light streaks',
    introBgWidth: 4963,
    introBgHeight: 2970,
    personImg: '/images/letsuan-hero-slide3-worker-cutout-letsuan-design.png',
    personAlt: 'Construction worker in white hard hat and safety glasses, side profile portrait, cut out',
    personWidth: 3840,
    personHeight: 2477,
  },
];

export const services: Service[] = [
  { id: 'curatorial', title: 'Curatorial Services', desc: "A good exhibition needs more than objects on display. We build the curatorial framework underneath it, the concept, the research and the storyline, so a museum or brand walks into opening day with a show that actually holds together. Twelve years of doing this for museums and cultural venues means we know where an exhibition idea tends to fall apart, and how to catch it early.", href: './project-air-force-academy', realImg: '/images/air-force-academy-eagle-sculpture-installation-with-archway-letsuan-design.jpg', alt: 'R.O.C. Air Force Academy 90th Founding Anniversary — Eagle sculpture installation with archway feature wall', imgWidth: 800, imgHeight: 400 },
  { id: 'exhibition', title: 'Exhibition Design', desc: "An exhibition lives or dies on how it moves people through it. We design the storyline, the lighting and the interactive pieces as one system, not separate vendors bolted together, so a visitor at a museum or aquarium follows the idea without needing a wall of text to explain it.", href: './project-cat-art', realImg: '/images/cat-art-dream-painting-cat-parody-with-visitor-letsuan-design.jpg', alt: "Cat Art Museum — Visitor viewing a gold-framed cat parody reinterpretation of Picasso's The Dream painting", imgWidth: 1376, imgHeight: 1824 },
  { id: 'interior', title: 'Interior Design', desc: "Commercial and institutional spaces get used by real people moving through them all day, and that's what we design around. As a licensed interior decorator, we plan layout and circulation first, then finish and materials, so an office or public space works the way people actually move through it, not just how it looks in a rendering.", href: './project-securities-office', realImg: '/images/securities-company-office-design-02-letsuan-design.jpg', alt: 'Securities Company Office waiting area', imgWidth: 750, imgHeight: 400 },
  { id: 'visual', title: 'Visual Design', desc: "A brand only holds together if it looks the same on the entrance sign as it does on the sixth wayfinding panel. We build the identity system, the signage and the environmental graphics as one set, so a visitor recognizes the brand the same way from the front door to the far corner of the building.", href: './project-westernmost-point', realImg: '/images/westernmost-point-taiwan-01-letsuan-design.jpg', alt: 'The Westernmost Point of Taiwan — Westernmost Point of Taiwan entrance', imgWidth: 800, imgHeight: 334 },
  { id: 'construction', title: 'Construction', desc: 'Design and construction usually split into two companies pointing fingers at each other when something goes wrong. We keep it one team: our own fabrication shop and site management handle the build directly, specialist trades work under our supervision, and someone accountable is on site from groundbreaking to the final walkthrough.', href: './project-engineering-construction', realImg: '/images/engineering-construction-circular-exhibition-hall-with-central-planter-letsuan-design.jpg', alt: 'Disaster Prevention Hall — Circular exhibition hall with central planter and panel walls', imgWidth: 700, imgHeight: 383 },
];

export const featuredProjects: FeaturedProject[] = [
  { id: 'marine-illusion', title: 'Seeing is Believing?', subtitle: 'Masters of Marine Illusion: Mimicry & Camouflage', category: 'Exhibition', year: '2026', href: './project-marine-illusion', realImg: '/images/marine-illusion-03-letsuan-design.jpg', alt: 'Two visitors viewing illuminated aquarium display cases beneath an Ocean Mimic Master introductory screen in a dim blue-lit gallery', imgWidth: 1200, imgHeight: 905 },
  { id: 'ocean', title: 'Beyond Just an Exhibition—You Are Part of the Art!', subtitle: 'A Breathing Magical Universe of Light and Shadows', category: 'Exhibition', year: '2024', href: './project-beyond-just-an-exhibition', realImg: '/images/beyond-exhibition-visitors-interacting-with-pulsating-valley-letsuan-design.jpg', alt: 'Beyond Just an Exhibition–You Are Part of the Art! — Visitors interacting with Pulsating Valley floor projection among sunflowers', imgWidth: 960, imgHeight: 425 },
  { id: 'notre-dame', title: 'Eternal Notre-Dame', subtitle: 'A Free-Roaming VR Journey Through the Cathedral', category: 'Exhibition', year: '2023', href: './project-notre-dame', realImg: '/images/notre-dame-vr-users-letsuan-design.jpg', alt: "Staff adjusting a visitor's VR headset strap while other visitors wear headsets nearby", imgWidth: 960, imgHeight: 520 },
  { id: 'cat-art', title: 'Cat Art Museum', subtitle: 'A Super-Healing World by Shu Yamamoto', category: 'Exhibition', year: '2024', href: './project-cat-art', realImg: '/images/cat-art-mona-lisa-cat-scene-with-visitor-letsuan-design.jpg', alt: 'Mona Lisa cat scene with visitor seated at desk', imgWidth: 800, imgHeight: 600 },
];

export const navMenuItems = [
  { key: 'exhibition', label: 'Exhibition Design', href: '/portfolio?cat=Exhibition+Design' },
  { key: 'interior', label: 'Interior Design', href: '/portfolio?cat=Interior+Design' },
  { key: 'visual', label: 'Visual Design', href: '/portfolio?cat=Visual+Design' },
  { key: 'event', label: 'Event', href: '/portfolio?cat=Event' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'what-we-do', label: 'What We Do', href: '/what-we-do' },
  { key: 'contact', label: 'Contact', href: '/contact' },
];

export const navFeaturedItems = [
  { num: '01', title: 'Seeing is Believing?', meta: 'Masters of Marine Illusion: Mimicry & Camouflage', href: '/project-marine-illusion' },
  { num: '02', title: 'Beyond Just an Exhibition—You Are Part of the Art!', meta: 'Step Into a Breathing Magical Universe of Light and Shadows', href: '/project-beyond-just-an-exhibition' },
  { num: '03', title: 'Eternal Notre-Dame', meta: 'International Debut of the VR Immersive Exhibition in Taiwan', href: '/project-notre-dame' },
  { num: '04', title: 'Cat Art Museum', meta: 'A Super-Healing World by Shu Yamamoto', href: '/project-cat-art' },
  { num: '05', title: 'The Missing Scientist', meta: 'Electromagnetic Horizon II', href: '/project-missing-scientist' },
  { num: '06', title: 'Experience the Yokai World', meta: '100 Stories of Yokai Exhibition', href: '/project-yokai-world' },
  { num: '07', title: 'Universe', meta: '500 Pieces of LED Kinetic Light', href: '/project-led-kinetic' },
];
