//******** Required modules **********//
const express = require('express'); // main js framework
const path = require('path');
const exphbs = require('express-handlebars'); // framework helper
const passport = require('passport');  // authentication module
const methodOverride = require('method-override'); //
const flash = require('connect-flash');  // messaging
const session = require('express-session'); // user session
const bodyParser = require('body-parser');  // framework helper
const mongoose = require('mongoose'); // mongodb connector

// Initialize application
const app = express();

// load routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Passport config
require('./config/passport')(passport);

// body-parser create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

//******** Database connection **********//
// Map global promise
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev') // connect to mongoDB w/ mongoose
  .then(() => console.log('Mongodb connected...'))
  .catch(err => console.log(err))


//******** set up middleware **********//
// Handlebars middleware
app.engine('handlebars', exphbs({           
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

//static folder
app.use(express.static(path.join(__dirname,'public')));

// parse application/json
app.use(bodyParser.json());

// Method override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// flash middleware
app.use(flash());

//globals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//********  PAGES   *********** */
// index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// about route
app.get('/about', (req, res) => {
  res.render('about');
});

//use routes
app.use('/ideas/', ideas); 
app.use('/users/', users);

//set the listen port
const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});