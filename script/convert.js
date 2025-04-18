import fs from 'fs';
import path from 'path';

// Cambia aquí a '.' para la raíz del proyecto
const targetDir = '.';

function processFile(filePath) {
  if (!filePath.endsWith('.js')) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Reemplazar require por import
  content = content.replace(
    /const (.+?) = require\(['"](.+?)['"]\);?/g,
    "import $1 from '$2';"
  );

  // Reemplazar module.exports por export default
  content = content.replace(/module\.exports\s*=\s*/, 'export default ');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Convertido: ${filePath}`);
}

function processDir(dirPath) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      processDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

// Iniciar conversión desde la raíz
processDir(targetDir);
