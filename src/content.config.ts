import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import yaml from 'js-yaml';

// The file() loader needs a stable `id` per entry. Deriving it here keeps
// timeline.yaml / reading.yaml free of bookkeeping fields you'd have to maintain.
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const keyed = (idOf: (row: any, i: number) => string) => (text: string) => {
  const rows = (yaml.load(text) ?? []) as any[];
  return Object.fromEntries(rows.map((row, i) => [idOf(row, i), row]));
};

const writing = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['til', 'essay', 'note', 'paper']),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
    // old Hugo URLs kept alive by src/pages/til/[slug].astro
    aliases: z.array(z.string()).default([]),
  }),
});

const timeline = defineCollection({
  loader: file('./src/data/timeline.yaml', {
    parser: keyed((r) => `${r.kind}-${slug(r.title)}`),
  }),
  schema: z.object({
    kind: z.enum([
      'career',
      'education',
      'publication',
      'award',
      'community',
      'talk',
      'project',
    ]),
    title: z.string(),
    org: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().nullable().default(null),
    url: z.string().url().optional(),
    blurb: z.string().optional(),
    /** How much of the date is real. 'year' renders "2022", not "Jan 2022". */
    precision: z.enum(['year', 'month', 'day']).default('month'),
    /** Extra line under the title, e.g. an author list. */
    detail: z.string().optional(),
  }),
});

const reading = defineCollection({
  loader: file('./src/data/reading.yaml', {
    parser: keyed((r) => slug(r.title)),
  }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    status: z.enum(['queued', 'reading', 'done', 'abandoned']),
    tags: z.array(z.string()).default([]),
    added: z.coerce.date(),
    wrote: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const collections = { writing, timeline, reading };
