const fs = require('fs');

// Replace in HTML
const htmlFile = 'src/app/pages/laboratories/lab-inicio/lab-inicio.component.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf8');

const htmlOld = `<div class="floating-cube">
        <div class="cube-face front">QR</div>
        <div class="cube-face back"></div>
        <div class="cube-face right"></div>
        <div class="cube-face left"></div>
        <div class="cube-face top"></div>
        <div class="cube-face bottom"></div>
      </div>`;

const htmlNew = `<div class="iris-eye">
        <div class="iris-pupil"></div>
        <div class="iris-ring"></div>
        <div class="iris-lines"></div>
        <div class="iris-flare"></div>
      </div>`;

htmlContent = htmlContent.replace(htmlOld, htmlNew);
fs.writeFileSync(htmlFile, htmlContent, 'utf8');
console.log('Replaced HTML');

// Replace in CSS
const cssFile = 'src/app/pages/laboratories/lab-inicio/lab-inicio.component.css';
let cssContent = fs.readFileSync(cssFile, 'utf8');

const cssOld = `/* 3D Cube Animation */
.floating-cube {
  width: 160px;
  height: 160px;
  position: relative;
  transform-style: preserve-3d;
  animation: floatAndRotate 12s infinite linear;
}

.cube-face {
  position: absolute;
  width: 160px;
  height: 160px;
  background: rgba(0, 229, 255, 0.15);
  border: 2px solid rgba(0, 229, 255, 0.6);
  box-shadow: inset 0 0 30px rgba(0, 229, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--accent-color);
  backdrop-filter: blur(8px);
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
}

.front  { transform: translateZ(80px); }
.back   { transform: rotateY(180deg) translateZ(80px); }
.right  { transform: rotateY(90deg) translateZ(80px); }
.left   { transform: rotateY(-90deg) translateZ(80px); }
.top    { transform: rotateX(90deg) translateZ(80px); }
.bottom { transform: rotateX(-90deg) translateZ(80px); }

@keyframes floatAndRotate {
  0% { transform: rotateX(0deg) rotateY(0deg) translateY(0); }
  25% { transform: rotateX(90deg) rotateY(90deg) translateY(-25px); }
  50% { transform: rotateX(180deg) rotateY(180deg) translateY(0); }
  75% { transform: rotateX(270deg) rotateY(270deg) translateY(25px); }
  100% { transform: rotateX(360deg) rotateY(360deg) translateY(0); }
}`;

const cssNew = `/* Eye Iris Animation */
.iris-eye {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  position: relative;
  background: radial-gradient(circle at center, #010a15 0%, #00e5ff 30%, #005f73 70%, #010a15 100%);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.6), inset 0 0 40px rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  animation: irisPulse 4s infinite ease-in-out;
}

.iris-pupil {
  width: 40px;
  height: 40px;
  background: #000;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.9);
  z-index: 10;
  animation: pupilDilate 4s infinite ease-in-out;
}

.iris-ring {
  position: absolute;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  border: 2px dashed rgba(0, 229, 255, 0.5);
  animation: rotateRing 15s infinite linear;
}

.iris-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(
    from 0deg,
    transparent 0deg 4deg,
    rgba(0, 229, 255, 0.2) 4deg 8deg
  );
  border-radius: 50%;
  animation: rotateRing 25s infinite linear reverse;
}

.iris-flare {
  position: absolute;
  width: 25px;
  height: 25px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  top: 25%;
  left: 25%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  filter: blur(2px);
}

@keyframes irisPulse {
  0%, 100% { box-shadow: 0 0 30px rgba(0, 229, 255, 0.6), inset 0 0 40px rgba(0, 0, 0, 0.8); }
  50% { box-shadow: 0 0 50px rgba(0, 229, 255, 0.9), inset 0 0 60px rgba(0, 0, 0, 0.9); }
}

@keyframes pupilDilate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

@keyframes rotateRing {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

cssContent = cssContent.replace(cssOld, cssNew);
fs.writeFileSync(cssFile, cssContent, 'utf8');
console.log('Replaced CSS');
