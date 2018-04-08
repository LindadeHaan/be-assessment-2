# be-assessment2

## Partners&Pets
Partners&Pets is a datingsite for people who like (and have) pets. On this datingsite they kan find other people who are into pets. You are being matched by which pet you like and what you look for in partner.

To register for this datingsite you have to fill in a form with your information and you have to answer two questions about pets of course.

When you filled in the form to register, at the moment, you only get matched with the people who have the gender you prefer as a partner.

## Install Partners&Pets
To install Partners&Pets you have to follow a few steps:

Use cd in your terminal to get to the place where you want to install on you computer.

To clone the repository
```
git clone https://github.com/LindadeHaan/be-assessment-2.git
cd be-assessment-2
npm install
```
Start server:
```
node server.js
```

### package.json
To make a package.json file you have to follow a few steps in your terminal:
```
npm init
```
After `npm init` you just have to fill in what your terminal requires.
In your package.json file you can see which packages you already installed and which packages you still have to install.

### Packages

* [Express](https://github.com/expressjs/express)
* [EJS](https://github.com/tj/ejs)
* [Body Parser](https://github.com/expressjs/body-parser)
* [Multer](https://github.com/expressjs/multer)
* [MySQL](https://github.com/mysqljs/mysql)
* [Express Session](https://github.com/expressjs/session)

How to install a package:
```
npm install package_name
```

## Structure
In the server.js file everything for the whole app comes together. In this file you can see all the code I used to make the  express server and how I alter the MySQL database.

### static
In the static folder are my css files, js files, images and uploads. These files are in the static folder, because these files do not change. 
```js
app.use(express.static('static'))
```
With this code, the files in the static folder are available to use.
I have various css files, because like this it is more clear to see what has which style. 

### view
In the view folder are all of the ejs templates 
```js
app.set('view engine', 'ejs')
app.set('views', 'views')
```
The view folder contains the `index.ejs`, that is where the `/` is hosted. It also includes the register, log-in, profile, matches and error pages.
