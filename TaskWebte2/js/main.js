console.log('Main JS loaded');

// Dátová štruktúra pre športy, priestory a časy
const sportData = {
    futbal: {
        name: "Futbal",
        spaces: {
            male_ihrisko: {
                name: "Malé ihrisko",
                slots: [
                    { time: "8:00-10:00", price: 20 },
                    { time: "10:00-12:00", price: 25 },
                    { time: "14:00-16:00", price: 30 },
                    { time: "16:00-18:00", price: 35 }
                ]
            },
            velke_ihrisko: {
                name: "Veľké ihrisko",
                slots: [
                    { time: "8:00-10:00", price: 35 },
                    { time: "10:00-12:00", price: 40 },
                    { time: "14:00-16:00", price: 45 },
                    { time: "16:00-18:00", price: 50 }
                ]
            },
            halova_hala: {
                name: "Halová hala",
                slots: [
                    { time: "8:00-10:00", price: 40 },
                    { time: "10:00-12:00", price: 45 },
                    { time: "14:00-16:00", price: 50 }
                ]
            }
        }
    },
    basketbal: {
        name: "Basketbal",
        spaces: {
            hala_a: {
                name: "Hala A",
                slots: [
                    { time: "9:00-11:00", price: 30 },
                    { time: "11:00-13:00", price: 35 },
                    { time: "15:00-17:00", price: 40 },
                    { time: "17:00-19:00", price: 45 }
                ]
            },
            hala_b: {
                name: "Hala B",
                slots: [
                    { time: "9:00-11:00", price: 25 },
                    { time: "11:00-13:00", price: 30 },
                    { time: "15:00-17:00", price: 35 }
                ]
            },
            vonkajsi_kurt: {
                name: "Vonkajší kurt",
                slots: [
                    { time: "8:00-10:00", price: 15 },
                    { time: "10:00-12:00", price: 20 },
                    { time: "14:00-16:00", price: 25 }
                ]
            }
        }
    },
    tenis: {
        name: "Tenis",
        spaces: {
            kurt_1: {
                name: "Kurt 1 (antuka)",
                slots: [
                    { time: "7:00-8:00", price: 12 },
                    { time: "8:00-9:00", price: 15 },
                    { time: "9:00-10:00", price: 15 },
                    { time: "10:00-11:00", price: 18 },
                    { time: "17:00-18:00", price: 20 }
                ]
            },
            kurt_2: {
                name: "Kurt 2 (antuka)",
                slots: [
                    { time: "7:00-8:00", price: 12 },
                    { time: "8:00-9:00", price: 15 },
                    { time: "9:00-10:00", price: 15 }
                ]
            },
            kurt_3: {
                name: "Kurt 3 (tvrdý povrch)",
                slots: [
                    { time: "8:00-9:00", price: 18 },
                    { time: "9:00-10:00", price: 18 },
                    { time: "10:00-11:00", price: 20 }
                ]
            }
        }
    },
    plavanie: {
        name: "Plávanie",
        spaces: {
            bazen_25m: {
                name: "Bazén 25m (dráha)",
                slots: [
                    { time: "6:00-7:00", price: 8 },
                    { time: "7:00-8:00", price: 10 },
                    { time: "12:00-13:00", price: 12 },
                    { time: "18:00-19:00", price: 15 }
                ]
            },
            bazen_50m: {
                name: "Bazén 50m (olympijský)",
                slots: [
                    { time: "6:00-7:00", price: 12 },
                    { time: "7:00-8:00", price: 15 },
                    { time: "12:00-13:00", price: 18 }
                ]
            },
            rekreacny_bazen: {
                name: "Rekreačný bazén",
                slots: [
                    { time: "10:00-12:00", price: 20 },
                    { time: "14:00-16:00", price: 25 },
                    { time: "16:00-18:00", price: 30 }
                ]
            }
        }
    }
};

const form = document.getElementById('myForm');
const inputs = {

    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    dob: document.getElementById('dob'),
    age: document.getElementById('age'),
    sport: document.getElementById('sport'),
    space: document.getElementById('space'),
    time: document.getElementById('time'),
    terms: document.getElementById('terms'),
    message: document.getElementById('message'),
    paymentCash: document.getElementById('paymentCash'),
    paymentCard: document.getElementById('paymentCard'),
    paymentInvoice: document.getElementById('paymentInvoice'),
    companyName: document.getElementById('companyName'),
    ico: document.getElementById('ico'),
    dic: document.getElementById('dic'),
    address: document.getElementById('address')
}

const errors = {
    firstName: document.getElementById('firstNameError'),
    lastName: document.getElementById('lastNameError'),
    email: document.getElementById('emailError'),
    dob: document.getElementById('dobError'),
    //age: document.getElementById('ageError'),       //?????
    sport: document.getElementById('sportError'),
    space: document.getElementById('spaceError'),
    time: document.getElementById('timeError'),
    terms: document.getElementById('termsError'),
    message: document.getElementById('messageError'),
    payment: document.getElementById('paymentError'),
    companyName: document.getElementById('companyNameError'),
    ico: document.getElementById('icoError'),
    dic: document.getElementById('dicError'),
    address: document.getElementById('addressError')
}

