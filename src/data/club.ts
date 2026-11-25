/**
 * ULTRAFIT content. Everything here comes from the club's existing site copy
 * and photography. Nothing is invented: no prices, testimonials or credentials.
 * Contact details are optional and only render once the club fills them in.
 */

export type PlateId = 'red' | 'green' | 'blue' | 'yellow';

/** Competition plate colours double as the colour code for each discipline. */
export const PLATES: Record<PlateId, { hex: string; ink: string }> = {
  red: { hex: '#D8342A', ink: '#FFFFFF' },
  green: { hex: '#1F8A57', ink: '#FFFFFF' },
  blue: { hex: '#2450D3', ink: '#FFFFFF' },
  yellow: { hex: '#F0B51C', ink: '#1B1B1D' },
};

export type Discipline = {
  id: string;
  name: string;
  plate: PlateId;
  line: string;
  focus: string[];
  img: string;
  alt: string;
};

export const DISCIPLINES: Discipline[] = [
  {
    id: 'hiit-strength',
    name: 'HIIT & Strength',
    plate: 'red',
    line: 'Maximize caloric burn and muscle growth.',
    focus: ['Kettlebells', 'Barbell work', 'Intervals'],
    img: 'prog_hiit',
    alt: 'A group swinging kettlebells in the HIIT zone',
  },
  {
    id: 'power-yoga',
    name: 'Power Yoga',
    plate: 'green',
    line: 'Builds heat, endurance, and flexibility.',
    focus: ['Flow', 'Breath', 'Flexibility'],
    img: 'prog_yoga',
    alt: 'A power yoga class holding a side-angle stretch',
  },
  {
    id: 'recovery',
    name: 'Recovery',
    plate: 'blue',
    line: 'Active mobility and deep tissue techniques.',
    focus: ['Mobility', 'Foam rolling', 'Deep tissue'],
    img: 'prog_recovery',
    alt: 'A member foam rolling on a mat',
  },
  {
    id: 'coaching',
    name: 'Coaching',
    plate: 'yellow',
    line: '1-on-1 bespoke programming tailored to you.',
    focus: ['1-on-1', 'Bespoke programming', 'Form'],
    img: 'prog_coaching',
    alt: 'A coach spotting a member through a barbell squat',
  },
];

export type Coach = {
  id: string;
  first: string;
  last: string;
  role: string;
  disciplineId: string;
  plate: PlateId;
  img: string;
};

export const COACHES: Coach[] = [
  {
    id: 'marcus-vance',
    first: 'Marcus',
    last: 'Vance',
    role: 'Head of Strength',
    disciplineId: 'hiit-strength',
    plate: 'red',
    img: 'trainer_marcus',
  },
  {
    id: 'elena-rostova',
    first: 'Elena',
    last: 'Rostova',
    role: 'Yoga Master',
    disciplineId: 'power-yoga',
    plate: 'green',
    img: 'trainer_elena',
  },
  {
    id: 'david-chen',
    first: 'David',
    last: 'Chen',
    role: 'Mobility Specialist',
    disciplineId: 'recovery',
    plate: 'blue',
    img: 'trainer_david',
  },
];

export type Result = {
  id: string;
  sign: '+' | '−' | '';
  value: number;
  unit: string;
  label: string;
};

/** The club's own published figures. */
export const RESULTS: Result[] = [
  { id: 'strength', sign: '+', value: 40, unit: '%', label: 'Average member strength gain in 90 days.' },
  { id: 'body-fat', sign: '−', value: 12, unit: '%', label: 'Average body fat reduction across all members.' },
  { id: 'classes', sign: '', value: 100, unit: '+', label: 'Classes every week, scheduled for any lifestyle.' },
];

export type Space = {
  id: string;
  name: string;
  line: string;
  img: string;
  alt: string;
};

export const SPACES: Space[] = [
  {
    id: 'gym-floor',
    name: 'Gym floor',
    line: 'Racks, platforms and free weights, lit for heavy work.',
    img: 'fac_gym',
    alt: 'The main gym floor with squat racks and a lifter mid-squat',
  },
  {
    id: 'yoga-studio',
    name: 'Yoga studio',
    line: 'A daylit timber studio that opens onto the garden.',
    img: 'fac_studio',
    alt: 'A daylit yoga studio with a class in warrior pose',
  },
  {
    id: 'recovery-room',
    name: 'Recovery room',
    line: 'Walnut, stone and quiet. Somewhere to reset after the work.',
    img: 'fac_locker',
    alt: 'A walnut-panelled changing and recovery suite',
  },
];

export type Pathway = {
  id: string;
  name: string;
  summary: string;
  includes: string[];
  /** which discipline plates this pathway loads onto the bar */
  plates: PlateId[];
};

/**
 * Membership pathways group the club's real services. Rates are given on
 * enquiry, so no price appears on the site.
 */
export const PATHWAYS: Pathway[] = [
  {
    id: 'club',
    name: 'Club',
    summary: 'The gym floor and the full group class timetable.',
    includes: ['Gym floor access', 'HIIT & Strength classes', 'Power Yoga classes', '100+ classes a week to choose from'],
    plates: ['red', 'green'],
  },
  {
    id: 'club-recovery',
    name: 'Club + Recovery',
    summary: 'Everything in Club, with recovery built into your week.',
    includes: ['Everything in Club', 'Recovery sessions: mobility and deep tissue work', 'Recovery room access'],
    plates: ['red', 'green', 'blue'],
  },
  {
    id: 'coaching',
    name: '1-on-1 Coaching',
    summary: 'A coach who writes your programme and trains you through it.',
    includes: ['Bespoke programming', '1-on-1 sessions with Marcus, Elena or David', 'Full club and recovery access'],
    plates: ['red', 'green', 'blue', 'yellow'],
  },
];

export const MANTRAS = ['No excuses', 'Pure performance', 'Elevate your state', 'Commit. Sweat. Evolve.'];

/** Fill these in to show them in the footer and join section. */
export const CONTACT: { address?: string; phone?: string; email?: string; hours?: string } = {};

export const SECTIONS = [
  { id: 'ethos', label: 'Ethos' },
  { id: 'disciplines', label: 'Disciplines' },
  { id: 'results', label: 'Results' },
  { id: 'coaches', label: 'Coaches' },
  { id: 'spaces', label: 'Spaces' },
  { id: 'membership', label: 'Membership' },
  { id: 'join', label: 'Claim your pass' },
] as const;

/** Plates loaded onto the header barbell as each section is reached. */
export const BAR_LOAD: { section: string; plate: PlateId | 'chalk'; kg: number; h: number }[] = [
  { section: 'disciplines', plate: 'red', kg: 25, h: 26 },
  { section: 'results', plate: 'blue', kg: 20, h: 24 },
  { section: 'coaches', plate: 'yellow', kg: 15, h: 20 },
  { section: 'spaces', plate: 'green', kg: 10, h: 16 },
  { section: 'membership', plate: 'chalk', kg: 5, h: 12 },
  { section: 'join', plate: 'chalk', kg: 2.5, h: 9 },
];
