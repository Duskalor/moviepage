import { images } from './routes/images.js';
import express from 'express';
import { pageMoviesData } from './scrap/pageMoviesData.js';
import morgan from 'morgan';
import { db } from './config/express.js';
import { movieModel } from './model/movieModel.js';

const app = express();
app.use(morgan('common'));

pageMoviesData(10)
  .then((data) => {
    console.log('Scrap completo, agregando a la base de datos ');
    return movieModel.insertMany(data);
  })
  .finally(() => {
    console.log('Agregado correctamente a la base de datos ');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(images);

db().then(() => {
  // console.log('\nConexión con la BD');
  app.listen(9000, () => {
    // console.log('\nEscuchando desde el puerto 9000');
  });
});
