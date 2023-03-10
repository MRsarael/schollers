class Schooler {
    constructor(name, cpf, age, schoolClass, shift, email, sex) {
        this._id = null
        this._name = name
        this._cpfFormated = cpf
        this._cpf = cpf.match(/\d+/g).join('')
        this._age = age
        this._schoolClass = schoolClass
        this._shift = shift
        this._email = email
        this._sex = sex
    }

    getCpfFormated() {
        return this._cpfFormated
    }

    set id(id) {
        this._id = id
    }

    get id() {
        return this._id
    }

    set name(name) {
        this._name = name
    }

    get name() {
        return this._name
    }

    set cpf(cpf) {
        this._cpfFormated = cpf
        this._cpf = cpf.match(/\d+/g).join('')
    }

    get cpf() {
        return this._cpf
    }

    set age(age) {
        this._age = age
    }

    get age() {
        return this._age
    }

    set schoolClass(schoolClass) {
        this._schoolClass = schoolClass
    }

    get schoolClass() {
        return this._schoolClass
    }

    set shift(shift) {
        this._shift = shift
    }

    get shift() {
        return this._shift
    }

    set email(email) {
        this._email = email
    }

    get email() {
        return this._email
    }

    set sex(sex) {
        this._sex = sex
    }

    get sex() {
        return this._sex
    }
}
