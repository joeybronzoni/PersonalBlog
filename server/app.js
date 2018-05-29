
const path = require('path'),
      express = require('express'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      cors = require('cors'),
      errorhandler = require('errorhandler'),
      mongoose = require('mongoose');


require('dotenv').config({ path: __dirname + '/../variables.env' });
mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(require('morgan')('dev'));
app.use((bodyParser.urlencoded({ extended: false})));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'LightBlog',
  cookie: {	maxAge: 60000 },
  resave: false,
  saveUninitialized: false }));

if (!isProduction) {
  app.use(errorhandler());
}


mongoose.connect(process.env.DATABASE);
mongoose.set('debug', true);

// TODO:
/* List
   -Add models
   -Add routes
*/
require('./models/Articles');

app.use((req, res, next) => {
  const err = new Error('Oh no!!! Not Found');
  err.status = 404;
  next(err);
});

if (!isProduction) {
  app.use((req, res, next) => {
	res.status(err.status || 500);

	res.json({
	  errors: {
	    message: err.message,
	    error: err,
	  },
	});
  });
}

app.use((req, res, next) => {
  res.status(err.status || 500);

  res.json({
    errors: {
	  message: err.message,
	  error: {},
	},
  });
});

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(` Express running → PORT ${server.address().port}`);
});
