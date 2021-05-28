const app = require('./app');
const PORT = process.env.PORT || 3001;

/*
 * Do not write your routes here, do it in server/app.js.
*/

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});