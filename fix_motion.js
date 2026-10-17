const fs = require('fs');

// 1. Update public/index.html
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
  '<div data-exhibition="true" class="Exhibition-module__Q5YJhq__exhibition">',
  '<div data-exhibition="true" data-exhibition-motion="true" class="Exhibition-module__Q5YJhq__exhibition">'
);

html = html.replaceAll(
  '\"data-exhibition\":true,\"className\":\"Exhibition-module__Q5YJhq__exhibition\"',
  '\"data-exhibition\":true,\"data-exhibition-motion\":true,\"className\":\"Exhibition-module__Q5YJhq__exhibition\"'
);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Updated public/index.html with data-exhibition-motion="true"');

// 2. Update 0nvsl7zby200v.js chunks
const chunkFiles = [
  'public/_next/static/immutable/chunks/0nvsl7zby200v.js',
  'public/static/immutable/chunks/0nvsl7zby200v.js'
];

for (const file of chunkFiles) {
  let code = fs.readFileSync(file, 'utf8');

  // Prevent bailouts in Choreography
  code = code.replaceAll(
    'if("live"!==d)return;',
    '/* always run choreography */'
  );

  // Prevent cleanup from stripping exhibitionMotion or styles
  code = code.replaceAll(
    'delete e.dataset.exhibitionMotion',
    'e.dataset.exhibitionMotion="true"'
  );

  fs.writeFileSync(file, code, 'utf8');
  console.log('Updated Choreography in', file);
}
