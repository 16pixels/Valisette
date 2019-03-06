// import penthouse from 'penthouse';
// import fs from 'fs';
// import * as assets from './../public/mix-manifest.json';
// penthouse({
//   url: 'https://ogilvy.preprod',
//   css: `public${assets["/main.css"]}`,
//   minify: true
// })
// .then(criticalCss => {
//   // use the critical css
//   fs.writeFileSync('public/css/critical.css', criticalCss);
//   fs.writeFileSync('resources/views/partials/inline-css.blade.php', criticalCss);
// })