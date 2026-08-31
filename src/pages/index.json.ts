// Machine-readable index of everything on the site, built at compile time.
// Groundwork for the terminal UI; also useful on its own.
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = (await getCollection('writing', (p) => !p.data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const timeline = await getCollection('timeline');
  const reading = await getCollection('reading');

  return new Response(JSON.stringify({
    writing: posts.map((p) => ({
      slug: p.id, title: p.data.title, date: p.data.date,
      kind: p.data.kind, tags: p.data.tags, url: `/writing/${p.id}`,
    })),
    timeline: timeline.map((e) => ({ ...e.data })),
    reading: reading.map((r) => ({ ...r.data })),
    tags: [...new Set(posts.flatMap((p) => p.data.tags))].sort(),
  }), { headers: { 'Content-Type': 'application/json' } });
}
