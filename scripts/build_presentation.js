// Los Bocatones - VelesHack submission deck, in the visual language of the battery panel.
// Usage: npm install pptxgenjs && node scripts/build_presentation.js delivery/LosBocatones_VelesHack.pptx
const pptxgen = require('pptxgenjs');
const out = process.argv[2];

const INK = '101312', PAPER = 'F5F6F3', OFF = 'E4E8E2', SOFT = '3E4341', HIGH = '3DDC84', LOW = 'FF5C3E', MID = 'FFC02E';
const HEAD = 'Bahnschrift Condensed', BODY = 'Bahnschrift', MONO = 'Courier New';
const W = 10, H = 5.625, M = 0.5, BAR = 0.5;
const SECTIONS = ['GitHub repo', 'Summary', 'Highlights'];

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'Swarm Lab - Los Bocatones';
pres.author = 'Los Bocatones';
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };

// The screen is the battery: 20 cells stacked top to bottom, the charged ones lit from the bottom.
function cells(slide, lit, color) {
  const n = 20, gap = 0.03, h = (H - gap * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    slide.addShape(pres.ShapeType.rect, { x: 0, y: i * (h + gap), w: W, h, fill: { color: i >= n - lit ? color : OFF }, line: { color: i >= n - lit ? color : OFF, width: 0 }, objectName: `cell-${i + 1}` });
  }
}

function topBar(slide, current) {
  slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: BAR, fill: { color: INK }, line: { color: INK, width: 0 }, objectName: 'bar' });
  slide.addText('SWARM / LAB', { x: M, y: 0, w: 2.2, h: BAR, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: PAPER, charSpacing: 2.5, valign: 'middle', isTextBox: true, objectName: 'brand' });
  const widths = [1.2, 0.95, 1.05];
  let x = 4.55;
  SECTIONS.forEach((name, i) => {
    const on = name === current;
    slide.addText(name, { x, y: 0.1, w: widths[i], h: 0.3, margin: 0, fontFace: BODY, fontSize: 10, bold: true, align: 'center', valign: 'middle', color: on ? INK : 'C9CEC8', fill: { color: on ? PAPER : INK }, isTextBox: true, objectName: `tab-${i + 1}` });
    x += widths[i] + 0.05;
  });
  slide.addShape(pres.ShapeType.ellipse, { x: 8.02, y: 0.2, w: 0.1, h: 0.1, fill: { color: HIGH }, line: { color: HIGH, width: 0 }, objectName: 'status-dot' });
  slide.addText('los-bocatones', { x: 8.2, y: 0, w: 1.3, h: BAR, margin: 0, fontFace: BODY, fontSize: 10, color: PAPER, valign: 'middle', isTextBox: true, objectName: 'team' });
}

function footer(slide, n) {
  slide.addText('Los Bocatones · Challenge 4 CoGNETs · VelesHack 2026 · Local runs, not an official score', { x: M, y: 5.2, w: 8, h: 0.25, margin: 0, fontFace: BODY, fontSize: 10, color: SOFT, valign: 'middle', isTextBox: true, objectName: 'footer' });
  slide.addText(String(n), { x: 9, y: 5.2, w: 0.5, h: 0.25, margin: 0, fontFace: BODY, fontSize: 10, bold: true, color: INK, align: 'right', valign: 'middle', isTextBox: true, objectName: 'page' });
}

function title(slide, text) {
  slide.addText(text, { x: M, y: 0.72, w: 9, h: 0.7, margin: 0, fontFace: HEAD, fontSize: 40, bold: true, color: INK, valign: 'middle', isTextBox: true, objectName: 'title' });
}

const rule = (slide, x, y, w, name) => slide.addShape(pres.ShapeType.rect, { x, y, w, h: 0.04, fill: { color: INK }, line: { color: INK, width: 0 }, objectName: name });

