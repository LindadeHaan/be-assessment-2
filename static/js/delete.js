var deleteButton = document.querySelector('#deleteAccount')

function sendDelete(event) {
  console.log(this.dataset)
  // fetch is moeilijk api om makkelijk een http request te doen.
  // eerste argument is altijd een url. haal op wat er in de url staat
  var id = this.dataset.id
  fetch('/delete/' + id, {
      method: 'DELETE'
    })
    .then(onDelete)
    .then(onSucces, onError)
}

function onDelete(res) {
  return res.json()
}

function onSucces() {
  console.log('verwijderd')
  window.location = '/'
}

function onError() {
  throw new Error('Werkt niet!!!!')
}

deleteButton.addEventListener('click', sendDelete)
