import 'dotenv/config';

import app from './app';

const port = Number(process.env.PORT) || 4001;

app.listen(port, () => {
  console.log(`Joker Tattoo API listening on http://localhost:${port}`);
});

