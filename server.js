// My code is the same as the code of Nina van Bergen, Jessie Mason and a part of the code of May Johansson.
// We worked together on the code, so that is why it is pretty much the same code.
// Wouter Lem also thaught us some of the code in this file.
// We had lessons from him about MySQL.

'use strict'

// This console.log is to see if the server is starting.
console.log('server is starting')

// Here I require the packages I used.
// I first installed these in my terminal with npm install package_name
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

// app.get is that you get something back from the browser.
// All the routes will be typed like this: localhost:3000/form .
// So if you type that in your browser, you will use an app.get('/form', ...).
// When something like that happens, a function will be executed,
// the function after the route so: app.get('/form', profile)
// This is for all the app.get's under here.

// You need app.post to post your information you fill in, in forms to post to the database.

// EJS
app.set('view engine', 'ejs')
// Folder views
app.set('views', 'views')
// Static folder, I can use files from the static folder now.
app.use(express.static('static'))
app.use(bodyParser.urlencoded({
  extended: true
}))
// secret = the key that will be used for the encryption of all the cookies
// resave saves the cookies everytime. If it is true, it wil overwrite,
// If that is false, than it won't overwrite all the time
// Otherwise you would have a lot of data traffic.
// saveUninitialized = makes sure that there are no unnecessary sessions
// False = only when a user logs in you want a session
// True = unnecessary sessions
app.use(session({
  secret: 'hoihoi',
  resave: false,
  saveUninitialized: false
}))
// Makes it possible to log in.
app.post('/profile', handleLogin)
// Makes it possible to register and upload an image as a profile picture.
app.post('/registerUser', upload.single('img'), handleRegister)
// Makes it possible to chat with users.
app.post('/chat', saveMessage)
app.post('/update/:id', update)
// Makes it possible to delete an account.
app.delete('/delete/:id', deleteAccount)
app.get('/profile/:id', profile)
app.get('/login', login)
app.get('/logout', logout)
app.get('/updatePage', updatePage)
app.get('/detail/:id', detail)
app.get('/matches', matches)
app.get('/detail', chat)
app.get('/register', renderForm)
app.get('/', listening)
app.listen(3000)

// This part is used to connect the server.js with MySQL
// Host = the host for your server
// User = the username for MySQL
// Database = the name of your database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'datingsite'
})
connection.connect()

// This array contains the names and images of the choice users can make at the first question under the register form.
// I can use this array in my ejs templates by using a forEach loop and <%= data.img %> and <%= data.name %> at the places
// where the images and names are supposed to be.
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

// Function to render the index page.
function listening(req, res) {
  res.render('index.ejs')
}

// Function to render the profile page of the user that is logged in.
// With the SELECT * FROM profiles WHERE id = ?', id line the ejs template and server.js get the data from my database where the id is the same as the id of the user that is logged in.
// If there is an error, you get redirected to error.ejs.
// If everything goes fine, you get the profle.ejs file.
// var locals contains al the local variables that we to the template.
// req.session is used when a user is logged in. Session makes it possible to get users to stay logged in.
function profile(req, res) {
  var id = req.params.id
  connection.query('SELECT * FROM profiles WHERE id = ?', id, function(err, users) {
    if (err) {
      // Account could not be found
      // 404 account not found
      return res.status(404).render('error.ejs', {
        id: 404,
        description: "page not found",
        map: "../"
      })
    }
    var user = users[0]
    var locals = {
      user: user,
      session: req.session,
    }
    res.render('profile.ejs', locals)
  })
}
// Inspiratie en bron: Deanna: https://github.com/deannabosschert/freshstart/blob/master/index.js en
// Titus: https://github.com/cmda-be/course-17-18/blob/master/examples/mysql-server/index.js
// This function handles the register page.
// This is where you add an user to your database.
// When the user has filled in the form and clicks submit, the user is added to the database.
// The words like img, id, name, etc. are properties.
// Those properties are the same as the names of the columns in the database.
// When all the properties are filled in, the user gets redirected to the log in page.
// When the something is not filed in that is required, the server renders the error.ejs file.
function handleRegister(req, res) {
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
      return res.status(404).render('error.ejs', {
        id: 404,
        description: "page not found",
        map: "../"
      })
    } else {
      res.redirect('/login')
    }
  }
}

// This function renders the login.ejs file
function login(req, res) {
  res.render('login.ejs')
}

// In this function, if the user logs out, the session gets destroyed.
// When the user succesfully logs out, the user gets redirected to the index page.
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

// Function to check the log in information of the users
// When you email and password are correct, the user gets redirected to their own profile.
// When the email and password aren't correct, the user gets redirected to the same page: the log in page.
function handleLogin(req, res) {
  var body = Object.assign({}, req.body)
  connection.query('SELECT * FROM profiles WHERE email = ?', body.email, function(err, users) {
    if (err) throw err;
    var user = users[0]
    // This needs to happen if everything goes correct when users log in.
    if (user && user.password === body.password) {
      req.session.loggedIn = true
      // You know which user is logged in.
      req.session.user = user
      res.redirect('/profile/' + users[0].id)
    } else {
      res.render('login.ejs')
    }
  })
}

