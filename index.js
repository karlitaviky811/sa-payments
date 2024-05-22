// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.


const express = require('express')
const app = express()


const port = process.env.port | 4242;
const stripe = require('stripe')('sk_test_51PHqym082Z2VYEr07fwL95gqoaNpiRZ8XDbpDFRvEf3cFHjyFFL6Gf26a9nAVLpPX5MIBbn07wKe9oMkbLgYk1ww00zXwY4jZ4');
const YOUR_DOMAIN = 'http://localhost:4242';


var http = require('http');
const fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');
app.set('port', port || 4242);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var path = require('path');
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) {
     res.sendStatus(200);
   }
   else {
     next();
   }});


app.get('/', (req, res) => {
  console.log('hey')
  res.header("Access-Control-Allow-Origin", '*');
  res.send('Hello World! :)')
})

app.post('/create-checkout-session', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1PIKc6082Z2VYEr0PWJafgdC',
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${YOUR_DOMAIN}/acepted`,
  });
  res.status(200).json(session)

  //res.send({clientSecret: session.client_secret});
});

app.get("/acepted", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/html");

  fs.readFile(path.join(__dirname,'/success.html'), (err, data) => {
    if(err) {
      console.log(err);
      res.end();
    } else {
      res.write(data);
      res.end();
    }
  })
});

app.get('/session-status', async (req, res) => {

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 500,
    currency: 'gbp',
    payment_method: 'pm_card_visa',
  });
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



