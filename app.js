import express from 'express';
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

// mock data
const cats = [
  {
    cat_id: 1,
    name: 'Miukuuuuuu',
    birthdate: '2026-10-10',
    weight: 78,
    owner: 'Matti',
    image: 'https://placecats.com/310/240',
  },
  {
    cat_id: 2,
    name: 'Kisu',
    birthdate: '2023-10-08',
    weight: 6,
    owner: 'Ulla',
    image: 'https://placecats.com/320/240',
  },
  {
    cat_id: 3,
    name: 'Misu',
    birthdate: '2021-11-18',
    weight: 7,
    owner: 'Ulla',
    image: 'https://placecats.com320/240',
  },
];

app.use(express.static('public'));
// app.use('/images', express.static('public'));

// needed for reading request body in JSON format
app.use(express.json());

// käynnistään HTTP- palvelimen kuuntelemaan porttia
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// express kutsuu reitin callback-funktiota
// req sisältää pyyntöä koskevat tiedot ja res vastaustoiminnot
app.get('/kissa', (req, res) => {
  res.send('Welcome to my REST API mororo!');
});

// cat_id: number
// name: string
// birthdate: string
// weight: number
// owner: string
// image: string, URL to an image (e.g. https://loremflickr.com/320/240/cat)

app.get('/api/v1/cats', (req, res) => {
  //const cats = [{cat_id: 1, name: 'Misu'}];
  res.json(cats);
});

// GET http://localhost:3000/api/resource/99
// property name (id) is set in the route definition
app.get('/api/v1/cats/:id', (req, res) => {
  //console.log(req);

  // PALAUTTAKAA VAIN YKSI KISSA req.params.id haulla

  // 1. Haetaan ID URL-parametrista ja muunnetaan numeroksi
  const id = Number(req.params.id);
  console.log(id);

  // 2. Etsitään kissa taulukosta
  // find palauttaa ensimmäisen löytyneen olion tai undefined
  const cat = cats.find((cat) => cat.cat_id === id);

  // 3. Jos kissaa ei löydy, palautetaan 404
  if (!cat) {
    return res.status(404).json({message: 'Kissaa ei löytynyt'});
  }

  // 4. Jos kissa löytyy, palautetaan sen tiedot
  res.json(cat);
});

app.post('/api/v1/cats', (req, res) => {
  console.log('request', req.body);
  res.sendStatus(201);
});
