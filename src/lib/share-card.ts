/**
 * Genera una tarjeta vertical (1080x1920, formato historia de Instagram)
 * con el resultado del reto, para compartir o descargar.
 */

export async function buildStoryCard(input: {
  programName: string;
  affinity: number;
  tagline: string;
}): Promise<Blob> {
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");

  const darkGreen = "#1E3B1B";
  const green = "#5B8C3A";
  const lime = "#84BD00";
  const light = "#F7F8F4";

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, darkGreen);
  gradient.addColorStop(0.55, green);
  gradient.addColorStop(1, darkGreen);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(132, 189, 0, 0.18)";
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.12, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";

  ctx.fillStyle = lime;
  ctx.font = "600 44px Poppins, sans-serif";
  ctx.fillText("SEMANA CUN", width / 2, 240);

  ctx.fillStyle = light;
  ctx.font = "600 60px Poppins, sans-serif";
  ctx.fillText("Mi especialización es", width / 2, 400);

  // Nombre del programa, en varias líneas
  const words = input.programName.replace("Especialización en ", "").split(" ");
  const lines: string[] = [];
  let line = "";
  ctx.font = "700 84px Poppins, sans-serif";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > width - 160 && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);

  ctx.fillStyle = lime;
  lines.forEach((text, index) => {
    ctx.fillText(text, width / 2, 560 + index * 100);
  });

  const afterTitle = 560 + lines.length * 100;

  // Círculo de afinidad
  const cx = width / 2;
  const cy = afterTitle + 260;
  ctx.lineWidth = 26;
  ctx.strokeStyle = "rgba(247, 248, 244, 0.22)";
  ctx.beginPath();
  ctx.arc(cx, cy, 180, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = lime;
  ctx.beginPath();
  ctx.arc(cx, cy, 180, -Math.PI / 2, -Math.PI / 2 + (input.affinity / 100) * Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = light;
  ctx.font = "700 120px Poppins, sans-serif";
  ctx.fillText(`${input.affinity}%`, cx, cy + 40);
  ctx.font = "500 40px Poppins, sans-serif";
  ctx.fillText("de afinidad", cx, cy + 100);

  // Tagline
  ctx.fillStyle = "rgba(247, 248, 244, 0.9)";
  ctx.font = "400 42px Poppins, sans-serif";
  const taglineWords = input.tagline.split(" ");
  const taglineLines: string[] = [];
  let taglineLine = "";
  taglineWords.forEach((word) => {
    const candidate = taglineLine ? `${taglineLine} ${word}` : word;
    if (ctx.measureText(candidate).width > width - 200 && taglineLine) {
      taglineLines.push(taglineLine);
      taglineLine = word;
    } else {
      taglineLine = candidate;
    }
  });
  if (taglineLine) taglineLines.push(taglineLine);
  taglineLines.forEach((text, index) => {
    ctx.fillText(text, cx, cy + 300 + index * 56);
  });

  ctx.fillStyle = lime;
  ctx.font = "600 46px Poppins, sans-serif";
  ctx.fillText("Descubre la tuya", cx, height - 200);
  ctx.fillStyle = "rgba(247, 248, 244, 0.75)";
  ctx.font = "400 36px Poppins, sans-serif";
  ctx.fillText("Reto Semana CUN · Posgrados", cx, height - 140);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo generar la imagen"));
    }, "image/png");
  });
}
