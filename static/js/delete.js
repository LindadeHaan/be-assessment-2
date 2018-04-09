// Source: https://github.com/cmda-be/course-17-18/blob/master/examples/mysql-server/static/index.js
// Source: Wouter Lem helped us with the code.

var deleteButton = document.querySelector('#deleteAccount')

function sendDelete(event) {
  console.log(this.dataset)
  // Fetch is a hard API to do an easy HTTP request.
  // The first argument is always an url. Gets what is in the url.
  var id = this.dataset.id
  fetch('/delete/' + id, {
      method: 'DELETE'
    })
    // Promises
    .then(onDelete)
    .then(onSucces, onError)
}

function onDelete(res) {
  return res.json()
}

function onSucces() {
  window.location = '/'
}

function onError() {
  throw new Error('Werkt niet!!!!')
}

deleteButton.addEventListener('click', sendDelete)
