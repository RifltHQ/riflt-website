/**
 * Home Water dropdown — F4 / PR-S4
 *
 * Scoped to CURRENT beta markets only (stage-gate discipline per Captain
 * decision): heavily TN, a few AL/GA waters. Do NOT add markets not yet
 * being invited — listing waters in TX/FL/etc. would imply we're open
 * there when we aren't.
 *
 * Imported by both src/pages/Signup.jsx and src/pages/Beta.jsx so the
 * dropdown options stay identical across the two forms.
 *
 * `key` is the value sent to the backend (snake_case stable identifier).
 * `label` is what the user reads.
 *
 * If the list grows substantially (50+) we should switch to fetching from
 * riflt-mvp's water-body data via a thin API. For ≤30 the curated list
 * is fine and avoids a cross-origin call on page render.
 */

export const HOME_WATERS = [
  // ── TN — Cumberland / Middle TN ─────────────────────────────────────────
  { key: 'percy_priest',   label: 'J. Percy Priest Lake' },
  { key: 'old_hickory',    label: 'Old Hickory Lake' },
  { key: 'center_hill',    label: 'Center Hill Lake' },
  { key: 'dale_hollow',    label: 'Dale Hollow Lake' },
  { key: 'cordell_hull',   label: 'Cordell Hull Lake' },
  { key: 'caney_fork',     label: 'Caney Fork River (Tailwater)' },
  { key: 'harpeth_river',  label: 'Harpeth River' },
  { key: 'stones_river',   label: 'Stones River' },
  { key: 'cumberland',     label: 'Cumberland River (Nashville)' },

  // ── TN — East TN reservoirs + tailwaters ────────────────────────────────
  { key: 'norris',         label: 'Norris Lake' },
  { key: 'cherokee',       label: 'Cherokee Lake' },
  { key: 'douglas',        label: 'Douglas Lake' },
  { key: 'watts_bar',      label: 'Watts Bar Lake' },
  { key: 'chickamauga',    label: 'Chickamauga Lake' },
  { key: 'fort_loudoun',   label: 'Fort Loudoun / Tellico' },
  { key: 'hiwassee_river', label: 'Hiwassee River (Tailwater)' },
  { key: 'clinch_river',   label: 'Clinch River (Tailwater)' },

  // ── TN — Mountain reservoirs ────────────────────────────────────────────
  { key: 'watauga',         label: 'Watauga Lake' },
  { key: 'boone',           label: 'Boone Lake' },
  { key: 'south_holston',   label: 'South Holston Lake' },
  { key: 'watauga_river',   label: 'Watauga River (Tailwater)' },

  // ── TN — South + West ───────────────────────────────────────────────────
  { key: 'tims_ford',      label: 'Tims Ford Lake' },
  { key: 'normandy',       label: 'Normandy Lake' },
  { key: 'kentucky_lake',  label: 'Kentucky Lake' },
  { key: 'reelfoot',       label: 'Reelfoot Lake' },

  // ── AL — North AL (TN border / TVA chain) ──────────────────────────────
  { key: 'guntersville',   label: 'Lake Guntersville (AL)' },
  { key: 'wheeler',        label: 'Wheeler Lake (AL)' },
  { key: 'pickwick',       label: 'Pickwick Lake (AL/TN)' },

  // ── GA — North GA ──────────────────────────────────────────────────────
  { key: 'lanier',         label: 'Lake Lanier (GA)' },
  { key: 'burton',         label: 'Lake Burton (GA)' },

  // ── Escape hatch ───────────────────────────────────────────────────────
  { key: 'other',          label: 'Other (please specify)' },
];