// ---------------------------------------------------------------- 1. Title
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  cells(s, 13, HIGH);
  topBar(s, null);
  s.addText('Challenge 4 · CoGNETs · Smart Edge Resource Auctions', { x: M, y: 0.8, w: 9, h: 0.3, margin: 0, fontFace: BODY, fontSize: 14, bold: true, color: INK, isTextBox: true, objectName: 'context' });
  s.addText('Swarm Lab', { x: M, y: 1.12, w: 9, h: 0.6, margin: 0, fontFace: HEAD, fontSize: 32, bold: true, color: INK, valign: 'middle', isTextBox: true, objectName: 'project-name' });
  s.addText('Compete today.\nStay alive tomorrow.', { x: M, y: 2.1, w: 9, h: 2.0, margin: 0, fontFace: HEAD, fontSize: 66, bold: true, color: INK, valign: 'middle', lineSpacingMultiple: 0.86, isTextBox: true, objectName: 'tagline' });
  s.addShape(pres.ShapeType.rect, { x: M, y: 4.42, w: 3.2, h: 0.42, fill: { color: INK }, line: { color: INK, width: 0 }, objectName: 'what-plate' });
  s.addText('A battery-aware edge agent', { x: M + 0.15, y: 4.42, w: 2.95, h: 0.42, margin: 0, fontFace: BODY, fontSize: 16, bold: true, color: PAPER, valign: 'middle', isTextBox: true, objectName: 'what' });
  s.addText('Los Bocatones · Marc and Carlos', { x: 3.9, y: 4.42, w: 5.6, h: 0.42, margin: 0, fontFace: BODY, fontSize: 16, bold: true, color: INK, valign: 'middle', isTextBox: true, objectName: 'who' });
  s.addNotes('Somos Los Bocatones, Marc y Carlos. Nuestro agente es un dispositivo que compite cada ronda por cómputo, energía y seguridad. La idea central: la energía que ganas hoy se descuenta de tu batería, y sin batería mañana no puntúas.');
}

// ---------------------------------------------------------------- 2. GitHub repo
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  cells(s, 0, HIGH);
  topBar(s, 'GitHub repo');
  title(s, 'GitHub repo');
  s.addText('https://github.com/carlosclariana/veleshack-2026-4th-challenge', { x: M, y: 1.5, w: 9, h: 0.4, margin: 0, fontFace: BODY, fontSize: 18, bold: true, color: INK, valign: 'middle', isTextBox: true, objectName: 'repo-url' });

  rule(s, M, 2.2, 3.9, 'facts-rule');
  const facts = [['TEAM_NAME', 'los-bocatones'], ['Dockerfile', 'agent-template/Dockerfile'], ['Members', 'Marc and Carlos'], ['Fork of', 'czavitsanos-iti/\nveleshack-2026-4th-challenge']];
  let y = 2.36;
  facts.forEach(([k, v], i) => {
    const h = v.includes('\n') ? 0.6 : 0.42;
    s.addText(k, { x: M, y, w: 1.2, h: 0.42, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: SOFT, valign: 'middle', isTextBox: true, objectName: `fact-${i + 1}-label` });
    s.addText(v, { x: 1.7, y, w: 2.7, h, margin: 0, fontFace: BODY, fontSize: 14, bold: true, color: INK, valign: v.includes('\n') ? 'top' : 'middle', isTextBox: true, objectName: `fact-${i + 1}-value` });
    y += h + 0.1;
  });

  s.addShape(pres.ShapeType.rect, { x: 4.8, y: 2.2, w: 4.7, h: 2.7, fill: { color: INK }, line: { color: INK, width: 0 }, objectName: 'plate' });
  s.addText('Build and run', { x: 5.05, y: 2.35, w: 4.2, h: 0.35, margin: 0, fontFace: BODY, fontSize: 16, bold: true, color: PAPER, valign: 'middle', isTextBox: true, objectName: 'plate-title' });
  s.addText('docker build -t swarm-agent:submission \\\n    agent-template\n\ndocker compose --profile agent up --build', { x: 5.05, y: 2.8, w: 4.3, h: 1.1, margin: 0, fontFace: MONO, fontSize: 11, color: PAPER, valign: 'top', isTextBox: true, objectName: 'commands' });
  s.addText('Live dashboard at http://localhost:8080', { x: 5.05, y: 3.72, w: 4.3, h: 0.3, margin: 0, fontFace: BODY, fontSize: 12, color: 'C9CEC8', valign: 'middle', isTextBox: true, objectName: 'dashboard' });
  s.addText([
    { text: '8 / 8', options: { bold: true, color: HIGH, fontFace: HEAD, fontSize: 24 } },
    { text: '   official conformance checks on the built image', options: { color: PAPER, fontSize: 12 } },
  ], { x: 5.05, y: 4.25, w: 4.3, h: 0.5, margin: 0, fontFace: BODY, valign: 'middle', isTextBox: true, objectName: 'conformance' });
  footer(s, 2);
  s.addNotes('El repositorio es un fork público del reto. TEAM_NAME los-bocatones, Dockerfile en agent-template. La imagen construida pasa las ocho pruebas oficiales de conformidad.');
}

