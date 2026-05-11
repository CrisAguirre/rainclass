const fs = require('fs');

const file = 'src/app/pages/laboratories/lab-inicio/lab-inicio.component.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div class="section-title">\s*<h3>Los 3 Códigos QR por Asignatura<\/h3>[\s\S]*?<div class="usage-tag"[^>]*>RAINCLASS_LITERATURE_3D<\/div>\s*<\/div>\s*<\/div>/g;

const replacement = `<div class="section-title">
    <h3>Los 6 Códigos QR por Temática</h3>
    <div class="title-line"></div>
  </div>

  <div class="apps-grid">
    <div class="glass-panel app-card" style="text-align: center;">
      <div class="app-icon">📖</div>
      <h4>Lenguaje</h4>
      <p>Escanea este QR para visualizar un modelo interactivo del mundo de las palabras.</p>
      <img src="assets/images/labs/qr/qr_lenguaje.png" alt="QR Lenguaje"
        style="width: 150px; margin-top: 15px; border-radius: 10px;">
      <div class="usage-tag" style="margin-top: 10px;">RAINCLASS_LENGUAJE_3D</div>
    </div>

    <div class="glass-panel app-card" style="text-align: center;">
      <div class="app-icon">📐</div>
      <h4>Matemáticas</h4>
      <p>Escanea este QR para visualizar figuras geométricas y lógica espacial.</p>
      <img src="assets/images/labs/qr/qr_matematicas.png" alt="QR Matemáticas"
        style="width: 150px; margin-top: 15px; border-radius: 10px;">
      <div class="usage-tag" style="margin-top: 10px;">RAINCLASS_MATEMATICAS_3D</div>
    </div>

    <div class="glass-panel app-card" style="text-align: center;">
      <div class="app-icon">🫀</div>
      <h4>Ciencias Naturales</h4>
      <p>Escanea este QR para visualizar biología y anatomía interactiva.</p>
      <img src="assets/images/labs/qr/qr_ciencias.png" alt="QR Ciencias"
        style="width: 150px; margin-top: 15px; border-radius: 10px;">
      <div class="usage-tag" style="margin-top: 10px;">RAINCLASS_CIENCIAS_3D</div>
    </div>

    <div class="glass-panel app-card" style="text-align: center;">
      <div class="app-icon">🌍</div>
      <h4>Ciencias Sociales</h4>
      <p>Escanea este QR para visualizar geografía y civilizaciones.</p>
      <img src="assets/images/labs/qr/qr_sociales.png" alt="QR Sociales"
        style="width: 150px; margin-top: 15px; border-radius: 10px;">
      <div class="usage-tag" style="margin-top: 10px;">RAINCLASS_SOCIALES_3D</div>
    </div>

    <div class="glass-panel app-card" style="text-align: center;">
      <div class="app-icon">🗣️</div>
      <h4>Inglés</h4>
      <p>Escanea este QR para practicar vocabulario de forma interactiva.</p>
      <img src="assets/images/labs/qr/qr_ingles.png" alt="QR Inglés"
        style="width: 150px; margin-top: 15px; border-radius: 10px;">
      <div class="usage-tag" style="margin-top: 10px;">RAINCLASS_INGLES_3D</div>
    </div>

    <div class="glass-panel app-card" style="text-align: center;">
      <div class="app-icon">📚</div>
      <h4>Comprensión de lectura</h4>
      <p>Escanea este QR para visualizar un escenario sobre comprensión lectora.</p>
      <img src="assets/images/labs/qr/qr_comprension.png" alt="QR Comprensión de lectura"
        style="width: 150px; margin-top: 15px; border-radius: 10px;">
      <div class="usage-tag" style="margin-top: 10px;">RAINCLASS_COMPRENSION_3D</div>
    </div>
  </div>`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Replaced successfully!');
} else {
  console.log('Regex did not match.');
}
