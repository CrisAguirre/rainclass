const fs = require('fs');
const path = require('path');

const replacements = {
    'Ã¡': 'á',
    'Ã©': 'é',
    '\u00C3\u00AD': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã‘': 'Ñ',
    'Ã¼': 'ü',
    'Â¿': '¿',
    'Â¡': '¡',
    'Ã ': 'Á',
    'Ã‰': 'É',
    '\u00C3\u008D': 'Í',
    'Ã“': 'Ó',
    'Ãš': 'Ú'
};

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.html') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('c:/Users/USUARIO/Desktop/RA/rainclass/src/app/pages/laboratories');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    for (const [bad, good] of Object.entries(replacements)) {
        if (content.includes(bad)) {
            content = content.split(bad).join(good);
            modified = true;
        }
    }
    
    // Also fix LabEvaluacionComponent class name and html tags just in case
    if (file.endsWith('lab-evaluacion.component.ts')) {
        if (content.includes('LabEvaluaciónComponent')) {
            content = content.replace(/LabEvaluaciónComponent/g, 'LabEvaluacionComponent');
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed ' + file);
    }
});
