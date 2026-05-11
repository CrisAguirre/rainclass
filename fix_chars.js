const fs = require('fs');
const path = require('path');

const files = [
  'src/app/pages/laboratories/lab-inicio/lab-inicio.component.html',
  'src/app/pages/laboratories/lab-desarrollo/lab-desarrollo.component.html',
  'src/app/pages/laboratories/lab-cierre/lab-cierre.component.html',
  'src/app/pages/laboratories/lab-evaluacion/lab-evaluacion.component.html'
];

const replacements = [
  { search: /qué©/g, replace: 'que' },
  { search: /mástrará/g, replace: 'mostrará' },
  { search: /Demástrar/g, replace: 'Demostrar' },
  { search: /enriquécer/g, replace: 'enriquecer' },
  { search: /escuála/g, replace: 'escuela' },
  { search: /equépos/g, replace: 'equipos' },
  { search: /máquéna/g, replace: 'máquina' },
  { search: /informás/g, replace: 'informes' },
  { search: /arquétecto/g, replace: 'arquitecto' },
  { search: /búsquéda/g, replace: 'búsqueda' },
  { search: /desbloquéan/g, replace: 'desbloquean' },
  { search: /desbloquéar/g, replace: 'desbloquear' },
  { search: /cuálquéer/g, replace: 'cualquier' },
  { search: /Ãúnico/g, replace: 'único' },
  { search: /Ãrea/g, replace: 'Área' },
  { search: /Ã©/g, replace: 'é' },
  { search: /equépo/g, replace: 'equipo' },
  { search: /qué /g, replace: 'que ' }, // be careful with this, but 'que ' is common and ¿qué? has a ? mark after or similar. We will just do a check.
  { search: /qué /g, replace: 'que ' },
  { search: /qué-/g, replace: 'que-' },
  { search: /qué,/g, replace: 'que,' },
  { search: /misiónes/g, replace: 'misiones' },
  { search: /másiones/g, replace: 'misiones' },
  { search: /másión/g, replace: 'misión' },
  { search: /qué­micas/g, replace: 'químicas' },
  { search: /másmás/g, replace: 'mismas' },
  { search: /aqué­/g, replace: 'aquí' },
  // specific context replacements for "qué" when it's wrong:
  { search: /qué los/g, replace: 'que los' },
  { search: /qué el/g, replace: 'que el' },
  { search: /qué un/g, replace: 'que un' },
  { search: /qué la/g, replace: 'que la' },
  { search: /qué se/g, replace: 'que se' },
  { search: /qué su/g, replace: 'que su' },
  { search: /qué no/g, replace: 'que no' },
  { search: /qué combinan/g, replace: 'que combinan' },
  { search: /qué permite/g, replace: 'que permite' },
  { search: /qué hacen/g, replace: 'que hacen' },
  { search: /qué capturan/g, replace: 'que capturan' },
  { search: /qué activarán/g, replace: 'que activarán' },
  { search: /sino qué/g, replace: 'sino que' },
  { search: /ya qué/g, replace: 'ya que' },
  { search: /para qué/g, replace: 'para que' },
  { search: /por qué©/g, replace: 'por qué' },
  { search: /¿Qué es/g, replace: '¿Qué es' }, // Keep this correct
  // Corrupted Emojis
  { search: /ðŸ“ /g, replace: '📐' },
  { search: /ðŸ”¬/g, replace: '🔬' },
  { search: /ðŸ“–/g, replace: '📖' },
  { search: /âž”/g, replace: '➔' },
  { search: /ðŸ’¡/g, replace: '💡' },
  { search: /ðŸ“ /g, replace: '📍' },
  { search: /ðŸ“¸/g, replace: '📸' },
  { search: /â„¹ï¸ /g, replace: 'ℹ️' },
  { search: /ðŸ”²/g, replace: '🔲' },
  { search: /ðŸ †/g, replace: '🏆' },
  { search: /ðŸ ƒ/g, replace: '🏃' },
  { search: /ðŸ¤ /g, replace: '🤝' },
  { search: /ðŸ“Š/g, replace: '📊' },
  { search: /ðŸ ›ï¸ /g, replace: '🏛️' },
  { search: /ðŸŒ¿/g, replace: '🌿' },
  { search: /ðŸŽ“/g, replace: '🎓' },
  { search: /ðŸ§ /g, replace: '🧠' },
  { search: /ðŸ“‹/g, replace: '📋' },
  { search: /ðŸŽ¨/g, replace: '🎨' },
  { search: /ðŸ’œ/g, replace: '💜' },
  { search: /ðŸ«€/g, replace: '🫀' },
  { search: /ðŸŒŽ/g, replace: '🌍' },
  { search: /âš—ï¸ /g, replace: '⚖️' },
  { search: /ðŸ—£ï¸ /g, replace: '🗣️' },
  { search: /ðŸ”€/g, replace: '🔀' },
  { search: /ðŸ– ï¸ /g, replace: '🖐️' },
  { search: /ðŸ”Š/g, replace: '🔊' },
  { search: /ðŸ§©/g, replace: '🧩' },
  { search: /ðŸŽ¯/g, replace: '🎯' },
  { search: /ðŸ¥½/g, replace: '⏱️' },
  { search: /ðŸ’¬/g, replace: '💬' },
  { search: /â “/g, replace: '❓' },
  { search: /âœ¨/g, replace: '✨' },
  { search: /ðŸ” /g, replace: '🔍' },
  { search: /ðŸ“¡/g, replace: '📡' },
  { search: /ðŸ§ /g, replace: '🧠' }
];

files.forEach(f => {
  const fullPath = path.join('c:/Users/USUARIO/Desktop/RA/rainclass', f);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    replacements.forEach(r => {
      content = content.replace(r.search, r.replace);
    });
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed', f);
  }
});
