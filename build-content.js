// build-content.js
const fs = require('fs-extra');
const matter = require('gray-matter');
const path = require('path');

function processContent(contentType) {
  const dir = path.join(__dirname, 'content', contentType);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(file => file.endsWith('.md'));
  const items = files.map(file => {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      ...data,
      body: content,
      slug: file.replace(/\.md$/, "")
    };
  });

  fs.ensureDirSync(path.join(__dirname, 'content-json'));
  fs.writeJsonSync(
    path.join(__dirname, 'content-json', `${contentType}.json`),
    items,
    { spaces: 2 }
  );
  console.log(`✔ Processed ${items.length} ${contentType}`);
}

processContent('publications');
processContent('essays');
