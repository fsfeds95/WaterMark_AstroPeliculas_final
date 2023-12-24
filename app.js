// Importar las bibliotecas requeridas
const express = require('express');
const Jimp = require('jimp');

// Crea una aplicación en Express
const app = express();
const port = 8225;

// Middleware para procesar datos JSON
app.use(express.json());

// Ruta "/p"
app.get('/p', async (req, res) => {
  const url = req.query.url;

  // Verificar si se suministró un enlace
  if (!url) {
    return res.status(400).json({ error: 'No se proporcionó un enlace' });
  }

  try {
    // Cargar la imagen desde el enlace
    const image = await Jimp.read(url);

    // Redimensionar la imagen a 720x1080
    image.resize(720, 1080);

    // Cargar la marca de agua
    const watermark = await Jimp.read('wm-poster_v2.png');

    // Escala la marca de agua a 720px de ancho por 1080px de alto
    watermark.resize(720, 1080);

    // Establece la opacidad de la marca de agua en 0,25
    watermark.opacity(0.25);

    // Aplicar la marca de agua a la imagen
    image.composite(watermark, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Guardar la imagen en formato JPEG con calidad al 95%
    image.quality(95).write('p.bin');

    // Enviar la imagen como respuesta
    image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
      if (err) {
        return res.status(500).json({ error: 'Error al generar la imagen' });
      }
      res.header('Content-Type', 'image/jpeg');
      res.send(buffer);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

// Ruta "/b"
app.get('/b', async (req, res) => {
  const url = req.query.url;

  // Verificar si se suministró un enlace
  if (!url) {
    return res.status(400).json({ error: 'No se proporcionó un enlace' });
  }

  try {
    // Cargar la imagen desde el enlace
    const image = await Jimp.read(url);

    // Redimensionar la imagen a 1280x720
    image.resize(1280, 720);

    // Cargar las marcas de agua
    const watermark1 = await Jimp.read('Wtxt-Backdrop.png');
    const watermark2 = await Jimp.read('Wlogo-Backdrop.png');

    // Escala la marca de agua a 1280px de ancho por 720px de alto
    watermark1.resize(1280, 720);
    watermark2.resize(1280, 720);

    // Establece la opacidad de la watermark1 a 0.375 y watermark2 a 0.75
    watermark1.opacity(0.375);
    watermark2.opacity(0.75);

    // Combinar las marcas de agua en una sola imagen
    watermark1.composite(watermark2, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Aplicar la marca de agua a la imagen
    image.composite(watermark1, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 1.0,
      opacityDest: 1.0
    });

    // Guardar la imagen en formato JPEG con calidad al 95%
    image.quality(95).write('backdrop.bin');

    // Enviar la imagen como respuesta
    image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
      if (err) {
        return res.status(500).json({ error: 'Error al generar la imagen' });
      }
      res.header('Content-Type', 'image/jpeg');
      res.send(buffer);
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

// Iniciar el servidor en el puerto 8225
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});