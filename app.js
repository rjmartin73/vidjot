//******** Required modules **********//
const express = require('express'); // main js framework
const path = require('path');
const exphbs = require('express-handlebars'); // framework helper
const passport = require('passport'); // authentication module
const methodOverride = require('method-override'); //
const flash = require('connect-flash'); // messaging
const session = require('express-session'); // user session
const bodyParser = require('body-parser'); // framework helper
const mongoose = require('mongoose'); // mongodb connector

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);
// DB Config
const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
  console.log(`Server started on port ${PORT}`);
});