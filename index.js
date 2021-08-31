const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const path = require('path');
// import model for to do item from models folder
const Task = require('./models/task');
const morgan = require('morgan');
const serveFavicon = require('serve-favicon');

const app = express();

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

//Routers

app.get('/', (request, response, next) => {
  Task.find({})
    .then((tasks) => {
      response.render('home', { tasks });
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/', (request, response, next) => {
  const input = request.body.input;
  Task.create({
    input
  })
    .then((task) => {
      response.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/task/:id/delete', (request, response, next) => {
  const id = request.params.id;
  Task.findByIdAndDelete(id)
    .then(() => {
      response.redirect(`/`);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/task/:id/edit', (request, response, next) => {
  const id = request.params.id;
  Task.findById(id)
    .then((task) => {
      response.render(`task-edit`, { task });
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/task/:id/edit', (request, response, next) => {
  const id = request.params.id;
  const editedInput = request.body.input;
  Task.findByIdAndUpdate(id, { input: editedInput })
    .then(() => {
      response.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

app.use((error, request, response, next) => {
  console.log(error);
  response.render('error');
});

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(3010);
});
