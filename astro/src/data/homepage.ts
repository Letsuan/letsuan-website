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
    ctaLabel: 'OUR STORY',
    href: './about',
    realImg: './images/letsuan-hero-slide1-marine-illusion-bg-letsuan-design.jpg',
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
    realImg: './images/letsuan-hero-slide2-blue-floral-installation-letsuan-design.jpg',
    bgWidth: 2560,
    bgHeight: 1440,
    alt: 'Blue floral light installation with cascading illuminated strands and scattered petals',
    personImg: './images/letsuan-hero-slide2-woman-cutout-letsuan-design.png',
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
    realImg: './images/letsuan-hero-slide3-milky-way-bg-letsuan-design.jpg',
    bgWidth: 4963,
    bgHeight: 2970,
    alt: 'Milky Way night sky with dense stars',
    personImg: './images/letsuan-hero-slide3-worker-cutout-letsuan-design.png',
    personAlt: 'Construction worker in white hard hat and safety glasses, side profile portrait, cut out',
    personWidth: 3840,
    personHeight: 2477,
  },
];

export const services: Service[] = [
  { id: 'curatorial', title: 'Curatorial Services', desc: 'From concept development to content research and narrative scripting, we give every exhibition a solid curatorial framework and point of view.', href: './project-air-force-academy', realImg: './images/air-force-academy-eagle-sculpture-installation-with-archway-letsuan-design.jpg', alt: 'R.O.C. Air Force Academy 90th Founding Anniversary — Eagle sculpture installation with archway feature wall', imgWidth: 800, imgHeight: 400 },
  { id: 'exhibition', title: 'Exhibition Design', desc: 'Narrative-led exhibitions for museums, aquariums and cultural venues, from storyline to set design to lighting.', href: './project-cat-art', realImg: './images/cat-art-dream-painting-cat-parody-with-visitor-letsuan-design.jpg', alt: "Cat Art Museum — Visitor viewing a gold-framed cat parody reinterpretation of Picasso's The Dream painting", imgWidth: 1376, imgHeight: 1824 },
  { id: 'interior', title: 'Interior Design', desc: 'Interiors for commercial, cultural and institutional spaces, planned around how people actually move and gather.', href: './project-securities-office', realImg: './images/securities-company-office-design-02-letsuan-design.jpg', alt: 'Securities Company Office waiting area', imgWidth: 750, imgHeight: 400 },
  { id: 'visual', title: 'Visual Design', desc: 'Identity systems, wayfinding and graphic environments that carry a brand consistently through physical space.', href: './project-westernmost-point', realImg: './images/westernmost-point-taiwan-01-letsuan-design.jpg', alt: 'The Westernmost Point of Taiwan — Westernmost Point of Taiwan entrance', imgWidth: 800, imgHeight: 334 },
  { id: 'construction', title: 'Construction', desc: 'In-house fabrication and site management that takes a design from drawing to a finished, durable build.', href: './project-engineering-construction', realImg: './images/engineering-construction-circular-exhibition-hall-with-central-planter-letsuan-design.jpg', alt: 'Disaster Prevention Hall — Circular exhibition hall with central planter and panel walls', imgWidth: 700, imgHeight: 383 },
];

export const featuredProjects: FeaturedProject[] = [
  { id: 'marine-illusion', title: 'Seeing is Believing?', subtitle: 'Masters of Marine Illusion: Mimicry & Camouflage', category: 'Exhibition', year: '2026', href: './project-marine-illusion', realImg: './images/marine-illusion-03-opt-letsuan-design.jpg', alt: 'Two visitors viewing illuminated aquarium display cases beneath an Ocean Mimic Master introductory screen in a dim blue-lit gallery', imgWidth: 2400, imgHeight: 1811 },
  { id: 'ocean', title: 'Beyond Just an Exhibition—You Are Part of the Art!', subtitle: 'A Breathing Magical Universe of Light and Shadows', category: 'Exhibition', year: '2024', href: './project-beyond-just-an-exhibition', objectPosition: 'center 30%', realImg: './images/ocean-mimic-hero-opt-letsuan-design.jpg', alt: 'Visitors walking through an immersive floor-to-wall projection of pink and blue floral bursts and rippling water patterns', imgWidth: 1600, imgHeight: 1207 },
  { id: 'notre-dame', title: 'Eternal Notre-Dame', subtitle: 'A Free-Roaming VR Journey Through the Cathedral', category: 'Exhibition', year: '2023', href: './project-notre-dame', realImg: './images/eternal-notre-dame-kaohsiung-debut-letsuan-design.jpg', alt: 'Attendees wearing VR headsets and backpacks at the Eternal Notre-Dame exhibition’s Kaohsiung debut event', imgWidth: 960, imgHeight: 520 },
  { id: 'cat-art', title: 'Cat Art Museum', subtitle: 'A Super-Healing World by Shu Yamamoto', category: 'Exhibition', year: '2024', href: './project-cat-art', realImg: './images/cat-art-starry-night-mural-reinterpreted-with-cat-letsuan-design.jpg', alt: 'Starry Night mural reinterpreted with cat motifs', imgWidth: 800, imgHeight: 425 },
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
