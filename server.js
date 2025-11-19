// server.js
import fs from "fs";
import readline from "readline";
import path from "path";

// === CONFIGURAR CONSOLA ===
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// === RUTAS BASE ===
const htmlPath = path.join(process.cwd(), "articulo.html");
const assetsDir = path.join(process.cwd(), "assets");
const outputDir = path.join(process.cwd(), "terminado");

// Crear carpeta "terminado" si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// === FUNCIÓN PARA CONVERTIR IMAGEN A BASE64 ===
function imageToBase64(imagePath) {
  const ext = path.extname(imagePath).substring(1); // "png", "jpg", etc.
  const mime = ext === "jpg" ? "jpeg" : ext;        // normalizar jpg → jpeg
  const data = fs.readFileSync(imagePath);
  return `data:image/${mime};base64,${data.toString("base64")}`;
}

// === PROCESO PRINCIPAL ===
rl.question("Ingrese el nombre del archivo (sin extensión): ", (fileName) => {
  const outputPath = path.join(outputDir, `${fileName}.html`);
  let htmlContent = fs.readFileSync(htmlPath, "utf8");

  // 1️⃣ Reemplazar SOLO el src="assets/..." por Base64
  //    Manteniendo intacto el resto del <img ...>
  const imgSrcRegex = /(<img[^>]*\s+src=["'])assets\/([^"']+)(["'][^>]*>)/gi;

  htmlContent = htmlContent.replace(
    imgSrcRegex,
    (fullMatch, prefix, imageName, suffix) => {
      const imagePath = path.join(assetsDir, imageName);

      if (!fs.existsSync(imagePath)) {
        console.warn(`⚠️ Imagen no encontrada: ${imageName}`);
        return fullMatch; // dejamos el tag como estaba
      }

      const base64Data = imageToBase64(imagePath);
      const newImgTag = `${prefix}${base64Data}${suffix}`;

      // Detectar si es imagen grande por el nombre del archivo
      const isBigImage = /(figura|grafica|tabla|chart|diagram|figure)/i.test(
        imageName
      );

      if (isBigImage) {
        console.log(`✅ Imagen grande centrada: ${imageName}`);
        // Marcamos para luego envolverla en un div centrado
        return `<!--BIGIMG_START-->${newImgTag}<!--BIGIMG_END-->`;
      } else {
        console.log(`📎 Imagen pequeña embebida: ${imageName}`);
        return newImgTag; // sin centrar
      }
    }
  );

  // 2️⃣ Envolver SOLO las imágenes grandes en un div centrado
  htmlContent = htmlContent.replace(
    /<!--BIGIMG_START-->([\s\S]*?)<!--BIGIMG_END-->/g,
    '<div style="text-align:center; margin:25px 0;">$1</div>'
  );

  // Guardar HTML final
  fs.writeFileSync(outputPath, htmlContent, "utf8");
  console.log(`\n🎉 HTML final generado en: ${outputPath}`);
  console.log(
    "📄 Imágenes grandes centradas; logos e imágenes pequeñas quedaron como en el HTML original."
  );

  rl.close();
});
