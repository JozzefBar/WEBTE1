console.log('Main JS loaded');

const form = document.getElementById('myForm');
const inputs = {

    name: document.getElementById('name'),
    email: document.getElementById('email'),
    age: document.getElementById('age'),
    date: document.getElementById('date'),
    dob: document.getElementById('dob'),
    agree: document.getElementById('agree'),
    message: document.getElementById('message')

}

consterrors = {
    name: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    age: document.getElementById('ageError'),
    date: document.getElementById('dateError'),
    dob: document.getElementById('dobError'),
    agree: document.getElementById('agreeError'),
    message: document.getElementById('messageError')
}

// Validation functions
function validateName(value) {
    if(!value.trim()) return "Meno je povinné";
    if(value.length < 3) return "Meno musí mať aspoň 3 znaky";
    return "";
}

function validateEmail(value) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!value.trim()) return "Email je povinný";
    if(!pattern.test(value)) return "Neplatný formát emailu";
    return "";
}

function validateAge(value) {
    if(!value.trim()) return "Vek je povinný";
    if(value < 0 || value > 120) return "Vek musí byť medzi 0 a 120";
    return "";
}

function validateDob(value){
    if(!value.trim()) return "Dátum narodenia je povinný";
    const dob = new Date(value);
    const today = new Date();
    if(dob >= today) return "Dátum narodenia musí byť v minulosti";
    return "";
}

function validateAgree(valie){
    if(!value) return "Musíte súhlasiť s podmienkami";
    return "";
}

function validateMessage(value){
    if(value.length > 500) return "Správa nesmie presiahnuť 500 znakov";
    return "";
}

// Event listeners for real-time validation
Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener('input', () => {
        const value = inputs[key].value;
        let errorMessage = "";

        if(key === "name") errorMessage = validateName(value);
        else if(key === "email") errorMessage = validateEmail(value);
        else if(key === "age") errorMessage = validateAge(value);
        else if(key === "dob") errorMessage = validateDob(value);
        else if(key === "agree") errorMessage = validateAgree(inputs[key].checked);
        else if(key === "message") errorMessage = validateMessage(value);
    
        errors[key].textContent = errorMessage;

        if(errorMessage){
            inputs[key].classList.add('error');
            inputs[key].classList.remove('valid');
        }
        else{
            inputs[key].classList.remove('error');
            inputs[key].classList.add('valid');
        }
    });
})

// Form submission
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = inputs.name.value.trim();
    const email = inputs.email.value.trim();
    const age = inputs.age.value.trim();
    const dob = inputs.dob.value.trim();
    const agree = inputs.agree.checked;
    const message = inputs.message.value.trim();

    const validateErrors = {
            name: validateName(name),
            email: validateEmail(email),
            age: validateAge(age),
            dob: validateDob(dob),
            agree: validateAgree(agree),
            message: validateMessage(message)
    };

    let hasError = false;
    Object.keys(validateErrors).forEach(key => {
        if(validationErrors[key]){
            errors[key].textContent = validateErrors[key];
            inputs[key].classList.add('error');
            inputs[key].classList.remove('valid');
            hasError = true;
        }
        else{
            errors[key].textContent = "";
            inputs[key].classList.remove('error');
            inputs[key].classList.add('valid');
        }
    });

    if(!hasError){
        event.target.submit();
    }
    
});