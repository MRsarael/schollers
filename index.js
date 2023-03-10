(function () {
  'use strict'

  let list = new List()
  list.setTable(document.getElementById('table-list'))
  list.setDivMessage(document.getElementById('message-list'))
  const form = document.getElementById('form-schooler')

  form.querySelector('#btn-cancel').addEventListener('click', function(e){
    resetForm()
  })

  form.addEventListener('submit', async event => {
    event.preventDefault()
    event.stopPropagation()

    if (!form.checkValidity()) {
      form.classList.add('was-validated')
      return
    }

    var scholler = await getObjectScholler(form)
    await addSchooler(scholler, list)
  }, false)
})()

async function cpf(input) {
  var text = input.value
  text = text.replace(/\D/g,"")
  text = text.replace(/(\d{3})(\d)/,"$1.$2")
  text = text.replace(/(\d{3})(\d)/,"$1.$2")
  text = text.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
  input.value = text
}

async function resetForm() {
  let form = document.getElementById('form-schooler')
  form.className = ''

  var btnRegister = form.querySelector('#btn-register')
  var btnEdit = form.querySelector('#btn-edit')
  var btnCancel = form.querySelector('#btn-cancel')

  btnRegister.style.display = ''
  btnEdit.style.display = 'none'
  btnCancel.style.display = 'none'

  btnRegister.dataset.identifier = ''
  btnEdit.dataset.identifier = ''

  form.reset()
}

async function addSchooler(scholler, listSchooler) {
  listSchooler._newSchooler(scholler).then(async response => {
    let line = response.lineRegister

    await resetForm()
    await addEventButtons(listSchooler, line.querySelector('.btn-edit-schooler'), line.querySelector('.btn-delete-schooler'))
    
    document.getElementById('message-form').innerHTML = ''
    alert(response.message)
  }).catch(error => {
    document.getElementById('message-form').innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        ${error.message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `
  })
}

async function addEventButtons(list, btnEdit, btnDelete) {
  btnEdit.addEventListener('click', function(event) {
    list.getSchoolerByIdentifier(this.dataset.identifier).then(response => {
      const form = document.getElementById('form-schooler')
      var divRadio = document.getElementsByClassName('radio-sex-option')

      form.querySelector('#input-name').value = response.name
      form.querySelector('#input-cpf').value = response.getCpfFormated()
      form.querySelector('#input-idade').value = response.age
      form.querySelector('#input-turma').value = response.schoolClass
      form.querySelector('#input-email').value = response.email
      form.querySelector('#select-turno').value = response.shift

      if(divRadio.length > 0) {
        var radios = divRadio[0].querySelectorAll('input[name="input-sex"]')
        radios.forEach(radio => {
          if(String(radio.value) === String(response.sex)) {
            radio.checked = true
            return
          }
          radio.checked = false
        })
      }

      // Direcionando scroll para o topo
      window.scrollTo(0, 0);

      formModeEdit(list, form, response.id)
    })
  })

  btnDelete.addEventListener('click', function(event) {
    if(confirm("Tem certeza que deseja excluir este aluno?")) {
      list.deleteSchoolers(this.dataset.identifier)
    }
  })
}

async function formModeEdit(list, form, schoolerId) {
  var btnRegister = form.querySelector('#btn-register')
  var btnEdit = form.querySelector('#btn-edit')
  var btnCancel = form.querySelector('#btn-cancel')

  btnRegister.style.display = 'none'
  btnEdit.style.display = ''
  btnCancel.style.display = ''
  btnEdit.dataset.identifier = schoolerId

  btnEdit.addEventListener('click', async event => {
    if (!form.checkValidity()) {
      form.classList.add('was-validated')
      return
    }

    var scholler = await getObjectScholler(form)
    scholler.id = btnEdit.dataset.identifier
    
    list.updeteSchooler(scholler).then(response => {
      resetForm()

      // Removendo evento do botão de editação
      var btnEditOld = btnEdit;
      var btnEditNew = btnEditOld.cloneNode(true);
      btnEditOld.parentNode.replaceChild(btnEditNew, btnEditOld);
      document.getElementById('message-form').innerHTML = ''

      alert(response.message)
    }).catch(error => {
      document.getElementById('message-form').innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          ${error.message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `
    })
  })
}

async function getObjectScholler(form) {
  const name = form.querySelector('#input-name').value
  const cpf = form.querySelector('#input-cpf').value
  const age = form.querySelector('#input-idade').value
  const schoolClass = form.querySelector('#input-turma').value
  const email = form.querySelector('#input-email').value
  const shift = form.querySelector('#select-turno')
  const sex = document.getElementsByName('input-sex')

  var shiftSelected = null
  var sexChecked = null

  Object.keys(shift.children).forEach(index => {
    if(shift.children[index].selected)
      shiftSelected = shift.children[index].value
  })

  Object.keys(sex).forEach(index => {
    if(sex[index].checked)
      sexChecked = sex[index].value
  })

  return new Schooler(name, cpf, age, schoolClass, shiftSelected, email, sexChecked)
}