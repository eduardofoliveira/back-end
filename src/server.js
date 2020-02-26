import app from './app';

require('dotenv').config();

const port = process.env.PORT || 9001;

app.listen(port, () => {
  process.stdout.write(`Process Running at port ${port}\r\n`);
});
