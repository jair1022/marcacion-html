# Marcación HTML – Conversor y Organización de Archivos

Este proyecto permite convertir archivos HTML generados desde PDF y organizarlos dentro de una estructura más limpia para su uso en publicaciones digitales, como artículos o contenido web.

## 📌 Características principales
- Mueve automáticamente los archivos HTML generados a la carpeta **terminado/**
- Copia también las imágenes y recursos necesarios desde la carpeta **assets/**
- Mantiene la estructura visual del documento original
- Asegura que las imágenes se conserven correctamente en la conversión
- Simplifica el flujo de trabajo para proyectos como Mundo FESC

## 📁 Estructura del proyecto


├── assets/ # Imágenes y archivos relacionados
├── terminado/ # Archivos HTML ya procesados
├── articulo.html # Archivo HTML original
└── server.js # Script principal de procesamiento



## ▶️ Cómo ejecutar
1. Asegúrate de tener **Node.js** instalado.
2. Ejecuta el script:
```bash
node server.js
