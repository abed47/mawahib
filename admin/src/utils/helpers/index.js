import validator from 'validator';

export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let url = reader.readAsDataURL(file);

        reader.onload = (e) => {
            resolve(reader.result);
        }

        reader.onerror = (e) => {
            reject(null)
        }
    })
}


export const loginValidators = (email, password) => {
    email = !validator.isEmpty(email)
    password = !validator.isEmpty(password) && password.length > 6
    return [email, password]
}

export const userFormValidators = (fullName, Role, username, password) => {
    fullName = !validator.isEmpty(fullName) && fullName.length > 3;
    Role = !validator.isEmpty(Role);
    username = !validator.isEmpty(username) && username.length > 3;
    password = !validator.isEmpty(password) && password.length > 5;

    return [fullName, Role, username, password]
}

export const clientCreateValidators = (fullName, country, address, zip, email, phone) => {
    fullName = !validator.isEmpty(fullName) && fullName.length > 3;
    email = true
    country = !validator.isEmpty(country)
    address = !validator.isEmpty(address)
    zip = true
    phone = validator.isNumeric(phone) 
    return [fullName, country, address, zip, email, phone]
}

export const clientEditValidators = (fullName, country, address, zip, email, phone) => {
    fullName = !validator.isEmpty(fullName) && fullName.length > 3;
    email = true
    country = !validator.isEmpty(country)
    address = !validator.isEmpty(address)
    zip = true
    phone = validator.isNumeric(phone) 
    return [fullName, country, address, zip, email, phone]
}

export const orderCreateValidators = (client, link, description, fullName, country, address, zip) => {
    client = !validator.isEmpty(client);
    link = !validator.isEmpty(link);
    description = !validator.isEmpty(description)
    fullName = !validator.isEmpty(fullName) && fullName.length > 3;
    country = !validator.isEmpty(country)
    address = !validator.isEmpty(address)
    zip = !validator.isEmpty(zip)
    return [client, link, description, fullName, country, address, zip]
}

export const transactionValidator = (amount, reason) => {
    amount = !(amount < 1);
    reason = !validator.isEmpty(reason)
    return [amount, reason]
}

export const hasErrors = (arr) => {
    let err = false;
    arr.forEach(item => {
        if(item){
            err = true
        }
    })

    return err
}

export const isInvalid = (arr) => {
    let err = false;
    arr.forEach(item => {
        if(item == false){
            err = true
        }
    })

    return err
}