// Validation functions
function validateFirstName(value) {
    if(!value.trim()) return "Meno je povinné";
    if(value.length < 3) return "Meno musí mať aspoň 3 znaky";
    return "";
}

function validateLastName(value) {
    if(!value.trim()) return "Priezvisko je povinné";
    if(value.length < 3) return "Priezvisko musí mať aspoň 3 znaky";
    return "";
}

function validateEmail(value) {
    if(!value.trim()) return "Email je povinný";

    // ^[^\s@]{3,}     - minimálne 3 znaky pred @
    // @               - zavináč
    // [^\s@]+         - prvá časť domény (napr. "example")
    // \.              - bodka
    // [a-zA-Z]{2,4}$  - vrcholová doména 2-4 znaky
    
    const pattern = /^[^\s@]{3,}@[^\s@]+\.[a-zA-Z]{2,4}$/;

    if(!pattern.test(value)) return "Neplatný formát emailu";
    return "";
}

/*
function validateAge(value) {
    if(!value.trim()) return "Vek je povinný";
    if(value < 0 || value > 120) return "Vek musí byť medzi 0 a 120";
    return "";
}
*/

function validateDob(value){
    if(!value.trim()) return "Dátum narodenia je povinný";
    const dob = new Date(value);
    const today = new Date();
    if(dob >= today) return "Dátum narodenia musí byť v minulosti";
    return "";
}

function validateSport(value) {
    if (!value) return "Musíte vybrať šport";
    return "";
}

function validateSpace(value) {
    if (!value) return "Musíte vybrať priestor";
    return "";
}

function validateTime(value) {
    if (!value) return "Musíte vybrať čas a cenu";
    return "";
}

function validateTerms(value){
    if(!value) return "Musíte súhlasiť s podmienkami";
    return "";
}

function validateMessage(value){
    if(value.length > 500) return "Správa nesmie presiahnuť 500 znakov";
    return "";
}

function validateCompanyName(value, isInvoicePayment){
    if(isInvoicePayment && !value.trim()) return "Názov spoločnosti je povinný pri platbe faktúrou";
    return "";
}

function validateICO(value, isInvoicePayment){
    if(isInvoicePayment && !value.trim()) return "IČO je povinné pri platbe faktúrou";
    if(isInvoicePayment && !/^\d{8}$/.test(value)) return "IČO musí mať 8 číslic";
    return "";
}

function validateDIC(value, isInvoicePayment){
    if(isInvoicePayment && !value.trim()) return "DIČ je povinné pri platbe faktúrou";
    if(isInvoicePayment && !/^\d{10}$/.test(value)) return "DIČ musí mať 10";
    return "";
}

function validateAddress(value, isInvoicePayment){
    if(isInvoicePayment && !value.trim()) return "Adresa je povinná pri platbe faktúrou";
    return "";
}

// Age calculation based on DOB
function calculateAgeFromDob(dobValue){
    if(!dobValue) return "";
    const today = new Date();
    let age = today.getFullYear() - dobValue.getFullYear();
    const monthDiff = today.getMonth() - dobValue.getMonth();
    if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobValue.getDate()))
        age--;
    return age;
}

// Funkcia na zobrazenie/skrytie erroru
function showError(element, errorElement, message) {
    errorElement.textContent = message;
    if (message) {
        element.classList.add('error');
        element.classList.remove('valid');
    } else {
        element.classList.remove('error');
        element.classList.add('valid');
    }
}

// Event listener pre výber športu
inputs.sport.addEventListener('change', function(){
    const selectedSport = this.value;

    const errorMessage = validateSport(selectedSport);
    showError(inputs.sport, errors.sport, errorMessage);
    inputs.space.innerHTML = '<option value="">Najprv vyberte priestor</option>';
    inputs.time.innerHTML = '<option value="">Najpr vyberte čas</option>';

    inputs.space.disabled = true;
    inputs.time.disabled = true;

    errors.space.textContent = "";
    errors.time.textContent = "";
    inputs.space.classList.remove('error', 'valid');
    inputs.time.classList.remove('error', 'valid');

    if(selectedSport && sportData[selectedSport]){
        inputs.space.innerHTML = '<option value="">Vyberte priestor</option>';
        
        const spaces = sportData[selectedSport].spaces;
        for(const [key, space] of Object.entries(spaces)){
            const option = document.createElement('option');
            option.value = key;
            option.textContent = space.name;
            inputs.space.appendChild(option);
        }

        inputs.space.disabled = false;
    }
});