// This function is to render the page where users can see their matches.
// The if else statement makes it possible to filter the preferred genders of the users.
function matches(req, res, users) {
  var user = users[0]
  if (req.session.user.preferredGender == 'female') {
    // Select everyone with gender: male
    connection.query("SELECT * FROM profiles WHERE gender = 'female'", onDone)
  } else {
    // Select everyone with gender: female
    connection.query("SELECT * FROM profiles WHERE gender = 'male'", onDone)
  }
 // Or it throws an throws an error
 // Or the length of data is 0, so there is no data to show.
  function onDone(err, data) {
    if (err || data.length === 0) {
      //account niet kunnen vinden
      //404 account not found
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

// This function renders the detail.ejs template if a user clicks on the chat button on the matches page.
// In var locals, messages id defined because on the profile their is a chat option.
function chat(req, res) {
  var id = req.params.id
  connection.query('SELECT * FROM profiles', id, onDone)

  function onDone(err, data, messages) {
    if (err || data.length === 0) {
      //account niet kunnen vinden
      //404 account not found
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

// This function renders the register.ejs template.
// data: data is defined, because I use images for the animals in the first question on the index page.
function renderForm(req, res) {
  res.render('register.ejs', {
    data: data
  })
}

// This function render the detail page. That is the profile of someone else.
// Source for the comments below for this function: Nina van Bergen
// To make the chat work, and to save the data in the table messages,
// We need to use SELECT, there we need to specify what we want to know, so here we want to select me and other.
// We want to see our message, but also the message that has been send back to us as well.
// That means that we need to specify them twice in order to make that work.
// You also need to specify the values such as req.params.id twice
// But because we want one where the logged in user sends them, you need to start with req.session.user.id and then req.params.id
// And we also want one where the other person sends a message, so then you need to begin with req.params.id and after that req.session.user.id
// The order of that is very important, so first the logged in user and the id of other user for our messages
// And after that the id of the other user first and then the logged in user
function detail(req, res) {
  var id = req.params.id
  connection.query('SELECT * FROM profiles WHERE id = ?', id, function(err, users) {
    if (err) {
      //account niet kunnen vinden
      //404 account not found
      return res.status(404).render('error.ejs', {
        id: 404,
        description: "page not found",
        map: "../"
      })
    }
    var user = users[0]
    connection.query('SELECT * FROM messages WHERE me = ? AND other = ? OR me = ? AND other = ?', [
      req.session.user.id,
      req.params.id,
      req.params.id,
      req.session.user.id
    ], function(err, messages) {
      if (err) {
        //account niet kunnen vinden
        //404 account not found
        return res.status(404).render('error.ejs', {
          id: 404,
          description: "page not found",
          map: "../"
        })
      }
      var locals = {
        data: user,
        messages: messages,
        session: req.session
      }
      res.render('detail.ejs', locals)
    })
  })
}

// req.body get everything what has been filled in in the form.
// Object.assign makes it an object.
// This is where you add messages to your database.
// When the user has send a message to someone the message is added to the database.
// The words chatting, me and other are properties.
// Those properties are the same as the names of the columns in the database.
// When a message is send, the user is redirected to the same page. But you can see message you just send.
// When the something is not filed in that is required, the server renders the error.ejs file.
// + body.other adds the message to the body.
function saveMessage(req, res) {
  var body = Object.assign({}, req.body)
  connection.query('INSERT INTO messages SET ?', {
    chatting: req.body.chatting,
    me: req.body.me,
    other: req.body.other,
  }, done)

  // Source: titus github & Nina
  function done(err, data) {
    if (err) {
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

// req.params.id gets the id from the user.
// From the request you get the parameters and from there the id.
// We want to delete an account with this function so we use DELETE.
// And we need to select what we want to delete from the table profles, the id.
// After that you get redirected to the index page of the site.
function deleteAccount(req, res) {
  var id = req.params.id
  connection.query('DELETE FROM profiles WHERE id = ?', id, function(err, users) {
    if (err) {
      return res.status(404).render('error.ejs', {
        id: 404,
        description: "page not found",
        map: "../"
      })
    }
    res.redirect('/')
  })
}


function updatePage(req, res) {
  var id = req.params.id
  connection.query("SELECT * FROM profiles", function(err, data) {
    var locals = {
      data: data,
      session: req.session
    }
    res.render('update.ejs', locals)
  })
}

// Because all of the names of the columns are in the connection.query,
// a user can change the information they filled in when they registered for the site.
// All the things the user can change are in UPDATE profiles SET ....
function update(req, res) {
  var id = req.params.id
  var body = req.body
  connection.query("UPDATE profiles SET name = ?, email = ?, age = ?, gender = ?, password = ?, preferredGender = ?, city = ? WHERE id = ?", [
    body.name,
    body.email,
    body.age,
    body.gender,
    body.password,
    body.preferredGender,
    body.city,
    id
  ], done)

  function done(err, data) {
    if (err) {
      return res.status(404).render('error.ejs', {
        id: 404,
        description: "page not found",
        map: "../"
      })
    }
    var locals = {
      data: data,
      session: req.session
    }
    res.redirect("/profile/" + req.session.user.id)
  }
}
