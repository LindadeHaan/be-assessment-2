# be-assessment-2

## Partners&Pets
Partners&Pets is a datingsite for people who like (and have) pets. On this datingsite they kan find other people who are into pets. You are being matched by which pet you like and what you look for in partner.

To register for this datingsite you have to fill in a form with your information and you have to answer two questions about pets of course.

When you filled in the form to register, at the moment, you only get matched with the people who have the gender you prefer as a partner.

### Explaining Partners&Pets

![Index Page]()

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

## Database
I used the MySQL database.

Install MySQL:

* Install [Homebrew](ttps://brew.sh/index_nl)
* `brew update`
* `brew install mysql`
* Make a connection in your server.js with MySQL 
```js
var connection = mysql.createConnection({
  host: 'localhos',
  user: 'your_username',
  password: '',
  database: 'your_database_name'
})
connection.connect()
```
* Start the MySQL database in the terminal: `mysql -u your_username`
* Go to your database in the terminal so you can work in that database: `use your_database_name`

__MySQL works with tables__

Create a new table:
```
CREATE TABLE IF NOT EXISTS messages (
  id INT NOT NULL AUTO_INCREMENT,
  name TEXT CHARACTER SET utf8,
  age TEXT CHARACTER SET utf8,
  place TEXT CHARACTER SET utf8,
  PRIMARY KEY (id)
);
```
This is how you create a table in a MySQL database. The `id INT NOT NULL AUTO_INCREMENT,` and `PRIMARY KEY (id)`
line you can leave just like this.
Between those two lines you can declare your table columns. Most of the time those columms are the properties of, for example, your users have to fill in to register for the site.

How to instert something into a table:
```
INSERT INTO profiles (column_name1, column_name2, column_name3, column_name4, column_name5) VALUES (
    ‘value1',
    'value2',
    'value3',
    ‘value4’,
    ‘value5’
    );
```
How to add a column in your table:
```
ALTER TABLE table_name
ADD column_name datatype;
```

How to delete a column from your table:
```
ALTER TABLE table_name
DROP COLUMN column_name
```

How to delete a row from your table:
```
DELETE FROM table_name WHERE id = id_number
```

## To Do List
- [x] Make a repository with the name: be-assessment-2  
- [x] Make sure every page is linked to another properly.
- [x] Add concept of the datingsite to readme  
- [x] Add files to repository: server, ejs templates, js files, css files, static folder, view folder, uploads folder, README.md, package.json and images.
- [x] Add Express Session to get users to stay logged in.
- [x] Make it possile for users to log out.
- [x] Make it possible to upload an image and show this as a profile picture.
- [x] Let people communicate in some kind of way with each other.
- [x] Add an option for users to change their information and make it work.
- [x] Show the gender users filled in as preferred gender as matches.
- [x] Add MySQL
- [x] Add license
- [ ] Hash passwords
## License
[MIT](https://github.com/LindadeHaan/be-assessment-2/blob/master/LICENSE)
