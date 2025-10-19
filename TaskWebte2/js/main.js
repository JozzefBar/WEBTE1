console.log('Main JS loaded');

// Data structure for sports, spaces, and time slots
const sportData = {
    Football: {
        name: "Futbal",
        spaces: {
            small_playground: {
                name: "Malé ihrisko",
                slots: [
                    { time: "8:00-10:00", price: 20 },
                    { time: "10:00-12:00", price: 25 },
                    { time: "14:00-16:00", price: 30 },
                    { time: "16:00-18:00", price: 35 }
                ]
            },
            big_playground: {
                name: "Veľké ihrisko",
                slots: [
                    { time: "8:00-10:00", price: 35 },
                    { time: "10:00-12:00", price: 40 },
                    { time: "14:00-16:00", price: 45 },
                    { time: "16:00-18:00", price: 50 }
                ]
            },
            indoor_hall: {
                name: "Halová hala",
                slots: [
                    { time: "8:00-10:00", price: 40 },
                    { time: "10:00-12:00", price: 45 },
                    { time: "14:00-16:00", price: 50 }
                ]
            }
        }
    },
    Basketball: {
        name: "Basketbal",
        spaces: {
            hall_a: {
                name: "Hala A",
                slots: [
                    { time: "9:00-11:00", price: 30 },
                    { time: "11:00-13:00", price: 35 },
                    { time: "15:00-17:00", price: 40 },
                    { time: "17:00-19:00", price: 45 }
                ]
            },
            hall_b: {
                name: "Hala B",
                slots: [
                    { time: "9:00-11:00", price: 25 },
                    { time: "11:00-13:00", price: 30 },
                    { time: "15:00-17:00", price: 35 }
                ]
            },
            outdoor_playground: {
                name: "Vonkajšie ihrisko",
                slots: [
                    { time: "8:00-10:00", price: 15 },
                    { time: "10:00-12:00", price: 20 },
                    { time: "14:00-16:00", price: 25 }
                ]
            }
        }
    },
    Tenis: {
        name: "Tenis",
        spaces: {
            court_1: {
                name: "Kurt 1 (antuka)",
                slots: [
                    { time: "7:00-8:00", price: 12 },
                    { time: "8:00-9:00", price: 15 },
                    { time: "9:00-10:00", price: 15 },
                    { time: "10:00-11:00", price: 18 },
                    { time: "17:00-18:00", price: 20 }
                ]
            },
            court_2: {
                name: "Kurt 2 (antuka)",
                slots: [
                    { time: "7:00-8:00", price: 12 },
                    { time: "8:00-9:00", price: 15 },
                    { time: "9:00-10:00", price: 15 }
                ]
            },
            court_3: {
                name: "Kurt 3 (tvrdý povrch)",
                slots: [
                    { time: "8:00-9:00", price: 18 },
                    { time: "9:00-10:00", price: 18 },
                    { time: "10:00-11:00", price: 20 }
                ]
            }
        }
    },
    Swimming: {
        name: "Plávanie",
        spaces: {
            pool_25m: {
                name: "Bazén 25m (dráha)",
                slots: [
                    { time: "6:00-7:00", price: 8 },
                    { time: "7:00-8:00", price: 10 },
                    { time: "12:00-13:00", price: 12 },
                    { time: "18:00-19:00", price: 15 }
                ]
            },
            pool_50m: {
                name: "Bazén 50m (olympijský)",
                slots: [
                    { time: "6:00-7:00", price: 12 },
                    { time: "7:00-8:00", price: 15 },
                    { time: "12:00-13:00", price: 18 }
                ]
            },
            recreational_pool: {
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
    bookingDate: document.getElementById('bookingDate'),
    sport: document.getElementById('sport'),
    space: document.getElementById('space'),
    time: document.getElementById('time'),
    otherEquipmentCheckbox: document.getElementById('otherEquipmentCheckbox'),
    otherEquipmentInput: document.getElementById('otherEquipmentInput'),
    message: document.getElementById('message'),
    paymentCash: document.getElementById('paymentCash'),
    paymentCard: document.getElementById('paymentCard'),
    paymentInvoice: document.getElementById('paymentInvoice'),
    cardFields: document.getElementById('paymentCard'),
    cardNumber: document.getElementById('cardNumber'),
    cardExpiry: document.getElementById('cardExpiry'),
    cardCvv: document.getElementById('cardCvv'),
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
    bookingDate: document.getElementById('bookingDateError'),
    sport: document.getElementById('sportError'),
    space: document.getElementById('spaceError'),
    time: document.getElementById('timeError'),
    gender: document.getElementById('genderError'),
    equipment: document.getElementById('equipmentError'),
    otherEquipment: document.getElementById('otherEquipmentError'),
    message: document.getElementById('messageError'),
    payment: document.getElementById('paymentError'),
    companyName: document.getElementById('companyNameError'),
    cardNumber: document.getElementById('cardNumberError'),
    cardExpiry: document.getElementById('cardExpiryError'),
    cardCvv: document.getElementById('cardCvvError'),
    ico: document.getElementById('icoError'),
    dic: document.getElementById('dicError'),
    address: document.getElementById('addressError')
}

// Validation functions
function validateFirstName(value) {
    if (!value.trim()) return "Meno je povinné";
    if (value.length < 3) return "Meno musí mať aspoň 3 znaky";
    return "";
}

function validateLastName(value) {
    if (!value.trim()) return "Priezvisko je povinné";
    if (value.length < 3) return "Priezvisko musí mať aspoň 3 znaky";
    return "";
}

function validateEmail(value) {
    if (!value.trim()) return "Email je povinný";

    // ^[^\s@]{3,}     - min 3 characters before @
    // @               - at symbol
    // [^\s@]+         - first part of domain (e.g., "example")
    // \.              - dot
    // [a-zA-Z]{2,4}$  - top-level domain 2-4 characters

    const pattern = /^[^\s@]{3,}@[^\s@]+\.[a-zA-Z]{2,4}$/;

    if (!pattern.test(value)) return "Neplatný formát emailu";
    return "";
}

function validatePhone(prefix, number) {
    if (prefix && !number.trim()) return "Telefónne číslo je povinné";
    if (number.trim() && !prefix) return "Predvoľba je povinná";
    if (!prefix && !number.trim()) return "";
    if (prefix && (number.length < 6 || number.length > 15)) return "Telefónne číslo musí mať 6-15 číslic";
    return "";
}

function validateDob(value) {
    if (!value.trim()) return "Dátum narodenia je povinný";
    const dob = new Date(value);
    const today = new Date();
    if (dob >= today) return "Dátum narodenia musí byť v minulosti";

    const age = calculateAgeFromDob(dob);
    if (age < 15) return "Musíte mať aspoň 15 rokov";

    return "";
}

function validateBookingDate(value) {
    if (!value) return "Dátum rezervácie je povinný";

    const chosen = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const min = new Date(today);
    min.setDate(today.getDate() + 1);
    if (chosen < min) return "Neplatný dátum rezervácie, rezervovať sa dá najskôr na zajtra";

    return "";
}

function digitsOnly(str) { return (str || "").replace(/\D/g, ""); }     //???? treba ak mam pole kde sa dajú písať iba čísla????

// Luhn check pre číslo karty
function luhnCheck(cardNumStr) {
    const s = digitsOnly(cardNumStr);
    let sum = 0;
    let alt = false;
    for (let i = s.length - 1; i >= 0; i--) {
        let n = parseInt(s.charAt(i), 10);
        if (alt) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alt = !alt;
    }
    return s.length >= 12 && sum % 10 === 0; // minimálna dĺžka 12 pre bezpečnosť
}

// expiry: input type="month" vracia "YYYY-MM"
function isExpiryValid(value) {
    if (!value) return false;
    const [y, m] = value.split('-').map(Number);
    if (!y || !m) return false;
    // first day of next month after expiry should be > now
    const exp = new Date(y, m - 1, 1);
    // set to first of month after expiry
    const expAfter = new Date(exp.getFullYear(), exp.getMonth() + 1, 1);
    const now = new Date();
    // normalize today to start of day
    if (expAfter <= new Date(now.getFullYear(), now.getMonth(), now.getDate())) return false;
    return true;
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

function validateGender() {
    const genderRadio = document.querySelectorAll('input[name="gender"]');
    const checked = Array.from(genderRadio).some(radio => radio.checked)
    if (!checked) return "Musíte vybrať pohlavie";
    return "";
}

function validateOtherEquipment(value, isOtherChecked) {
    if (value.length > 60) return "Správa nesmie presiahnuť 60 znakov"
    if (isOtherChecked && !value.trim()) return "Musíte uviesť aké iné vybavenie potrebujete";
    return "";
}

function validateMessage(value) {
    if (value.length > 500) return "Správa nesmie presiahnuť 500 znakov";
    return "";
}

function validatePayment() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const checked = Array.from(paymentRadios).some(radio => radio.checked);

    if (!checked) return "Musíte vybrať spôsob platby";
    return "";
}

function validateCardNumber(value, isCardPayment) {
    const digits = digitsOnly(value);
    if (!digits && isCardPayment) return "Číslo karty je povinné";
    if ((digits.length < 13 || digits.length > 19) && isCardPayment) return "Číslo karty musí mať 13–19 číslic";
    if (!luhnCheck(value) && isCardPayment) return "Neplatné číslo karty";
    return "";
}

function validateCardExpiry(value, isCardPayment) {
    if (!value && isCardPayment) return "Dátum platnosti je povinný";
    if (!isExpiryValid(value) && isCardPayment) return "Karta je expirovaná alebo dátum je neplatný";
    return "";
}

function validateCardCvv(value, isCardPayment) {
    const d = digitsOnly(value);
    if (!d && isCardPayment) return "CVV je povinné";
    if ((d.length < 3 || d.length > 4) && isCardPayment) return "CVV musí mať 3 alebo 4 čísla";
    return "";
}

function validateCompanyName(value, isInvoicePayment) {
    if (isInvoicePayment && !value.trim()) return "Názov spoločnosti je povinný pri platbe faktúrou";
    return "";
}

function validateICO(value, isInvoicePayment) {
    if (isInvoicePayment && !value.trim()) return "IČO je povinné pri platbe faktúrou";
    if (isInvoicePayment && !/^\d{8}$/.test(value)) return "IČO musí mať 8 číslic";
    return "";
}

function validateDIC(value, isInvoicePayment) {
    if (isInvoicePayment && !value.trim()) return "DIČ je povinné pri platbe faktúrou";
    if (isInvoicePayment && !/^\d{10}$/.test(value)) return "DIČ musí mať 10";
    return "";
}

function validateAddress(value, isInvoicePayment) {
    if (isInvoicePayment && !value.trim()) return "Adresa je povinná pri platbe faktúrou";
    return "";
}

// Age calculation based on DOB
function calculateAgeFromDob(dobValue) {
    if (!dobValue) return "";
    const today = new Date();
    let age = today.getFullYear() - dobValue.getFullYear();
    const monthDiff = today.getMonth() - dobValue.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobValue.getDate()))
        age--;
    return age;
}

// function to show/hide error
function showError(element, errorElement, errorMessage) {
    if (errorElement)
        errorElement.textContent = errorMessage || "";

    if (errorMessage) {
        element.classList.add('error');
        element.classList.remove('valid');
    }
    else {
        element.classList.remove('error');
        element.classList.add('valid');
    }
}

// Utility functions
function clearFieldState(element, errorElement) {
    errorElement.textContent = "";
    element.classList.remove('error', 'valid');
}

function clearInvoiceFields() {
    inputs.companyName.value = '';
    inputs.ico.value = '';
    inputs.dic.value = '';
    inputs.address.value = '';
    errors.companyName.textContent = '';
    errors.ico.textContent = '';
    errors.dic.textContent = '';
    errors.address.textContent = '';
    inputs.companyName.classList.remove('error', 'valid');
    inputs.ico.classList.remove('error', 'valid');
    inputs.dic.classList.remove('error', 'valid');
    inputs.address.classList.remove('error', 'valid');
}

function clearCardFields() {
    inputs.cardNumber.value = '';
    inputs.cardExpiry.value = '';
    inputs.cardCvv.value = '';
    errors.cardNumber.textContent = '';
    errors.cardExpiry.textContent = '';
    errors.cardCvv.textContent = '';
    inputs.cardNumber.classList.remove('error', 'valid');
    inputs.cardExpiry.classList.remove('error', 'valid');
    inputs.cardCvv.classList.remove('error', 'valid');
}

function updateRadioGroupState(radioGroup, errorElement, hasError) {
    errorElement.textContent = hasError;
    radioGroup.forEach(radio => {
        if (hasError) {
            radio.classList.add('error');
            radio.classList.remove('valid');
        } else {
            radio.classList.remove('error');
            radio.classList.add('valid');
        }
    });
}

// Sport selection
inputs.sport.addEventListener('change', function () {
    const selectedSport = this.value;
    const errorMessage = validateSport(selectedSport);
    showError(inputs.sport, errors.sport, errorMessage);

    inputs.space.innerHTML = '<option value="">Najprv vyberte šport</option>';
    inputs.time.innerHTML = '<option value="">Najprv vyberte priestor</option>';
    inputs.space.disabled = true;
    inputs.time.disabled = true;
    clearFieldState(inputs.space, errors.space);
    clearFieldState(inputs.time, errors.time);

    if (selectedSport && sportData[selectedSport]) {
        inputs.space.innerHTML = '<option value="">Vyberte priestor</option>';
        const spaces = sportData[selectedSport].spaces;
        for (const [key, space] of Object.entries(spaces)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = space.name;
            inputs.space.appendChild(option);
        }
        inputs.space.disabled = false;
    }
});

// Space selection
inputs.space.addEventListener('change', function () {
    const selectedSport = inputs.sport.value;
    const selectedSpace = this.value;
    const errorMessage = validateSpace(selectedSpace);
    showError(inputs.space, errors.space, errorMessage);

    inputs.time.disabled = true;
    clearFieldState(inputs.time, errors.time);

    if (selectedSpace && sportData[selectedSport]) {
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

// Time selection
inputs.time.addEventListener('change', function () {
    const errorMsg = validateTime(this.value);
    showError(this, errors.time, errorMsg);
});

// Gender selection
const genderRadio = document.querySelectorAll('input[name="gender"]');
genderRadio.forEach(radio => {
    radio.addEventListener('change', function () {
        const errorMsg = validateGender();
        updateRadioGroupState(genderRadio, errors.gender, errorMsg);
    });
});

// Other equipment checkbox
const otherEquipmentContainer = document.getElementById('otherEquipmentContainer');
inputs.otherEquipmentCheckbox.addEventListener('change', function () {
    if (this.checked)
        otherEquipmentContainer.style.display = 'block';
    else {
        otherEquipmentContainer.style.display = 'none';
        inputs.otherEquipmentInput.value = '';
        clearFieldState(inputs.otherEquipmentInput, errors.otherEquipment);
    }
});

inputs.otherEquipmentInput.addEventListener('input', function () {
    const err = validateOtherEquipment(this.value, inputs.otherEquipmentCheckbox.checked);
    showError(this, errors.otherEquipment, err);
});

// Payment method selection
const paymentRadio = document.querySelectorAll('input[name="payment"]');
const invoiceFields = document.getElementById('invoiceFields');
const cardFields = document.getElementById('cardFields');

function hide(el) { if (el) el.style.display = 'none'; }
function show(el) { if (el) el.style.display = 'block'; }

function handlePaymentChange() {
    const err = validatePayment();
    updateRadioGroupState(paymentRadio, errors.payment, err);

    // dôležité: zober hodnotu vybraného rádia
    const selected = document.querySelector('input[name="payment"]:checked')?.value;

    if (selected === 'invoice') {
        show(invoiceFields);
        hide(cardFields);
        clearCardFields();

    } else if (selected === 'card') {
        show(cardFields);
        hide(invoiceFields);
        clearInvoiceFields();

    } else { // napr. 'cash' alebo nič  
        hide(invoiceFields); clearInvoiceFields();
        hide(cardFields); clearCardFields();
    }
}
paymentRadio.forEach(r => r.addEventListener('change', handlePaymentChange));

// Author name toggle
const showAuthorBtn = document.getElementById('showAuthorBtn');
showAuthorBtn.addEventListener('click', function () {
    const authorName = inputs.authorName;
    if (authorName.style.display === 'none') {
        authorName.style.display = 'block';
        showAuthorBtn.textContent = 'Skryť autora formulára';
    } else {
        authorName.style.display = 'none';
        showAuthorBtn.textContent = 'Zobraziť autora formulára';
    }
});

// Real-time validation - define validation handlers for each field
const validationHandlers = {
    firstName: (value) => validateFirstName(value),
    lastName: (value) => validateLastName(value),
    email: (value) => validateEmail(value),
    phonePrefix: (value) => validatePhone(value, inputs.phoneNumber.value),
    phoneNumber: (value) => validatePhone(inputs.phonePrefix.value, value),
    dob: (value) => {
        const errorMsg = validateDob(value);
        if (!errorMsg && value) {
            inputs.age.value = calculateAgeFromDob(new Date(value));
        }
        return errorMsg;
    },
    bookingDate: (value) => validateBookingDate(value),
    otherEquipmentInput: (value) => validateOtherEquipment(value, inputs.otherEquipmentCheckbox.checked),
    message: (value) => validateMessage(value),
    cardNumber: (value) => validateCardNumber(value, inputs.paymentCard.checked),
    cardExpiry: (value) => validateCardExpiry(value, inputs.paymentCard.checked),
    cardCvv: (value) => validateCardCvv(value, inputs.paymentCard.checked),
    companyName: (value) => validateCompanyName(value, inputs.paymentInvoice.checked),
    ico: (value) => validateICO(value, inputs.paymentInvoice.checked),
    dic: (value) => validateDIC(value, inputs.paymentInvoice.checked),
    address: (value) => validateAddress(value, inputs.paymentInvoice.checked)
};

// Attach input listeners only to fields with validation handlers
Object.keys(validationHandlers).forEach(key => {
    if (inputs[key]) {
        inputs[key].addEventListener('input', function () {
            const errorMessage = validationHandlers[key](this.value);
            showError(this, errors[key], errorMessage);
        });
    }
});

// function to update character count
function updateCharCount(inputElement, countElement, maxLength) {
    if (!countElement) return;

    const currentLength = inputElement.value.length;
    countElement.textContent = `${currentLength} / ${maxLength}`;

    if (currentLength >= maxLength)
        countElement.style.color = 'red';
    else if (currentLength >= maxLength * 0.85)
        countElement.style.color = 'orange';
    else
        countElement.style.color = '#666';
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
    { input: inputs.companyName, counter: document.getElementById('compNameCount'), max: 50 },
    { input: inputs.otherEquipmentInput, counter: document.getElementById('otherEquipmentCount'), max: 60 },
    { input: inputs.cardNumber, counter: document.getElementById('cardNumberCount'), max: 16 },
    { input: inputs.cardCvv, counter: document.getElementById('cardCvvCount'), max: 3 }
]

charCounters.forEach(item => {
    if (item.input && item.counter) {
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

function generateOrderSummary() {
    let summary = "";
    let totalPrice = 0;

    summary += '<h3>Osobné údaje</h3>';
    if (inputs.firstName.value)
        summary += `<div class="summary-item"><strong>Meno:</strong><span>${inputs.firstName.value}</span></div>`;
    if (inputs.lastName.value)
        summary += `<div class="summary-item"><strong>Priezvisko:</strong><span>${inputs.lastName.value}</span></div>`;
    if (inputs.email.value)
        summary += `<div class="summary-item"><strong>Email:</strong><span>${inputs.email.value}</span></div>`;

    const genderRadio = document.querySelector('input[name="Gender"]:checked');
    if (genderRadio) {
        const genderText = genderRadio.value === 'male' ? 'Muž' : genderRadio.value === 'female' ? 'Žena' : 'Iné';
        summary += `<div class="summary-item"><strong>Pohlavie:</strong><span>${genderText}</span></div>`;
    }

    if (inputs.dob.value)
        summary += `<div class="summary-item"><strong>Dátum narodenia:</strong><span>${inputs.dob.value}</span></div>`;
    if (inputs.age.value)
        summary += `<div class="summary-item"><strong>Vek:</strong><span>${inputs.age.value} rokov</span></div>`;
    if (inputs.phoneNumber.value && inputs.phonePrefix.value)
        summary += `<div class="summary-item"><strong>Telefón:</strong><span>${inputs.phonePrefix.value} ${inputs.phoneNumber.value}</span></div>`;

    summary += '<h3>Rezervácia</h3>';

    if (inputs.bookingDate.value) {
        summary += `<div class="summary-item"><strong>Dátum rezervácie:</strong><span>${inputs.bookingDate.value}</span></div>`;
    }

    if (inputs.sport.value) {
        const sportName = sportData[inputs.sport.value].name;
        summary += `<div class="summary-item"><strong>Šport:</strong><span>${sportName}</span></div>`;
    }
    if (inputs.space.value && inputs.sport.value) {
        const spaceName = sportData[inputs.sport.value].spaces[inputs.space.value].name;
        summary += `<div class="summary-item"><strong>Priestor:</strong><span>${spaceName}</span></div>`;
    }
    if (inputs.time.value && inputs.space.value && inputs.sport.value) {
        const [time, price] = inputs.time.value.split('|');
        totalPrice += parseFloat(price);
        summary += `<div class="summary-item"><strong>Čas:</strong><span>${time}</span></div>`;
        summary += `<div class="summary-item"><strong>Cena:</strong><span>${price} €</span></div>`;
    }

    const checkedEquipment = document.querySelectorAll('.equipment-checkbox:checked');
    if (checkedEquipment.length > 0) {
        summary += '<h3>Požičané vybavenie</h3>';
        checkedEquipment.forEach(checkbox => {
            if (checkbox.id === 'otherEquipmentCheckbox' && inputs.otherEquipmentInput.value)
                summary += `<div class="summary-item"><strong>Iné vybavenie:</strong><span>${inputs.otherEquipmentInput.value}</span></div>`;
            else if (checkbox.id !== 'otherEquipmentCheckbox') {
                const label = checkbox.parentElement.textContent.trim();
                summary += `<div class="summary-item"><strong>✓</strong><span>${label}</span></div>`;
            }
        });
    }

    summary += '<h3>Platba</h3>';
    const paymentRadio = document.querySelector('input[name="payment"]:checked');
    if (paymentRadio) {
        let paymentText = "";
        if (paymentRadio.id === 'paymentCash') paymentText = "Hotovosť";
        else if (paymentRadio.id === 'paymentCard') paymentText = "Platobná karta";
        else if (paymentRadio.id === 'paymentInvoice') paymentText = "Platba na faktúru";

        summary += `<div class="summary-item"><strong>Spôsob platby:</strong><span>${paymentText}</span></div>`;

        if (paymentRadio.value === 'invoice') {
            if (inputs.companyName.value)
                summary += `<div class="summary-item"><strong>Názov spoločnosti:</strong><span>${inputs.companyName.value}</span></div>`;
            if (inputs.ico.value)
                summary += `<div class="summary-item"><strong>IČO:</strong><span>${inputs.ico.value}</span></div>`;
            if (inputs.dic.value)
                summary += `<div class="summary-item"><strong>DIČ:</strong><span>${inputs.dic.value}</span></div>`;
            if (inputs.address.value)
                summary += `<div class="summary-item"><strong>Adresa:</strong><span>${inputs.address.value}</span></div>`;
        }
        else if (paymentRadio.value === 'card') {
            if (inputs.cardNumber.value)
                summary += `<div class="summary-item"><strong>Číslo karty:</strong><span>${inputs.cardNumber.value}</span></div>`;
            if (inputs.cardExpiry.value)
                summary += `<div class="summary-item"><strong>Dátum platnosti:</strong><span>${inputs.cardExpiry.value}</span></div>`;
            if (inputs.cardCvv.value)
                summary += `<div class="summary-item"><strong>Cvv:</strong><span>${inputs.cardCvv.value}</span></div>`;
        }
    }

    if (inputs.message.value) {
        summary += '<h3>Dodatočná správa</h3>';
        summary += `<div class="summary-item"><span style="font-style: italic;">${inputs.message.value}</span></div>`;
    }

    orderSummary.innerHTML = summary;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)}`;
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
    const bookingDate = inputs.bookingDate.value.trim();
    const sport = inputs.sport.value;
    const space = inputs.space.value;
    const time = inputs.time.value;
    const isOtherEquipmentChecked = inputs.otherEquipmentCheckbox.checked;
    const otherEquipment = inputs.otherEquipmentInput.value.trim();
    const message = inputs.message.value.trim();
    const isInvoicePayment = inputs.paymentInvoice.checked;
    const isCardPayment = inputs.paymentCard.checked;
    const cardNumber = inputs.cardNumber.value.trim();
    const cardExpiry = inputs.cardExpiry.value.trim();
    const cardCvv = inputs.cardCvv.value.trim();
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
        bookingDate: validateBookingDate(bookingDate),
        sport: validateSport(sport),
        space: validateSpace(space),
        time: validateTime(time),
        gender: validateGender(),
        otherEquipment: validateOtherEquipment(otherEquipment, isOtherEquipmentChecked),
        message: validateMessage(message),
        payment: validatePayment(),
        cardNumber: validateCardNumber(cardNumber, isCardPayment),
        cardExpiry: validateCardExpiry(cardExpiry, isCardPayment),
        cardCvv: validateCardCvv(cardCvv, isCardPayment),
        companyName: validateCompanyName(companyName, isInvoicePayment),
        ico: validateICO(ico, isInvoicePayment),
        dic: validateDIC(dic, isInvoicePayment),
        address: validateAddress(address, isInvoicePayment)
    };

    let hasError = false;
    Object.keys(validateErrors).forEach(key => {
        if (validateErrors[key]) {
            errors[key].textContent = validateErrors[key];
            if (inputs[key]) {
                inputs[key].classList.add('error');
                inputs[key].classList.remove('valid');
            }
            hasError = true;
        }
        else {
            errors[key].textContent = "";
            if (inputs[key]) {
                inputs[key].classList.remove('error');
                inputs[key].classList.add('valid');
            }
        }
    });

    if (!hasError) {
        generateOrderSummary();
        modal.style.display = 'block';
    }
});

// Modal button event listeners
confirmBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    form.submit();
});
cancelBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});
window.addEventListener('click', function (event) {
    if (event.target === modal)
        modal.style.display = 'none';
});
