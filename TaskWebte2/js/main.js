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
    phonePrefix: document.getElementById('phonePrefix'),
    phoneNumber: document.getElementById('phoneNumber'),
    dob: document.getElementById('dob'),
    age: document.getElementById('age'),
    sport: document.getElementById('sport'),
    space: document.getElementById('space'),
    time: document.getElementById('time'),
    otherEquipmentCheckbox: document.getElementById('otherEquipmentCheckbox'),
    otherEquipmentInput: document.getElementById('otherEquipmentInput'),
    message: document.getElementById('message'),
    paymentCash: document.getElementById('paymentCash'),
    paymentCard: document.getElementById('paymentCard'),
    paymentInvoice: document.getElementById('paymentInvoice'),
    companyName: document.getElementById('companyName'),
    ico: document.getElementById('ico'),
    dic: document.getElementById('dic'),
    address: document.getElementById('address'),
    authorName: document.getElementById('authorName')
}

const errors = {
    firstName: document.getElementById('firstNameError'),
    lastName: document.getElementById('lastNameError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    dob: document.getElementById('dobError'),
    sport: document.getElementById('sportError'),
    space: document.getElementById('spaceError'),
    time: document.getElementById('timeError'), 
    gender: document.getElementById('genderError'),
    equipment: document.getElementById('equipmentError'),
    otherEquipment: document.getElementById('otherEquipmentError'),
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

function validatePhone(prefix, number) {
    if(prefix && !number.trim()) return "Telefónne číslo je povinné";
    if(number.trim() && !prefix) return "Predvoľba je povinná";
    if(!prefix && !number.trim()) return "";
    if(prefix && (number.length < 6 || number.length > 15)) return "Telefónne číslo musí mať 6-15 číslic";
    return "";
}

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

function validateGender(){
    const genderRadios = document.querySelectorAll('input[name="Pohlavie"]');
    const checked = Array.from(genderRadios).some(radio => radio.checked)
    if(!checked) return "Musíte vybrať pohlavie";
    return "";
}

function validateOtherEquipment(value, isOtherChecked){
    if(isOtherChecked && !value.trim()) return "Musíte uviesť aké iné vybavenie potrebujete";
    return "";
}

function validateMessage(value){
    if(value.length > 500) return "Správa nesmie presiahnuť 500 znakov";
    return "";
}

function validatePayment() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const checked = Array.from(paymentRadios).some(radio => radio.checked);
    
    if(!checked) return "Musíte vybrať spôsob platby";
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
    inputs.space.innerHTML = '<option value="">Najprv vyberte šport</option>';
    inputs.time.innerHTML = '<option value="">Najprv vyberte priestor</option>';

    inputs.space.disabled = true;
    inputs.time.disabled = true;

    errors.space.textContent = "";
    errors.time.textContent = "";
    inputs.space.classList.remove('error', 'valid');
    inputs.time.classList.remove('error', 'valid');

    if(selectedSport && sportData[selectedSport]){
        inputs.space.innerHTML = '<option value="">Vyberte priestor</option>';
        inputs.time.innerHTML = '<option value="">Najprv vyberte priestor</option>';
        
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
    errors.time.textContent = errorMsg;
    showError(this, errors.cas, errorMsg);

});

// Event listener pre výber pohlavia
const genderRadios = document.querySelectorAll('input[name="Pohlavie"]');
genderRadios.forEach(radio => {
    radio.addEventListener('change', function(){
        const errorMsg = validateGender();
        errors.gender.textContent = errorMsg;
        genderRadios.forEach(r => {
            if(errorMsg){
                r.classList.add('error');
                r.classList.remove('valid');
            }
            else{
                r.classList.remove('error');
                r.classList.add('valid');
            }
        });
    });
});

// Event listener pre iné vybavenie
const otherEquipmentContainer = document.getElementById('otherEquipmentContainer');

inputs.otherEquipmentCheckbox.addEventListener('change', function(){
    if(this.checked){
        otherEquipmentContainer.style.display = 'block';
        inputs.otherEquipmentInput.focus();
    }
    else{
        otherEquipmentContainer.style.display = 'none';
        inputs.otherEquipmentInput.value = '';
        errors.otherEquipment.textContent = '';
        inputs.otherEquipmentInput.classList.remove('error', 'valid');
    }
});

// Event listener pre prepínanie platobných metód
const paymentRadio = document.querySelectorAll('input[name="payment"]');
paymentRadio.forEach(radio => {
    radio.addEventListener('change', function(){
        const errorMsg = validatePayment();
        errors.payment.textContent = errorMsg;
        paymentRadio.forEach(r => {
            if(errorMsg){
                r.classList.add('error');
                r.classList.remove('valid');
            }   
            else{
                r.classList.remove('error');
                r.classList.add('valid');
            }
        });
    });
});

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

//event listener pre zobrazenie mena autora
const showAuthorBtn = document.getElementById('showAuthorBtn');
showAuthorBtn.addEventListener('click', function(){
    const authorName = inputs.authorName;
    if(authorName.style.display === 'none'){
        authorName.style.display = 'block';
        showAuthorBtn.textContent = 'Skryť autora formulára';
    }
    else{
        authorName.style.display = 'none';
        showAuthorBtn.textContent = 'Zobraziť autora formulára';
    }
});

// Event listeners for real-time validation
Object.keys(inputs).forEach(key => {
    if(key === 'sport' || key === 'space' || key === 'time' || 
       key === 'paymentCash' || key === 'paymentCard' || key === 'paymentInvoice' ||
       key === 'otherEquipmentCheckbox') return;

    inputs[key].addEventListener('input', () => {
        const value = inputs[key].value;
        let errorMessage = "";
        const isInvoicePayment = inputs.paymentInvoice.checked;
        const isOtherEquipmentChecked = inputs.otherEquipmentCheckbox.checked;
        const prefix = inputs.phonePrefix.value;

        if(key === "firstName") errorMessage = validateFirstName(value);
        else if(key === "lastName") errorMessage = validateLastName(value);
        else if(key === "email") errorMessage = validateEmail(value);
        else if(key === "phoneNumber") errorMessage = validatePhone(prefix, value);
        else if(key === "dob"){
            errorMessage = validateDob(value);
            if(!errorMessage && value){
                const age = calculateAgeFromDob(new Date(value));
                inputs.age.value = age;
            }
        }
        else if(key === "otherEquipmentInput") errorMessage = validateOtherEquipment(value, isOtherEquipmentChecked);
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

// function to update character count
function updateCharCount(inputElement, countElement, maxLength) {
    if(!countElement) return;

    const currentLength = inputElement.value.length;
    countElement.textContent = `${currentLength} / ${maxLength}`;

    if(currentLength >= maxLength * 0.9) {
        countElement.style.color = 'orange';
    } else if(currentLength === maxLength) {
        countElement.style.color = 'red';
    } else {
        countElement.style.color = '#666';
    }
}

const charCounters = [
    { input: inputs.firstName, counter: document.getElementById('firstNameCount'), max: 40 },
    { input: inputs.lastName, counter: document.getElementById('lastNameCount'), max: 40 },
    { input: inputs.email, counter: document.getElementById('emailCount'), max: 50 },
    { input: inputs.phoneNumber, counter: document.getElementById('phoneNumberCount'), max: 15 },
    { input: inputs.message, counter: document.getElementById('messageCount'), max: 500 },
    { input: inputs.ico, counter: document.getElementById('icoCount'), max: 8 },
    { input: inputs.dic, counter: document.getElementById('dicCount'), max: 10 },
    { input: inputs.address, counter: document.getElementById('addrCount'), max: 30 },
    { input: inputs.companyName, counter: document.getElementById('compNameCount'), max: 50 }
];

charCounters.forEach(item => {
    if(item.input && item.counter) {
        updateCharCount(item.input, item.counter, item.max);
        
        item.input.addEventListener('input', () => {
            updateCharCount(item.input, item.counter, item.max);
        });
    }
});


// Whole section for Modal
const modal = document.getElementById('orderModal');
const orderSummary = document.getElementById('orderSummary');
const totalPriceElement = document.getElementById('totalPrice');
const confirmBtn = document.getElementById('confirmOrder');
const cancelBtn = document.getElementById('cancelOrder');

function generateOrderSummary(){
    let summary = "";
    let totalPrice = 0;

    summary += '<h3>Osobné údaje</h3>';
    if(inputs.firstName.value)
        summary += `<div class="summary-item"><strong>Meno:</strong><span>${inputs.firstName.value}</span></div>`;
    if(inputs.lastName.value)
        summary += `<div class="summary-item"><strong>Priezvisko:</strong><span>${inputs.lastName.value}</span></div>`;
    if(inputs.email.value)
        summary += `<div class="summary-item"><strong>Email:</strong><span>${inputs.email.value}</span></div>`;

    const genderRatio = document.querySelector('input[name="Pohlavie"]:checked');
    if(genderRatio){
        const genderText = genderRadio.value === 'male' ? 'Muž' : genderRadio.value === 'female' ? 'Žena' : 'Iné';
        summary += `<div class="summary-item"><strong>Pohlavie:</strong><span>${genderText}</span></div>`;
    }

    if(inputs.dob.value)
        summary += `<div class="summary-item"><strong>Dátum narodenia:</strong><span>${inputs.dob.value}</span></div>`;
    if(inputs.age.value)
        summary += `<div class="summary-item"><strong>Vek:</strong><span>${inputs.age.value} rokov</span></div>`;
    if(inputs.phoneNumber.value && inputs.phonePrefix.value)
        summary += `<div class="summary-item"><strong>Telefón:</strong><span>${inputs.phonePrefix.value} ${inputs.phoneNumber.value}</span></div>`;

    summary += '<h3>Rezervácia</h3>';

    if(inputs.sport.value){
        const sportName = sportData[inputs.sport.value].name;
        summary += `<div class="summary-item"><strong>Šport:</strong><span>${sportName}</span></div>`;
    }
    if(inputs.space.value && inputs.sport.value){
        const spaceName = sportData[inputs.sport.value].spaces[inputs.space.value].name;
        summary += `<div class="summary-item"><strong>Priestor:</strong><span>${spaceName}</span></div>`;
    }
    if(inputs.time.value && inputs.space.value && inputs.sport.value){
        const [time, price] = inputs.time.value.split('|');
        totalPrice += parseFloat(price);
        summary += `<div class="summary-item"><strong>Čas:</strong><span>${time}</span></div>`;
        summary += `<div class="summary-item"><strong>Cena priestoru:</strong><span>${price} €</span></div>`;
    }

    const checkedEquipment = document.querySelectorAll('.equipment-checkbox:checked');
    if(checkedEquipment.length > 0){
        summary += '<h3>Požičané vybavenie</h3>';
        checkedEquipment.forEach(checkbox => {
            if(checkbox.id === 'otherEquipmentCheckbox' && inputs.otherEquipmentInput.value)
                summary += `<div class="summary-item"><strong>Iné vybavenie:</strong><span>${inputs.otherEquipmentInput.value}</span></div>`;
            else if(checkbox.id !== 'otherEquipmentCheckbox'){
                const label = checkbox.parentElement.textContent.trim();
                summary += `<div class="summary-item"><strong>✓</strong><span>${label}</span></div>`;
            }
        });
    }

    summary += '<h3>Platba</h3>';
    const paymentRadio = document.querySelector('input[name="payment"]:checked');
    if(paymentRadio){
        let paymentText = "";
        if(paymentRadio.id === 'paymentCash') paymentText = "Hotovosť";
        else if(paymentRadio.id === 'paymentCard') paymentText = "Platobná karta";
        else if(paymentRadio.id === 'paymentInvoice') paymentText = "Platba na faktúru";

        summary += `<div class="summary-item"><strong>Spôsob platby:</strong><span>${paymentText}</span></div>`;
    
        if(paymentRadio.value === 'invoice'){
            if(inputs.companyName.value)
                summary += `<div class="summary-item"><strong>Názov spoločnosti:</strong><span>${inputs.companyName.value}</span></div>`;
            if(inputs.ico.value)
                summary += `<div class="summary-item"><strong>IČO:</strong><span>${inputs.ico.value}</span></div>`;
            if(inputs.dic.value)
                summary += `<div class="summary-item"><strong>DIČ:</strong><span>${inputs.dic.value}</span></div>`;
            if(inputs.address.value)
                summary += `<div class="summary-item"><strong>Adresa:</strong><span>${inputs.address.value}</span></div>`;
        }
    }

    if (inputs.message.value){
        summary += '<h3>Dodatočná správa</h3>';
        summary += `<div class="summary-item"><span style="font-style: italic;">${inputs.message.value}</span></div>`;
    }

    orderSummary.innerHTML = summary;
    totalPriceElement.textContent = `Celková cena: ${totalPrice.toFixed(2)} €`;
}


// Form submission
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const firstName = inputs.firstName.value.trim();
    const lastName = inputs.lastName.value.trim();
    const email = inputs.email.value.trim();
    const phonePrefix = inputs.phonePrefix.value;
    const phoneNumber = inputs.phoneNumber.value.trim();
    const dob = inputs.dob.value.trim();
    const sport = inputs.sport.value;
    const space = inputs.space.value;
    const time = inputs.time.value;
    const isOtherEquipmentChecked = inputs.otherEquipmentCheckbox.checked;
    const otherEquipment = inputs.otherEquipmentInput.value.trim();
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
            phone: validatePhone(phonePrefix, phoneNumber),
            dob: validateDob(dob),
            sport: validateSport(sport),
            space: validateSpace(space),
            time: validateTime(time),
            gender: validateGender(),
            otherEquipment: validateOtherEquipment(otherEquipment, isOtherEquipmentChecked),
            message: validateMessage(message),
            payment: validatePayment(),
            companyName: validateCompanyName(companyName, isInvoicePayment),
            ico: validateICO(ico, isInvoicePayment),
            dic: validateDIC(dic, isInvoicePayment),
            address: validateAddress(address, isInvoicePayment)
    };

    let hasError = false;
    Object.keys(validateErrors).forEach(key => {
        if(validateErrors[key]){
            errors[key].textContent = validateErrors[key];
            if(inputs[key]) {
                inputs[key].classList.add('error');
                inputs[key].classList.remove('valid');
            }
            hasError = true;
        }
        else{
            errors[key].textContent = "";
            if(inputs[key]) {
                inputs[key].classList.remove('error');
                inputs[key].classList.add('valid');
            }
        }
    });

    if(!hasError){
        generateOrderSummary();
        modal.style.display = 'block';
    }
});

confirmBtn.addEventListener('click', function(){
    modal.style.display = 'none';
    form.submit(); 
});
cancelBtn.addEventListener('click', function(){
    modal.style.display = 'none';
});
window.addEventListener('click', function(event){
    if(event.target === modal)
        modal.style.display = 'none';
});
