# 🚛 Transportes Diaz Frontend

**Frontend de la plataforma de gestión para Transportes Diaz**, desarrollada con [Angular](https://angular.dev/). Esta aplicación permite administrar eficientemente:

- Conductores 👨‍✈️  
- Camiones 🚚  
- Viajes 📍  
- Gastos 💰  
- Facturas 🧾  
- Clientes 🧍  
- Informes 📊  

> El objetivo es ofrecer una interfaz moderna, rápida y fácil de usar para facilitar la operación diaria del negocio de transporte.

---

## 📦 Backend

El backend de esta aplicación se encuentra en un repositorio separado:  
🔗 [Transportes Diaz Backend](https://github.com/dian7875/transportes-diaz.git)

---

## ⚙️ Instalación y ejecución local

Sigue estos pasos para ejecutar la aplicación en modo desarrollo:

```bash
# 1. Clona el repositorio
git clone https://github.com/dian7875/transportes-diaz-frontend.git
cd transportes-diaz-frontend

# 2. Instala las dependencias
npm install

# 3. Inicia el servidor de desarrollo
ng serve
```

Luego abre tu navegador en:  
🔗 [http://localhost:4200](http://localhost:4200)

La aplicación se recargará automáticamente al realizar cambios en el código.

---

## 🏗️ Construcción para producción

Para generar los archivos optimizados para producción:

```bash
ng build
```

Los archivos compilados estarán en el directorio: `dist/`.

---

## 🐳 Uso con Docker

Este proyecto incluye un `Dockerfile` para construir y servir la aplicación desde un contenedor.

### Construcción de la imagen

```bash
docker build -t transportes-diaz-fe .
```

### Ejecución del contenedor

```bash
docker run -p 3000:3000 transportes-diaz-fe
```

Accede a la aplicación desde:  
🔗 [http://localhost:3000](http://localhost:3000)

---

## 📚 Recursos adicionales

- [Angular CLI Overview & Reference](https://angular.dev/tools/cli)

---

## 🧑‍💻 Autor

Desarrollado por [Adrian Aguilar Diaz](mailto:adrian.a.d7875@gmail.com)  
📍 Nicoya, Guanacaste, Costa Rica