// Event listener pre výber priestoru
inputs.space.addEventListener('change', function(){
    const selectedSport = inputs.sport.value;
    const selectedSpace = this.value;

    const errorMessage = validateSpace(selectedSpace);
    showError(inputs.space, errors.space, errorMessage);
    inputs.time.innerHTML = '<option value="">Najpr vyberte čas</option>';
    
    inputs.time.disabled = true;

    errors.time.textContent = "";
    inputs.time.classList.remove('error', 'valid');

    if(selectedSpace && selectedSpace && sportData[selectedSport]){
        inputs.time.innerHTML = '<option value="">Vyberte čas</option>';

        const slots = sportData[selectedSport].spaces[selectedSpace].slots;
        slots.forEach(slot => {
            const option = document.createElement('option');
            option.value = `${slot.time}|${slot.price}`;
            option.textContent = `${slot.time} - ${slot.price} €`;
            inputs.time.appendChild(option);
        });

        inputs.time.disabled = false;
        }
});

// Event listener pre výber času
inputs.time.addEventListener('change', function(){
    const errorMsg = validateTime(this.value);
    showError(this, errors.cas, errorMsg);
});

// Event listener pre prepínanie platobných metód
const invoiceFields = document.getElementById('invoiceFields');

inputs.paymentCash.addEventListener('change', function(){
    if(this.checked){
        invoiceFields.style.display = 'none';
        // Vyčisti fakturačné polia - (ak by vyplnal fakturačné a potom zmenil na hotovosť)
        inputs.companyName.value = '';
        inputs.ico.value = '';
        inputs.dic.value = '';
        inputs.address.value = '';
        // Vyčisti chyby
        errors.companyName.textContent = '';
        errors.ico.textContent = '';
        errors.dic.textContent = '';
        errors.address.textContent = '';
    }
});

inputs.paymentCard.addEventListener('change', function(){
    if(this.checked){
        invoiceFields.style.display = 'none';
        // Vyčisti fakturačné polia
        inputs.companyName.value = '';
        inputs.ico.value = '';
        inputs.dic.value = '';
        inputs.address.value = '';
        // Vyčisti chyby
        errors.companyName.textContent = '';
        errors.ico.textContent = '';
        errors.dic.textContent = '';
        errors.address.textContent = '';
    }
});

inputs.paymentInvoice.addEventListener('change', function(){
    if(this.checked){
        invoiceFields.style.display = 'block';
    }
});

// Event listeners for real-time validation
Object.keys(inputs).forEach(key => {
    if(key === 'sport' || key === 'space' || key === 'time' || 
       key === 'paymentCash' || key === 'paymentCard' || key === 'paymentInvoice') return;

    inputs[key].addEventListener('input', () => {
        const value = inputs[key].value;
        let errorMessage = "";
        const isInvoicePayment = inputs.paymentInvoice.checked;

        if(key === "firstName") errorMessage = validateFirstName(value);
        else if(key === "lastName") errorMessage = validateLastName(value);
        else if(key === "email") errorMessage = validateEmail(value);
        //else if(key === "age") errorMessage = validateAge(value);
        else if(key === "dob"){
            errorMessage = validateDob(value);
            if(!errorMessage && value){
                const age = calculateAgeFromDob(new Date(value));
                inputs.age.value = age;
            }
        }
        else if(key === "terms") errorMessage = validateTerms(inputs[key].checked);
        else if(key === "message") errorMessage = validateMessage(value);
        else if(key === "companyName") errorMessage = validateCompanyName(value, isInvoicePayment);
        else if(key === "ico") errorMessage = validateICO(value, isInvoicePayment);
        else if(key === "dic") errorMessage = validateDIC(value, isInvoicePayment);
        else if(key === "address") errorMessage = validateAddress(value, isInvoicePayment);
        
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

    const firstName = inputs.firstName.value.trim();
    const lastName = inputs.lastName.value.trim();
    const email = inputs.email.value.trim();
    const dob = inputs.dob.value.trim();
    //const age = inputs.age.value.trim(); //?????
    const sport = inputs.sport.value;
    const space = inputs.space.value;
    const time = inputs.time.value;
    const terms = inputs.terms.checked;
    const message = inputs.message.value.trim();
    const isInvoicePayment = inputs.paymentInvoice.checked;
    const companyName = inputs.companyName.value.trim();
    const ico = inputs.ico.value.trim();
    const dic = inputs.dic.value.trim();
    const address = inputs.address.value.trim();

    const validateErrors = {
            firstName: validateFirstName(firstName),
            lastName: validateLastName(lastName),
            email: validateEmail(email),
            dob: validateDob(dob),
            //age: validateAge(age), //?????
            sport: validateSport(sport),
            space: validateSpace(space),
            time: validateTime(time),
            terms: validateTerms(terms),
            message: validateMessage(message),
            companyName: validateCompanyName(companyName, isInvoicePayment),
            ico: validateICO(ico, isInvoicePayment),
            dic: validateDIC(dic, isInvoicePayment),
            address: validateAddress(address, isInvoicePayment)
    };

    let hasError = false;
    Object.keys(validateErrors).forEach(key => {
        if(validateErrors[key]){
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
        console.log('FORMULÁR SA ODOSIELA!');
        form.submit();
    }
    
});