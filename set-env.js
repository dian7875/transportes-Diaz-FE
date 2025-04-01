const fs = require('fs');
const path = require('path');

console.log(process.env.API_URL)
const envFilePath = path.join(__dirname, 'src/environments/environment.prod.ts');

let content = `export const environment = {
  production: true,
  API_URL: '${process.env.API_URL}'
};`;
fs.writeFileSync(envFilePath, content);
console.log('Environment file created successfully');
