const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const SECTIONS_DIR = path.join(BASE_DIR, 'sections');
const PREVIEWS_DIR = path.join(BASE_DIR, 'previews');
const TEMPLATE_FILE = path.join(BASE_DIR, 'template.html');
const OUTPUT_INDEX = path.join(BASE_DIR, 'index.html');
const ROOT_INDEX = path.join(BASE_DIR, '..', 'index.html');

// Registry of sections in chronological page order
const SECTIONS = [
  { file: '01-hero.html', id: 'hero', num: '01', title: 'Hero' },
  { file: '02-trust.html', id: 'trust', num: '02', title: 'Trust & Proof' },
  { file: '03-problem.html', id: 'problem', num: '03', title: 'Problem' },
  { file: '04-services.html', id: 'services', num: '04', title: 'Services' },
  { file: '05-dev.html', id: 'development', num: '05', title: 'Development & Plugins' },
  { file: '06-integrations.html', id: 'integrations', num: '06', title: 'Integrations' },
  { file: '07-seo.html', id: 'seo', num: '07', title: 'SEO & Core Vitals' },
  { file: '08-geo.html', id: 'geo', num: '08', title: 'GEO Optimization' },
  { file: '10-growth.html', id: 'growth', num: '10', title: 'Growth & Ads' },
  { file: '12-process.html', id: 'how-we-work', num: '12', title: 'Process' },
  { file: '13-results.html', id: 'results', num: '13', title: 'Results' },
  { file: '14-formats.html', id: 'formats', num: '14', title: 'Formats & Pricing' },
  { file: '15-faq.html', id: 'faq', num: '15', title: 'FAQ' },
  { file: '16-articles.html', id: 'articles', num: '16', title: 'Articles Slider' }
];

function build() {
  if (!fs.existsSync(SECTIONS_DIR)) {
    console.error('Sections directory not found:', SECTIONS_DIR);
    return;
  }
  if (!fs.existsSync(PREVIEWS_DIR)) {
    fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
  }

  // 1. Read layout template
  let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

  // 2. Read all sections
  const sectionContents = [];
  SECTIONS.forEach(sec => {
    const secPath = path.join(SECTIONS_DIR, sec.file);
    if (fs.existsSync(secPath)) {
      sectionContents.push(fs.readFileSync(secPath, 'utf8').trim());
    } else {
      console.warn(`Warning: Section file not found: ${sec.file}`);
    }
  });

  // 3. Assemble main index.html (sections retain standard root-relative asset paths: img/...)
  const placeholderRegex = /<!-- ==================== SECTIONS_START ==================== -->[\s\S]*?<!-- ==================== SECTIONS_END ==================== -->/;
  const assembledSections = `<!-- ==================== SECTIONS_START ==================== -->\n\n` +
    sectionContents.join('\n\n') +
    `\n\n    <!-- ==================== SECTIONS_END ==================== -->`;

  const finalIndexHtml = template.replace(placeholderRegex, assembledSections);
  fs.writeFileSync(OUTPUT_INDEX, finalIndexHtml, 'utf8');
  console.log(`[build] Successfully assembled ${OUTPUT_INDEX} (${SECTIONS.length} sections)`);

  // 4. Generate standalone preview files for each section with adjusted asset paths
  generatePreviews(template);

  // 5. Ensure root redirect index.html exists for GitHub Pages repo root
  generateRootRedirect();
}

