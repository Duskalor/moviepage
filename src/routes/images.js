import { Router } from 'express';

const images = Router();

images.get('/images/:imageName', function (req, res) {
  var imageName = req.params.imageName;
  const carpet = 'Imagenes';
  const routePath = `${process.cwd()}/${carpet}`;
  const imagePath = `${routePath}/${imageName}`;
  res.sendFile(imagePath);
});

export { images };