// ---------------------------------------------------------------- 3. Summary
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  cells(s, 0, HIGH);
  topBar(s, 'Summary');
  title(s, 'Summary');
  s.addText('The energy you win is drawn from your own battery. Run flat and you sit the round out. Our agent treats charge as money and bids for the whole match, not for one round.', { x: M, y: 1.45, w: 9, h: 0.75, margin: 0, fontFace: BODY, fontSize: 15, color: INK, valign: 'top', isTextBox: true, objectName: 'lead' });

  const points = [
    ['Reads the market', 'Rebuilds rival bids from the shares it was actually allocated.'],
    ['Prices the recharge', 'Scores each candidate bid by utility per active and recharge round.'],
    ['Protects the floors', 'Missing a service floor halves the round, so candidates sit on the safe side.'],
  ];
  let y = 2.45;
  points.forEach(([h, b], i) => {
    rule(s, M, y, 4.0, `point-${i + 1}-rule`);
    s.addText(h, { x: M, y: y + 0.07, w: 4.0, h: 0.3, margin: 0, fontFace: BODY, fontSize: 15, bold: true, color: INK, valign: 'middle', isTextBox: true, objectName: `point-${i + 1}-head` });
    s.addText(b, { x: M, y: y + 0.37, w: 4.0, h: 0.42, margin: 0, fontFace: BODY, fontSize: 12, color: SOFT, valign: 'top', isTextBox: true, objectName: `point-${i + 1}-body` });
    y += 0.9;
  });

  // Rounds spent resting, out of 60. One cell per round; counts are the 50-seed means, rounded.
  const gx = 5.0, cw = 0.125, gapx = 0.025, ch = 0.2;
  s.addText('Rounds spent resting, out of 60', { x: gx, y: 2.45, w: 4.5, h: 0.3, margin: 0, fontFace: BODY, fontSize: 15, bold: true, color: INK, valign: 'middle', isTextBox: true, objectName: 'rest-title' });
  const rows = [['Starting template', 18, '18.4 resting · 13.39 points'], ['Our agent', 7, '6.5 resting · 17.23 points']];
  let gy = 2.9;
  rows.forEach(([label, idle, caption], r) => {
    s.addText(label, { x: gx, y: gy, w: 2.0, h: 0.26, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: INK, valign: 'middle', isTextBox: true, objectName: `rest-${r + 1}-label` });
    s.addText(caption, { x: gx + 2.0, y: gy, w: 2.5, h: 0.26, margin: 0, fontFace: BODY, fontSize: 12, color: SOFT, align: 'right', valign: 'middle', isTextBox: true, objectName: `rest-${r + 1}-caption` });
    for (let i = 0; i < 60; i++) {
      const col = i % 30, line = Math.floor(i / 30), rest = i >= 60 - idle;
      s.addShape(pres.ShapeType.rect, { x: gx + col * (cw + gapx), y: gy + 0.32 + line * (ch + 0.04), w: cw, h: ch, fill: { color: rest ? LOW : INK }, line: { color: rest ? LOW : INK, width: 0 }, objectName: `rest-${r + 1}-cell-${i + 1}` });
    }
    gy += 0.98;
  });
  s.addShape(pres.ShapeType.rect, { x: gx, y: 4.88, w: cw, h: 0.14, fill: { color: LOW }, line: { color: LOW, width: 0 }, objectName: 'legend-swatch' });
  s.addText('resting on a flat battery · mean of 50 held-out seeds', { x: gx + 0.2, y: 4.82, w: 4.3, h: 0.26, margin: 0, fontFace: BODY, fontSize: 10, color: SOFT, valign: 'middle', isTextBox: true, objectName: 'legend' });
  footer(s, 3);
  s.addNotes('La plantilla de partida ignora el coste de la batería y descansa unas 18 rondas de 60. Nuestro agente estima la competencia a partir de sus propias asignaciones, puntúa cada oferta contando lo que costará recargar y protege los dos mínimos. Descansa unas 6 rondas y sube de 13,39 a 17,23 puntos.');
}

