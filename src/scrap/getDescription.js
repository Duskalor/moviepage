// Obteniendo la description
const optionsP = {
  ['Otros Titulos']: (des) => des.split('<strong>Otros Titulos'),
  ['Otro Titulo']: (des) => des.split('<strong>Otro Titulo'),
  ['Titulo Original']: (des) => des.split('<strong>Titulo Original'),
  ['Titulo']: (des) => des.split('<strong>Titulo'),
};
const optionsImg = {
  ['"448">']: (des) => des.split('"448">'),
  ['2px">']: (des) => des.split('2px">'),
};
export const getDescription = (description) => {
  let descriptionPage = '';

  for (const key in optionsP) {
    if (description.includes(key)) {
      const valor = optionsP[key];
      descriptionPage = valor(description).shift();
      break;
    }
  }
  for (const key in optionsImg) {
    if (description.includes(key)) {
      const valor = optionsImg[key];
      descriptionPage = valor(descriptionPage).pop();
      break;
    }
  }
  return descriptionPage;
};
