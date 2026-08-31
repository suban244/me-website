#!/usr/bin/env node
// One-way sync: Obsidian vault -> src/content/writing.
// Only notes with `publish: true` in frontmatter are imported, so your vault
// stays the source of truth and drafts never leak into a build.
//
//   npm run import            # sync
//   npm run import -- --dry   # show what would change, write nothing

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const DRY = process.argv.includes('--dry');
const OUT = 'src/content/writing';

// --- env -------------------------------------------------------------------
for (const line of fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8').split('\n') : []) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
const VAULT = process.env.OBSIDIAN_VAULT;
if (!VAULT || !fs.existsSync(VAULT)) {
  console.error(`✗ OBSIDIAN_VAULT not set or missing.\n  Copy .env.example to .env and point it at your vault.`);
  process.exit(1);
}
const ROOT = process.env.OBSIDIAN_SUBFOLDER ? path.join(VAULT, process.env.OBSIDIAN_SUBFOLDER) : VAULT;

// --- helpers ---------------------------------------------------------------
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

// Index every attachment in the vault by basename so ![[foo.png]] resolves
// no matter which folder Obsidian filed it under.
function indexAttachments(dir, map = new Map()) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) indexAttachments(p, map);
    else if (/\.(png|jpe?g|gif|svg|webp|avif|pdf)$/i.test(e.name) && !map.has(e.name)) map.set(e.name, p);
  }
  return map;
}

function parse(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  try { return { data: yaml.load(m[1]) ?? {}, body: m[2] }; }
  catch { return { data: {}, body: m[2] }; }
}

// --- collect ---------------------------------------------------------------
const attachments = indexAttachments(VAULT);
const notes = walk(ROOT)
  .map((file) => ({ file, ...parse(fs.readFileSync(file, 'utf8')) }))
  .filter((n) => n.data.publish === true);

const published = new Map(
  notes.map((n) => [path.basename(n.file, '.md'), slug(n.data.slug || path.basename(n.file, '.md'))])
);

let written = 0, copied = 0;
const missing = [];

for (const note of notes) {
  const name = path.basename(note.file, '.md');
  const id = slug(note.data.slug || name);
  const dir = path.join(OUT, id);
  let body = note.body;

  // ![[image.png]] and ![[image.png|caption]] -> ![caption](./image.png)
  body = body.replace(/!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_, target, caption) => {
    const base = path.basename(target.trim());
    const src = attachments.get(base);
    if (!src) { missing.push(`${id}: ${base}`); return ''; }
    if (!DRY) {
      fs.mkdirSync(dir, { recursive: true });
      fs.copyFileSync(src, path.join(dir, base));
    }
    copied++;
    return `![${(caption || '').trim()}](./${base})`;
  });

  // [[Note]] / [[Note|label]] -> link if published, otherwise plain text
  body = body.replace(/\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_, target, label) => {
    const text = (label || target).trim();
    const dest = published.get(target.trim());
    return dest ? `[${text}](/writing/${dest})` : text;
  });

  // Obsidian indents with tabs; normalise so nested lists parse everywhere.
  body = body.replace(/^\t+/gm, (t) => '  '.repeat(t.length));

  const fm = {
    title: note.data.title || name,
    date: (note.data.date || note.data.created || new Date().toISOString().slice(0, 10)),
    kind: note.data.kind || 'til',
    tags: (Array.isArray(note.data.tags) ? note.data.tags : []).map(slug),
    ...(note.data.summary ? { summary: note.data.summary } : {}),
    ...(note.data.draft ? { draft: true } : {}),
    aliases: [`/til/${id}/`],
  };

  const out = `---\n${yaml.dump(fm).trim()}\n---\n\n${body.trim()}\n`;
  const dest = path.join(dir, 'index.md');
  if (!DRY) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dest, out);
  }
  written++;
  console.log(`  ${DRY ? '[dry] ' : ''}${id}/index.md   kind=${fm.kind} tags=[${fm.tags}]`);
}

console.log(`\n${DRY ? 'Would import' : 'Imported'} ${written} note(s), ${copied} attachment(s).`);
if (missing.length) {
  console.log(`\n⚠ ${missing.length} attachment(s) not found in the vault (reference dropped):`);
  for (const m of missing) console.log(`   - ${m}`);
}
if (!notes.length) console.log(`No notes marked 'publish: true' under ${ROOT}`);
