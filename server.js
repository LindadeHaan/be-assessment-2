// My code is the same as the code of Nina van Bergen, Jessie Mason and a part of the code of May Johansson.
// We worked together on the code, so that is why it is pretty much the same code.
// Wouter Lem also thaught us some of the code in this file.
// We had lessons from him about MySQL.

'use strict'

console.log('server is starting')

var express = require('express')
var ejs = require('ejs')
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer({
  dest: 'static/uploads/'
})
var mysql = require('mysql')
var session = require('express-session')
var app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static('static'))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(session({
  secret: 'hoihoi',
  resave: false,
  saveUninitialized: false
}))
app.post('/profiel', handleLogin)
app.post('/register', upload.single('img'), handleRegister)
app.post('/chat', saveMessage)
app.post('/update/:id', update)
app.delete('/delete/:id', deleteAccount)
app.get('/profiel/:id', profile)
app.get('/inloggen', login)
app.get('/logout', logout)
app.get('/updatePage', updatePage)
app.get('/detail/:id', detail)
app.get('/matches', matches)
app.get('/detail', chat)
app.get('/registreren', renderForm)
app.get('/', listening)
app.listen(3000)

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datingsite'
})
connection.connect()

var data = [{
    img: 'images/dog.png',
    namePet: 'Hond'
  },
  {
    img: 'images/cat.png',
    namePet: 'Kat'
  },
  {
    img: 'images/bunny.png',
    namePet: 'Konijn'
  },
  {
    img: 'images/lizard.png',
    namePet: 'Hagedis'
  },
  {
    img: 'images/bird.png',
    namePet: 'Vogels'
  },
  {
    img: 'images/fishes.png',
    namePet: 'Vissen'
  },
  {
    img: 'images/horse.png',
    namePet: 'Paard'
  },
  {
    img: 'images/micropig.png',
    namepet: 'Micro Pig'
  },
  {
    img: 'images/ferret.png',
    namePet: 'Fretten'
  }
]

function listening(req, res) {
  console.log('listening....')
  console.log(req.session)
  res.render('index.ejs')
}

function profile(req, res) {
  var id = req.params.id
  connection.query('SELECT * FROM profiles WHERE id = ?', id, function(err, users) {
    if (err) throw err
    var user = users[0]
    var locals = {
      user: user,
      session: req.session,
    }
    console.log(locals)
    // locals heet zo, omdat het alles local variable bevat
    res.render('profiel.ejs', locals)
  })
}
// Inspiratie en bron: Deanna: https://github.com/deannabosschert/freshstart/blob/master/index.js en Titus: https://github.com/cmda-be/course-17-18/blob/master/examples/mysql-server/index.js
function handleRegister(req, res, next) {
  connection.query('INSERT INTO profiles SET ?', {
    img: req.file ? req.file.filename : null,
    id: req.body.id,
    name: req.body.name,
    age: req.body.age,
    city: req.body.city,
    email: req.body.email,
    favpet: req.body.favpet,
    pet: req.body.pet,
    gender: req.body.gender,
    preferredGender: req.body.preferredGender,
    password: req.body.password
  }, done)

  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.redirect('/inloggen')
    }
  }
}

function login(req, res) {
  res.render('inloggen.ejs')
}

function logout(req, res) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return res.status(404).render('error.ejs', {
          id: 404,
          description: err,
          map: "../"
        })
      } else {
        return res.redirect('/')
      }
    })
  }
}

function handleLogin(req, res) {
  var body = Object.assign({}, req.body)
  connection.query('SELECT * FROM profiles WHERE email = ?', body.email, function(err, users) {
    if (err) throw err;
    var user = users[0]
    // dit moet gebeuren als alles correct is bij inloggen
    if (user && user.password === body.password) {
      req.session.loggedIn = true
      // weet welke gebruiker ingelogd is
      req.session.user = user
      res.redirect('/profiel/' + users[0].id)
    } else {
      res.render('inloggen.ejs')
    }
  })
}

function matches(req, res, users) {
  var user = users[0]
  console.log('filter matches')
  if (req.session.user.preferredGender == 'female') {
    // selecteer iedereen met gender male
    connection.query("SELECT * FROM profiles WHERE gender = 'female'", onDone)
  } else {
    // selecteer iedereen met gender female
    connection.query("SELECT * FROM profiles WHERE gender = 'male'", onDone)
  }

  function onDone(err, data) {
    if (err || data.length === 0) {
      //account niet kunnen vinden
      //404 account not found
      console.log("Matches Error: ", err)
      return res.status(404).render('error.ejs', {
        id: 404,
        description: "page not found",
        map: "../"
      })
    } else {
      var locals = {
        data: data,
        session: req.session
      }
      res.render('matches.ejs', locals)
    }
  }
}

function chat(req, res) {
  var id = req.params.id
  connection.query('SELECT * FROM profiles', id, onDone)

  function onDone(err, data, messages) {
    if (err || data.length === 0) {
      //account niet kunnen vinden
      //404 account not found
      console.log("Chat Error: ", err)
      return res.status(404).render('error.ejs', {
        id: 404,
        description: "page not found",
        map: "../"
      })
    } else {
      var locals = {
        data: data,
        session: req.session,
        messages: messages
      }
      res.render('detail.ejs', locals)
    }
  }
}

function renderForm(req, res) {
  res.render('register.ejs', {
    data: data
  })
}

function detail(req, res) {
  var id = req.params.id
  connection.query('SELECT * FROM profiles WHERE id = ?', id, function(err, users) {
    if (err) throw err
    var user = users[0]
    connection.query('SELECT * FROM messages WHERE me = ? AND other = ? OR me = ? AND other = ?', [
      req.session.user.id,
      req.params.id,
      req.params.id,
      req.session.user.id
    ], function(err, messages) {
      if (err) throw err
      var locals = {
        data: user,
        messages: messages,
        session: req.session
      }
      res.render('detail.ejs', locals)
    })
  })
}

function saveMessage(req, res) {
  var body = Object.assign({}, req.body)
  connection.query('INSERT INTO messages SET ?', {
    chatting: req.body.chatting,
    me: req.body.me,
    other: req.body.other,
  }, done)

  //Bron: titus github & Nina
  function done(err, data) {
    if (err) {
      console.log(err)
      return res.status(404).render('error.ejs', {
        id: 404,
        description: err,
        map: '../'
      })
    } else {
      res.redirect('/detail/' + body.other)
    }
  }
}

function deleteAccount(req, res) {
  var id = req.params.id //params haalt de id van de gebruiker
  connection.query('DELETE FROM profiles WHERE id = ?', id, function(err, users) {
    if (err) throw err
    res.redirect('/')
  })
}

function updatePage(req, res) {
  console.log("open update.ejs")
  var id = req.params.id
  connection.query("SELECT * FROM profiles", function(err, data) {
    var locals = {
      data: data,
      session: req.session
    }
    res.render('update.ejs', locals)
  })
}

function update(req, res) {
  var id = req.params.id
  var body = req.body
  connection.query("UPDATE profiles SET name = ?, email = ?, age = ?, gender = ?, password = ?, preferredGender = ?, city = ?, favpet = ?, pet = ? WHERE id = ?", [body.name, body.email, body.age, body.gender, body.password, body.preferredGender, body.city, body.favpet, body.pet, id], done)

  function done(err, data) {
    if (err) throw err
    console.log("Inserted!")
    var locals = {
      data: data,
      session: req.session
    }
    res.redirect("/profiel/" + req.session.user.id)
  }
}
