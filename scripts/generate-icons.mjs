import sharp from "sharp";
import { writeFile } from "node:fs/promises";
for (const size of [192, 512]) await sharp("public/icon.svg").resize(size, size).png().toFile(`public/icon-${size}.png`);
const png = await sharp("public/icon.svg").resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4); header[6] = 32; header[7] = 32; header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
await writeFile("app/favicon.ico", Buffer.concat([header, png]));
console.log("Generated OrbitCare icons from the original SVG mark.");
