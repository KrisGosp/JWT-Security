const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

require('dotenv').config();

// database connection
const dbURI = process.env.DB_STRING;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })


const PORT = 3000;
app.listen( PORT, () => console.log(`listening on port ${PORT}`))

// .then((result) => app.listen(3000, () => console.log('listening on port 3000', result)))
  // .catch((err) => console.log(err));

// routes
app.get('*', checkUser); // it apllies for every single get request
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

app.use(authRoutes);






































// app.get('/set-cookies', (req, res) => {

//   // res.setHeader('set-cookie', 'newUser=true');

//   res.cookie('newUser', true);
//   res.cookie('isEmployee', true, { maxAge: 1000 * 24 * 60 * 60, httpOnly: true });

//   res.send('cookie attached')

// });

// app.get('/read-cookies', (req, res) => {

//   const cookies = req.cookies;
//   console.log(cookies);

//   res.send(cookies.newUser);
  
// });