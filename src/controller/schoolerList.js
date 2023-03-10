class List {
    constructor() {
        this._table = null
        this._divMessage = null
        this._schoolers = new Array()
    }

    getSchoolers() {
        return this._schoolers
    }

    setTable (table) {
        this._table = table
        
        if(this._schoolers.length == 0 ) {
            table.style.display = 'none'
        }
    }

    setDivMessage (divMessage) {
        if(this._schoolers.length == 0 ) {
            divMessage.innerHTML = this.getMessageListSchoolerEmpty()
            divMessage.style.display = 'block'
        }

        this._divMessage = divMessage
    }

    getMessageListSchoolerEmpty() {
        return `
            <div class="alert alert-primary" role="alert" style="display:block;">
                Nenhum registro foi inserido ainda
            </div>
        `
    }

    async _setSchooler(schooler) {
        var sex = await this._getDescriptionSex(schooler.sex)
        var shift = await this._getDescriptionShift(schooler.shift)
        var cpf = schooler.getCpfFormated()
        var identifier = schooler.id

        this._schoolers.find(schooler => {
            if(schooler.getCpfFormated() == cpf && schooler.id != identifier) {
                throw new Error('Este registro já foi inserido')
            }
        })

        var row = document.createElement("tr")

        var cell_1 = document.createElement("td")
        var cell_2 = document.createElement("td")
        var cell_3 = document.createElement("td")
        var cell_4 = document.createElement("td")
        var cell_5 = document.createElement("td")
        var cell_6 = document.createElement("td")
        var cell_7 = document.createElement("td")
        var cell_8 = document.createElement("td")
        var cell_9 = document.createElement("td")

        cell_1.innerHTML = `<b>${this._schoolers.length + 1}</b>`
        cell_2.innerHTML = `${schooler.name}`
        cell_3.innerHTML = `${cpf}`
        cell_4.innerHTML = `${schooler.email}`
        cell_5.innerHTML = `${schooler.age}`
        cell_6.innerHTML = `${schooler.schoolClass}`
        cell_7.innerHTML = `${shift}`
        cell_8.innerHTML = `${sex}`
        
        cell_9.innerHTML = `
            <button type="button" class="btn btn-secondary btn-sm btn-edit-schooler" data-identifier="${schooler.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                </svg>
            </button>
            <button type="button" class="btn btn-danger btn-sm btn-delete-schooler" data-identifier="${schooler.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                </svg>
            </button>
        `

        row.appendChild(cell_1)
        row.appendChild(cell_2)
        row.appendChild(cell_3)
        row.appendChild(cell_4)
        row.appendChild(cell_5)
        row.appendChild(cell_6)
        row.appendChild(cell_7)
        row.appendChild(cell_8)
        row.appendChild(cell_9)

        this._table.querySelector('tbody').appendChild(row)
    }

    async _redoTableIndex() {
        var tbody = this._table.querySelector('tbody')
        tbody.querySelectorAll('tr').forEach((element, index) => {
            var columns = element.querySelectorAll('td')
            if(columns.length > 1)
                columns[0].innerHTML = `<b>${index + 1}</b>`
        })
    }

    async _getLastRegister() {
        var tbody = this._table.querySelector('tbody')
        if(tbody.querySelectorAll('tr').length > 0)
            return tbody.querySelectorAll('tr')[tbody.querySelectorAll('tr').length - 1]
        return []
    }

    async _getLineRegisterByIdentifier(identifier) {
        var elementSelected = null
        var tbody = this._table.querySelector('tbody')

        tbody.querySelectorAll('tr').forEach((element, index) => {
            let btn = element.querySelector('.btn-delete-schooler')

            if(String(btn.dataset.identifier) === String(identifier)) {
                elementSelected = tbody.querySelectorAll('tr')[index]
            }
        })

        return elementSelected
    }

    async getSchoolerByIdentifier(identifier) {
        let schooler = null

        this._schoolers.forEach((element, index) => {
            if(String(element._id) === String(identifier))
                schooler = this._schoolers[index]
        })

        return schooler
    }

    async _newSchooler(schooler) {
        return new Promise(async (resolve, reject) => {
            try {
                schooler.id = new Date().getTime()
                await this._setSchooler(schooler)
                this._schoolers.push(schooler)
                this._divMessage.style.display = 'none'
                this._table.style.display = ''

                resolve({
                    message: 'Registro inserido com sucesso!',
                    lineRegister: await this._getLineRegisterByIdentifier(schooler.id)
                })
            } catch (error) {
                reject({
                    message: error.message,
                    lineRegister: []
                })
            }
        })
    }

    async updeteSchooler(schooler) {
        return new Promise(async (resolve, reject) => {
            try {
                var schoolreExists = false

                this._schoolers.forEach((element, index) => {
                    if(String(element._id) === String(schooler.id)) {
                        schoolreExists = true
                        this._schoolers[index] = schooler
                        this._updateLineSchooler(schooler)
                    }

                    if(schooler.getCpfFormated() == element.getCpfFormated() && schooler.id != element.id) {
                        throw new Error('Já Existe um registro com este CPF')
                    }
                })

                if(schoolreExists === false)
                    throw new Error('O registro não foi encontrado')

                resolve({
                    message: 'Registro editado com sucesso',
                    lineRegister: []
                })
            } catch (error) {
                reject({
                    message: error.message,
                    lineRegister: []
                })
            }
        })
    }

    async _updateLineSchooler(schooler) {
        var line = await this._getLineRegisterByIdentifier(schooler.id)

        var sex = await this._getDescriptionSex(schooler.sex)
        var shift = await this._getDescriptionShift(schooler.shift)
        var cpf = schooler.getCpfFormated()

        if(line) {
            var columns = line.querySelectorAll('td')
            columns[1].innerHTML = `${schooler.name}`
            columns[2].innerHTML = `${cpf}`
            columns[3].innerHTML = `${schooler.email}`
            columns[4].innerHTML = `${schooler.age}`
            columns[5].innerHTML = `${schooler.schoolClass}`
            columns[6].innerHTML = `${shift}`
            columns[7].innerHTML = `${sex}`
            return
        }

        throw new Error('Não foi possível encontrar o registro listado na tabela')
    }

    async _removeLine(identifier) {
        var tbody = this._table.querySelector('tbody')

        if(tbody.querySelectorAll('tr').length > 0) {
            tbody.querySelectorAll('tr').forEach((element, index) => {
                let btn = element.querySelector('.btn-delete-schooler')

                if(String(btn.dataset.identifier) === String(identifier)) {
                    tbody.querySelectorAll('tr')[index].remove()
                }
            })
        }
    }

    async _removeSchoolerFromArray(identifier) {
        this._schoolers.forEach((element, index) => {
            if(String(element._id) === String(identifier))
                this._schoolers.splice(index, 1)
        })
    }

    async deleteSchoolers(identifier) {
        await this._removeLine(identifier)
        await this._removeSchoolerFromArray(identifier)
        await this._redoTableIndex()

        if(this._divMessage != null && this._schoolers.length == 0) {
            this._divMessage.innerHTML = this.getMessageListSchoolerEmpty()
            this._divMessage.style.display = 'block'
            this._table.style.display = 'none'
        }
    }

    async _getDescriptionSex(sex) {
        return (sex == 'M' ? 'Masculino' : (sex == 'F' ? 'Feminino' : 'Outro'))
    }

    async _getDescriptionShift(shift) {
        return (shift == 'M' ? 'Manhã' : (shift == 'T' ? 'Tarde' : 'Noite'))
    }

    set schooler (schooler) {
        return _newSchooler(schooler)
    }

    get schooler () {
        return this._schooler
    }
}
