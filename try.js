const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
app.use(session({
  secret: "your_secret_key"
}));
app.use(flash());
app.get('/register', (req, res) => {
  console.log(req.query);
  req.session.user = req.query.user;
  req.flash('success', 'User registered successfully!');
  res.send('User registered and session created.');
});
app.get('/hello', (req, res) => {
  res.send(`Hello ${req.session.user || 'Anonymous'}`);
});
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(8080, () => {
  console.dir('server is running on: http://localhost:8080');
});