function generatePreviews(template) {
  // Extract head content from template and adjust relative paths for previews (located in /previews/)
  const headMatch = template.match(/<head>([\s\S]*?)<\/head>/i);
  let headContent = headMatch ? headMatch[1] : '';

  // Adjust relative paths from previews/ to parent:
  headContent = headContent
    .replace(/href="css\//g, 'href="../css/')
    .replace(/src="js\//g, 'src="../js/')
    .replace(/src="img\//g, 'src="../img/');

  // Extract scripts from end of template
  const scriptsMatch = template.match(/(<!-- GSAP[\s\S]*?<\/body>)/i);
  let scriptsContent = scriptsMatch ? scriptsMatch[1].replace('</body>', '') : '';
  scriptsContent = scriptsContent
    .replace(/src="js\//g, 'src="../js/')
    .replace(/src="img\//g, 'src="../img/');

  SECTIONS.forEach((sec, idx) => {
    const secPath = path.join(SECTIONS_DIR, sec.file);
    if (!fs.existsSync(secPath)) return;
    const rawSectionHtml = fs.readFileSync(secPath, 'utf8').trim();

    // Fix image and asset paths in section HTML so previews load them from ../img/
    const sectionHtmlForPreview = rawSectionHtml
      .replace(/\bsrc=["'](?:\.\/)?img\//gi, 'src="../img/')
      .replace(/\bhref=["'](?:\.\/)?img\//gi, 'href="../img/')
      .replace(/\bsrcset=["'](?:\.\/)?img\//gi, 'srcset="../img/')
      .replace(/\bdata-src=["'](?:\.\/)?img\//gi, 'data-src="../img/')
      .replace(/url\((['"]?)(?:\.\/)?img\//gi, 'url($1../img/');

    const prevSec = idx > 0 ? SECTIONS[idx - 1] : null;
    const nextSec = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;

    // Build select dropdown options
    const optionsHtml = SECTIONS.map(s => {
      const selected = s.file === sec.file ? ' selected' : '';
      return `<option value="${s.file}"${selected}>Section ${s.num}: ${s.title}</option>`;
    }).join('');

    // Floating navigation toolbar for preview
    const previewNavToolbar = `
    <!-- Standalone Section Preview Toolbar -->
    <div style="position: sticky; top: 0; z-index: 999999; background: #111111; border-bottom: 1px dashed #2A2A2A; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; font-family: 'Inter', -apple-system, sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.6);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <a href="../index.html" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #000000; border: 1px solid #2A2A2A; border-radius: 8px; color: #F0F0F0; text-decoration: none; font-size: 13px; font-weight: 500; transition: border-color 0.2s;" onmouseover="this.style.borderColor='#F0F0F0'" onmouseout="this.style.borderColor='#2A2A2A'">
          ← All Sections (index.html)
        </a>
        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: #000000; border: 1px dashed #2A2A2A; border-radius: 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: #A0A0A0; text-transform: uppercase;">
          PREVIEW MODE &bull; SEC ${sec.num}
        </span>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        ${prevSec ? `<a href="${prevSec.file}" style="padding: 6px 12px; background: #000000; border: 1px solid #2A2A2A; border-radius: 8px; color: #F0F0F0; text-decoration: none; font-size: 13px;" title="Previous: ${prevSec.title}">← Prev</a>` : `<span style="padding: 6px 12px; border: 1px solid #1a1a1a; border-radius: 8px; color: #555555; font-size: 13px; cursor: not-allowed;">← Prev</span>`}
        
        <select onchange="window.location.href=this.value" style="background: #000000; color: #F0F0F0; border: 1px solid #2A2A2A; border-radius: 8px; padding: 6px 12px; font-size: 13px; font-family: inherit; outline: none; cursor: pointer;">
          ${optionsHtml}
        </select>

        ${nextSec ? `<a href="${nextSec.file}" style="padding: 6px 12px; background: #000000; border: 1px solid #2A2A2A; border-radius: 8px; color: #F0F0F0; text-decoration: none; font-size: 13px;" title="Next: ${nextSec.title}">Next →</a>` : `<span style="padding: 6px 12px; border: 1px solid #1a1a1a; border-radius: 8px; color: #555555; font-size: 13px; cursor: not-allowed;">Next →</span>`}
      </div>
    </div>
    `;

    const previewPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Section ${sec.num}: ${sec.title} &mdash; Preview</title>
  ${headContent}
</head>
<body class="bg-[#000000] text-[#F0F0F0] selection:bg-[#F0F0F0] selection:text-black">
  ${previewNavToolbar}
  <main>
    ${sectionHtmlForPreview}
  </main>
  ${scriptsContent}
</body>
</html>`;

    const previewFilePath = path.join(PREVIEWS_DIR, sec.file);
    fs.writeFileSync(previewFilePath, previewPage, 'utf8');
  });

  console.log(`[build] Successfully generated ${SECTIONS.length} preview pages in ${PREVIEWS_DIR} with adjusted assets`);
}

function generateRootRedirect() {
  const rootIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=html-dev/index.html">
  <title>Docs Dev Landing</title>
  <script>window.location.href = "html-dev/index.html";</script>
</head>
<body style="background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
  <p>Redirecting to <a href="html-dev/index.html" style="color: #fff;">Docs Dev Landing</a>...</p>
</body>
</html>
`;
  try {
    fs.writeFileSync(ROOT_INDEX, rootIndexHtml, 'utf8');
  } catch (err) {
    console.warn(`[build] Could not write root redirect:`, err.message);
  }
}

module.exports = { build, SECTIONS };

if (require.main === module) {
  build();
}
