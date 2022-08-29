const express = require('express');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const app = express();
const port = 8088;

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // use .scss
  debug: true,
  // outputStyle: 'compressed',
  sourceMap: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server started at: http://localhost:${port}/`)
});
