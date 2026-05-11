const fs = require('fs');
const path = 'c:/Users/USUARIO/Desktop/RA/rainclass/src/app/pages/laboratories';

function removeLab7Block(content) {
  // Finds <div *ngIf="labId === '7'" ...> ... </div>
  // where it stops at the next <div *ngIf="
  const regex = /<div \*ngIf="labId === '7'" class="lab-content">([\s\S]*?)<\/div>\s*(?=<div \*ngIf="!|<div \*ngIf="labId)/;
  return content.replace(regex, '');
}

function updateIncludes(content) {
  content = content.replace(/\['1', '2', '3', '4', '5', '6', '7'\]/g, "['1', '2', '3', '4', '5', '6']");
  content = content.replace(/\['1', '2', '3', '4', '5', '7'\]/g, "['1', '2', '3', '4', '5', '6']");
  return content;
}

const files = [
  '/lab-inicio/lab-inicio.component.html',
  '/lab-desarrollo/lab-desarrollo.component.html',
  '/lab-cierre/lab-cierre.component.html',
  '/lab-evaluacion/lab-evaluacion.component.html'
];

for (const file of files) {
  const fullPath = path + file;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = removeLab7Block(content);
  content = updateIncludes(content);
  fs.writeFileSync(fullPath, content);
}

// Update lab-layout.component.ts
const layoutPath = path + '/lab-layout/lab-layout.component.ts';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(/,?\s*'7':\s*\{\s*title:\s*'Modelo 3D con Geoposición',\s*link:\s*null\s*\}/g, '');
fs.writeFileSync(layoutPath, layoutContent);

console.log('Cleaned up HTML files and layout ts.');
