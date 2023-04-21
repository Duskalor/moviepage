import axios from 'axios';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { getDescription } from './getDescription.js';
import { getYear } from './getYear.js';
import cliProgress from 'cli-progress';
const URL = 'https://www.megapeliculasrip.net/tag/pelicula/page';

//carpeta de destino
// const carpet = 'test';
const carpet = 'Imagenes';
//ruta de destino
const routePath = `${process.cwd()}/${carpet}`;
// desde q pagina se comienza

export const pageMoviesData = async (limitPage) => {
  console.log(
    `Realizando Scrapping a la pagina con URl ${URL},a la cantidad de ${limitPage} paginas`
  );
  // Barra de Cargar
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  let initialPage = 0;
  progressBar.start(limitPage, initialPage);
  //All project
  let Allmovies = [];
  // abriendo el navegador / abriendo una pestaña / aplicando resolución al navegador
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  // bucle para descargar de cada pagina
  while (initialPage < limitPage) {
    initialPage++;
    // console.log('page number : ' + initialPage);
    await page.goto(`${URL}/${initialPage}/`);
    await page.waitForSelector('#contenido');
    const Alldata = await page.$$('.pelicula');

    for (const data of Alldata) {
      const linkPage = await data.$('.poster a');
      const linkImg = await data.$('.poster a img');
      const linkName = await data.$('.sinopsis h3');

      const link = await page.evaluate((l) => l.getAttribute('href'), linkPage);
      const urlImg = await page.evaluate((l) => l.getAttribute('src'), linkImg);
      const name = await page.evaluate((l) => l.innerHTML, linkName);

      const nameNormalize = name
        .split(' [1080p]')
        .shift()
        .replace(/[:¿?]/g, '')
        .replace(/ /g, '-')
        .replace(/\//, '-');

      const page2 = await browser.newPage();
      await page2.goto(link);
      await page2.waitForSelector('#mmedia');
      const movieData = await page2.$$('p');

      let RawdescriptionPage = '';

      for (const movie of movieData) {
        const pa = await movie.evaluate((i) => i.innerHTML);
        RawdescriptionPage += pa;
      }

      const description = getDescription(RawdescriptionPage);
      const year = getYear(RawdescriptionPage);

      await page2.close();

      axios({
        method: 'get',
        url: urlImg,
        responseType: 'stream',
      }).then((response) => {
        return response.data.pipe(
          fs.createWriteStream(`${routePath}/${nameNormalize}.jpg`)
        );
      });

      Allmovies.push({
        title: name,
        img: `http://localhost:9000/images/${nameNormalize}.jpg`,
        description,
        year,
      });
    }
    progressBar.update(initialPage);
  }
  //console.log('Closing pages and browser');
  progressBar.stop();
  await page.close();
  await browser.close();
  return Allmovies;
};
