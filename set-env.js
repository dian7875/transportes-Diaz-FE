const { writeFileSync } = require("fs");

const targetPath = "./src/environments/environment.prod.ts";

const envConfigFile = `
export const environment = {
  production: true,
  API_URL: '${process.env.API_URL}'
};
`;

console.log(process.env.API_URL);
writeFileSync(targetPath, envConfigFile);
console.log("✅ Archivo de entorno generado correctamente.");
