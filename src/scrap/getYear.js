export const getYear = (RawdescriptionPage) => {
  const data = RawdescriptionPage.split('Año:')
    .pop()
    .split('<br>\n')
    .shift()
    .split(' ')
    .pop();

  if (data.includes(';')) {
    return data.split(';').pop().includes('>')
      ? data.split(';').pop().split('>').pop().split('<').shift()
      : data.split(';').pop();
  }

  ('</strong>2014<strong>');
  return data;
};
