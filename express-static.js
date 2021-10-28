
const express = require('express')
const app = express()

app.get('/', function (req, res) {

  res.sendFile(__dirname +'/public/index.html');
})


app.use(express.static('public'))	

app.use('/html', express.static('html'));
app.use('/js', express.static('js'));
app.use('/static', express.static('static'));
app.use('/letters', express.static('letters'));

app.listen(3000, function () {
  console.log('Expres runnign on http://localhost:3000 ');
});