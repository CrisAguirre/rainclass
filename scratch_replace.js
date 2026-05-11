const fs = require('fs');
const file = 'c:/Users/USUARIO/Desktop/RA/rainclass/src/app/pages/laboratories/lab-evaluacion/lab-evaluacion.component.ts';
let content = fs.readFileSync(file, 'utf8');

// Rename array
content = content.replace('geoposicionQuestions: Question[] = [', 'visualizadorQuestions: Question[] = [');

// Find the index of question 11
const q11Index = content.indexOf('id: 11,');
const q10End = content.lastIndexOf('},', q11Index);

// Find the end of the array
const arrayEnd = content.indexOf('];', q11Index);

// Slice out the extra questions
content = content.substring(0, q10End + 1) + '\n  ];' + content.substring(arrayEnd + 2);

// Fix the mappings
content = content.replace("if (this.labId === '7') return this.geoposicionQuestions;", "if (this.labId === '6') return this.visualizadorQuestions;");

// Fix labNamás dictionary
content = content.replace(", '7': 'Modelo 3D con Geoposición'", "");

fs.writeFileSync(file, content);
console.log('Done');
