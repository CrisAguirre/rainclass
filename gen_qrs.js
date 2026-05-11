const QRCode = require('qrcode');
const path = require('path');

const qrs = [
  { file: 'qr_lenguaje.png', text: 'RAINCLASS_LENGUAJE_3D' },
  { file: 'qr_matematicas.png', text: 'RAINCLASS_MATEMATICAS_3D' },
  { file: 'qr_ciencias.png', text: 'RAINCLASS_CIENCIAS_3D' },
  { file: 'qr_sociales.png', text: 'RAINCLASS_SOCIALES_3D' },
  { file: 'qr_ingles.png', text: 'RAINCLASS_INGLES_3D' },
  { file: 'qr_comprension.png', text: 'RAINCLASS_COMPRENSION_3D' },
];

const destFolder = path.join(__dirname, 'src/assets/images/labs/qr');

qrs.forEach(qr => {
  const filePath = path.join(destFolder, qr.file);
  QRCode.toFile(filePath, qr.text, {
    color: {
      dark: '#000000',
      light: '#ffffff'
    },
    width: 300,
    margin: 2
  }, function (err) {
    if (err) throw err;
    console.log('Generado', qr.file);
  });
});