// ---------------------------------------------------------------- 4. Highlights
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  cells(s, 0, HIGH);
  topBar(s, 'Highlights');
  title(s, 'Highlights');
  const figs = [
    ['+28.7 %', 'Over the starting template', '17.23 against 13.39 mean score on 50 held-out seeds.'],
    ['50 / 50', 'Ahead of all three bots', 'In every held-out run. Policy frozen after 15 development seeds.'],
    ['1st of 4', 'Live graded match over HTTP', '18.24 against 13.51 for the best bot. 87 injected faults, no round missed.'],
  ];
  const cw = 2.8, gap = 0.3;
  figs.forEach(([n, h, b], i) => {
    const x = M + i * (cw + gap);
    rule(s, x, 1.52, cw, `fig-${i + 1}-rule`);
    s.addText(n, { x, y: 1.6, w: cw, h: 0.85, margin: 0, fontFace: HEAD, fontSize: 54, bold: true, color: INK, valign: 'middle', isTextBox: true, objectName: `fig-${i + 1}-number` });
    s.addText(h, { x, y: 2.48, w: cw, h: 0.3, margin: 0, fontFace: BODY, fontSize: 14, bold: true, color: INK, valign: 'middle', isTextBox: true, objectName: `fig-${i + 1}-head` });
    s.addText(b, { x, y: 2.8, w: cw, h: 0.5, margin: 0, fontFace: BODY, fontSize: 12, color: SOFT, valign: 'top', isTextBox: true, objectName: `fig-${i + 1}-body` });
  });

  s.addShape(pres.ShapeType.rect, { x: M, y: 3.5, w: 9, h: 1.5, fill: { color: INK }, line: { color: INK, width: 0 }, objectName: 'plate' });
  s.addText('What did not work', { x: 0.72, y: 3.6, w: 8.5, h: 0.32, margin: 0, fontFace: BODY, fontSize: 15, bold: true, color: PAPER, valign: 'middle', isTextBox: true, objectName: 'plate-title' });
  const fails = [
    ['Saving more battery', 'Charging 1.5× and 2× more for energy scored lower. Rejected.'],
    ['First live run: 2nd', 'History arrived incomplete. We fixed the transport and kept the result.'],
    ['Neighbours lose', 'Their combined score fell from 44.24 to 38.41.'],
  ];
  fails.forEach(([h, b], i) => {
    const x = 0.72 + i * (cw + 0.12);
    s.addText(h, { x, y: 3.98, w: cw - 0.1, h: 0.28, margin: 0, fontFace: BODY, fontSize: 13, bold: true, color: i === 0 ? MID : i === 1 ? LOW : 'FF8AD8', valign: 'middle', isTextBox: true, objectName: `fail-${i + 1}-head` });
    s.addText(b, { x, y: 4.27, w: cw - 0.15, h: 0.62, margin: 0, fontFace: BODY, fontSize: 12, color: PAPER, valign: 'top', isTextBox: true, objectName: `fail-${i + 1}-body` });
  });
  footer(s, 4);
  s.addNotes('Fijamos la estrategia con 15 semillas y la medimos en 50 distintas: un 28,7 % más que la plantilla y por delante de los tres bots en las 50. En red real con errores 503 y 429, con nuestro nombre de equipo, quedó primera. Lo que no funcionó: ser más conservador con la batería empeora la nota; la primera prueba real quedó segunda por un fallo de integración que corregimos; y nuestra mejora sale en parte de los vecinos. No tenemos el agente de referencia ni las semillas finales, así que no prometemos nota.');
}

pres.writeFile({ fileName: out }).then(f => console.log('wrote', f));
