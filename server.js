const express = require('express');
const app = express();
const path = require("path");
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index-main.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index-main.html'));
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
