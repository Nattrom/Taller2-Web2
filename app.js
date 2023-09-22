const express = require('express');
const fs = require('fs');
const app = express();
const port = 7000;

// Middleware para archivos estáticos en la carpeta 'public'
app.use(express.static('public'));

// Middleware para parsear el cuerpo de las solicitudes POST
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/formulario');
});

// Ruta para mostrar el formulario HTML
app.get('/formulario', (req, res) => {
  res.sendFile(__dirname + '/public/form.html');
});

// Ruta para procesar el formulario y crear un préstamo
app.post('/prestamo', (req, res) => {
  const { id, nombre, apellido, titulo, autor, editorial, año } = req.body;

  // Verifica si todos los campos están completos
  if (!id || !nombre || !apellido || !titulo || !autor || !editorial || !año) {
    return res.redirect('/error');
  }

  // Crea el archivo de préstamo en el directorio 'data'
  const contenido = `${id}, ${nombre}, ${apellido}, ${titulo}, ${autor}, ${editorial}, ${año}`;
  const archivoNombre = `data/id_${id}.txt`;

  fs.writeFile(archivoNombre, contenido, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error interno del servidor.');
    }

    // Redirige al usuario a una página de éxito
    res.redirect('/exito');
  });
});

// Ruta para mostrar una página de éxito después de crear un préstamo
app.get('/exito', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Éxito</title>
        <!-- Agrega el enlace a Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-5">
            <h1 class="display-4">Préstamo creado con éxito</h1>
            <p>Tu préstamo ha sido registrado con éxito.</p>
            <a href="/formulario" class="btn btn-primary">Volver al formulario</a>
        </div>

        <!-- Agrega el enlace a Bootstrap JS (opcional, si lo necesitas) -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
    </body>
    </html>
  `);
});

// Ruta para mostrar una página de error
app.get('/error', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Error</title>
        <!-- Agrega el enlace a Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-5">
            <h1 class="display-4">Error</h1>
            <p>Se produjo un error. Por favor, complete todos los campos del formulario.</p>
            <a href="/formulario" class="btn btn-primary">Volver al formulario</a>
        </div>

        <!-- Agrega el enlace a Bootstrap JS (opcional, si lo necesitas) -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
    </body>
    </html>
  `);
});

// Ruta para descargar un archivo de préstamo
app.get('/descargar/:id', (req, res) => {
  const id = req.params.id;
  const archivoNombre = `data/id_${id}.txt`;

  // Verifica si el archivo existe y lo envía para su descarga
  if (fs.existsSync(archivoNombre)) {
    res.download(archivoNombre, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al descargar el archivo.');
      }
    });
  } else {
    res.status(404).send('El archivo no existe.');
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
