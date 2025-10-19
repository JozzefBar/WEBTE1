console.log('Main JS loaded');

// Data structure for sports, spaces, and time slots
const sportData = {
    Football: {
        name: "Futbal",
        spaces: {
            small_playground: {
                name: "Malé ihrisko",
                slots: [
                    { time: "14:00-15:00", price: 20 },
                    { time: "15:00-16:00", price: 20 },
                    { time: "16:00-17:30", price: 28 },
                    { time: "17:30-19:30", price: 35 }
                ]
            },
            big_playground: {
                name: "Veľké ihrisko",
                slots: [
                    { time: "14:00-15:00", price: 35 },
                    { time: "15:00-16:00", price: 35 },
                    { time: "16:00-17:30", price: 48 },
                    { time: "17:30-19:30", price: 60 }
                ]
            },
            indoor_hall: {
                name: "Halová hala",
                slots: [
                    { time: "14:00-15:00", price: 40 },
                    { time: "15:00-16:00", price: 40 },
                    { time: "16:00-17:30", price: 55 },
                    { time: "17:30-19:30", price: 70 }
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
                    { time: "13:00-14:00", price: 30 },
                    { time: "14:00-15:00", price: 30 },
                    { time: "15:00-16:30", price: 42 },
                    { time: "16:30-18:30", price: 55 }
                ]
            },
            hall_b: {
                name: "Hala B",
                slots: [
                    { time: "13:00-14:00", price: 25 },
                    { time: "14:00-15:00", price: 25 },
                    { time: "15:00-16:30", price: 35 },
                    { time: "16:30-18:30", price: 45 }
                ]
            },
            outdoor_playground: {
                name: "Vonkajšie ihrisko",
                slots: [
                    { time: "14:00-15:00", price: 15 },
                    { time: "15:00-16:00", price: 15 },
                    { time: "16:00-17:30", price: 22 },
                    { time: "17:30-19:30", price: 30 }
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
                    { time: "14:00-15:00", price: 15 },
                    { time: "15:00-16:00", price: 15 },
                    { time: "16:00-17:30", price: 22 },
                    { time: "17:30-19:30", price: 30 }
                ]
            },
            court_2: {
                name: "Kurt 2 (antuka)",
                slots: [
                    { time: "14:00-15:00", price: 12 },
                    { time: "15:00-16:00", price: 12 },
                    { time: "16:00-17:30", price: 18 },
                    { time: "17:30-19:30", price: 25 }
                ]
            },
            court_3: {
                name: "Kurt 3 (tvrdý povrch)",
                slots: [
                    { time: "13:00-14:00", price: 18 },
                    { time: "14:00-15:00", price: 18 },
                    { time: "15:00-16:30", price: 26 },
                    { time: "16:30-18:30", price: 35 }
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
                    { time: "14:00-15:00", price: 10 },
                    { time: "15:00-16:00", price: 10 },
                    { time: "16:00-17:30", price: 15 },
                    { time: "17:30-19:30", price: 20 }
                ]
            },
            pool_50m: {
                name: "Bazén 50m (olympijský)",
                slots: [
                    { time: "14:00-15:00", price: 15 },
                    { time: "15:00-16:00", price: 15 },
                    { time: "16:00-17:30", price: 22 },
                    { time: "17:30-19:30", price: 30 }
                ]
            },
            recreational_pool: {
                name: "Rekreačný bazén",
                slots: [
                    { time: "13:00-14:00", price: 20 },
                    { time: "14:00-15:00", price: 20 },
                    { time: "15:00-16:30", price: 28 },
                    { time: "16:30-18:30", price: 38 }
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
    if (value.length > 40) return "Pole môže mať maximálne 40 znakov";
    return "";
}

function validateLastName(value) {
    if (!value.trim()) return "Priezvisko je povinné";
    if (value.length < 3) return "Priezvisko musí mať aspoň 3 znaky";
    if (value.length > 40) return "Pole môže mať maximálne 40 znakov";
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
    if (value.length > 50) return "Pole môže mať maximálne 50 znakov";
    return "";
}

function validatePhonePrefix(prefix, number) {
    if (!prefix && !number.trim()) return "";
    if (prefix && !number.trim()) return "";
    if (!prefix && number.trim() && number.length >= 6 && number.length <= 15) {
        return "Predvoľba je povinná";
    }
    return "";
}

// Prepísaná validácia pre phone number
function validatePhone(prefix, number) {
    if (!prefix && !number.trim()) return "";
    if (!number.trim() && prefix) return "Telefónne číslo je povinné";
    if (number.trim() && (number.length < 6 || number.length > 15)) {
        return "Telefónne číslo musí mať 6-15 číslic";
    }
    return "";
}

function validateDob(value) {
    if (!value.trim()) return "Dátum narodenia je povinný";
    const dob = new Date(value);
    const today = new Date();
    if (dob >= today) return "Dátum narodenia musí byť v minulosti";

    const age = calculateAgeFromDob(dob);
    if (age < 15) return "Musíte mať aspoň 15 rokov";
    if (age > 100) return "Neplatný dátum narodenia (vek nesmie presiahnuť 100 rokov)";

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

    const max = new Date(today);
    max.setMonth(today.getMonth() + 3);
    if (chosen > max) return "Rezervácia je možná maximálne 3 mesiace dopredu";

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
    if ((digits.length !== 16) && isCardPayment) return "Číslo karty musí mať 16 číslic";
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
    if ((d.length !== 3) && isCardPayment) return "CVV musí mať 3 čísla";
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
    if (isInvoicePayment && value.length > 60) return "Pole môže mať maximálne 60 znakov";
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

// Sync Age with the DOB
function syncAgeField(dobValue, dobError) {
    if (!dobError && dobValue) {
        const age = calculateAgeFromDob(new Date(dobValue));
        inputs.age.value = age;
        inputs.age.classList.remove('error');
        inputs.age.classList.add('valid');
    } else if (dobError) {
        inputs.age.value = "";
        inputs.age.classList.remove('valid');
        inputs.age.classList.add('error');
    } else {
        inputs.age.value = "";
        inputs.age.classList.remove('valid', 'error');
    }
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

function resetCharCount(inputElement, counterElement, maxLength, isExactMatch) {
    updateCharCount(inputElement, counterElement, maxLength, isExactMatch);
}

function updateRadioGroupState(radioGroup, errorElement, hasError) {
    errorElement.textContent = hasError;
    const fieldset = radioGroup[0].closest('fieldset');

    if (hasError) {
        if (fieldset) fieldset.classList.add('error');
        if (fieldset) fieldset.classList.remove('valid');
    } else {
        if (fieldset) fieldset.classList.remove('error');
        if (fieldset) fieldset.classList.add('valid');
    }
}

// Sport selection
inputs.sport.addEventListener('change', function () {
    const selectedSport = this.value;
    const errorMessage = validateSport(selectedSport);
    showError(inputs.sport, errors.sport, errorMessage);

    inputs.space.innerHTML = '<option value="">--Najprv vyberte šport--</option>';
    inputs.time.innerHTML = '<option value="">--Najprv vyberte priestor--</option>';
    inputs.space.disabled = true;
    inputs.time.disabled = true;
    clearFieldState(inputs.space, errors.space);
    clearFieldState(inputs.time, errors.time);

    if (selectedSport && sportData[selectedSport]) {
        inputs.space.innerHTML = '<option value="">--Vyberte priestor--</option>';
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
        inputs.time.innerHTML = '<option value="">--Vyberte čas--</option>';
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
        resetCharCount(inputs.otherEquipmentInput, document.getElementById('otherEquipmentCount'), 60, false);
    }
});

// Equipment checkboxes validation
const equipmentCheckboxes = document.querySelectorAll('input[name^="equipment"]');
equipmentCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const equipmentFieldset = this.closest('fieldset');

        const anyChecked = Array.from(equipmentCheckboxes).some(cb => cb.checked);
        const otherChecked = inputs.otherEquipmentCheckbox.checked;
        const otherText = inputs.otherEquipmentInput.value.trim();

        const isValid = anyChecked && (!otherChecked || otherText);

        if (equipmentFieldset) {
            if (isValid) {
                equipmentFieldset.classList.remove('error');
                equipmentFieldset.classList.add('valid');
            } else if (otherChecked && !otherText) {
                equipmentFieldset.classList.add('error');
                equipmentFieldset.classList.remove('valid');
            } else {
                equipmentFieldset.classList.remove('error', 'valid');
            }
        }
    });
});

// Other equipment Input
inputs.otherEquipmentInput.addEventListener('input', function () {
    const err = validateOtherEquipment(this.value, inputs.otherEquipmentCheckbox.checked);
    showError(this, errors.otherEquipment, err);

    const equipmentFieldset = this.closest('fieldset');
    const anyChecked = Array.from(document.querySelectorAll('input[name^="equipment"]')).some(cb => cb.checked);
    const otherChecked = inputs.otherEquipmentCheckbox.checked;
    const otherText = this.value.trim();
    const isValid = anyChecked && (!otherChecked || otherText);

    if (equipmentFieldset) {
        if (isValid) {
            equipmentFieldset.classList.remove('error');
            equipmentFieldset.classList.add('valid');
        } else if (otherChecked && !otherText) {
            equipmentFieldset.classList.add('error');
            equipmentFieldset.classList.remove('valid');
        } else {
            equipmentFieldset.classList.remove('error', 'valid');
        }
    }
});

// Payment method selection
const paymentRadio = document.querySelectorAll('input[name="payment"]');
const invoiceFields = document.getElementById('invoiceFields');
const cardFields = document.getElementById('cardFields');

const paymentFieldsetEl = document.querySelector('input[name="payment"]')?.closest('fieldset');

// Jediná pomocná funkcia na prefarbenie fieldsetu podľa aktuálnych chýb
function recalcPaymentState() {
  if (!paymentFieldsetEl) return;

  const isCardPayment = inputs.paymentCard.checked;
  const isInvoicePayment = inputs.paymentInvoice.checked;

  // 1) chyba ak žiadna možnosť nie je zvolená
  const payErr = validatePayment();
  errors.payment.textContent = payErr || "";

  // 2) nazbieraj chyby podľa zvolenej možnosti
  const errs = [];
  if (payErr) errs.push(payErr);

  if (isCardPayment) {
    errs.push(validateCardNumber(inputs.cardNumber.value.trim(), true));
    errs.push(validateCardExpiry(inputs.cardExpiry.value.trim(), true));
    errs.push(validateCardCvv(inputs.cardCvv.value.trim(), true));
  }

  if (isInvoicePayment) {
    errs.push(validateCompanyName(inputs.companyName.value.trim(), true));
    errs.push(validateICO(inputs.ico.value.trim(), true));
    errs.push(validateDIC(inputs.dic.value.trim(), true));
    errs.push(validateAddress(inputs.address.value.trim(), true));
  }

  const hasError = errs.some(Boolean);

  // prepni farbu celého fieldsetu
  if (hasError) {
    paymentFieldsetEl.classList.add('error');
    paymentFieldsetEl.classList.remove('valid');
  } else {
    paymentFieldsetEl.classList.remove('error');
    paymentFieldsetEl.classList.add('valid');
  }
}

function handlePaymentChange() {
    const selected = document.querySelector('input[name="payment"]:checked')?.value;

    const err = validatePayment();
    updateRadioGroupState(paymentRadio, errors.payment, err);

    if (selected === 'invoice') {
        invoiceFields.style.display = 'block';
        cardFields.style.display = 'none';
        clearCardFields();
        resetCharCount(inputs.cardNumber, document.getElementById('cardNumberCount'), 16, true);
        resetCharCount(inputs.cardCvv, document.getElementById('cardCvvCount'), 3, true);

    } else if (selected === 'card') {
        cardFields.style.display = 'block';
        invoiceFields.style.display = 'none';
        clearInvoiceFields();
        resetCharCount(inputs.companyName, document.getElementById('compNameCount'), 50, false);
        resetCharCount(inputs.ico, document.getElementById('icoCount'), 8, true);
        resetCharCount(inputs.dic, document.getElementById('dicCount'), 10, true);
        resetCharCount(inputs.address, document.getElementById('addrCount'), 30, false);

    } else {
        cardFields.style.display = 'none'; clearInvoiceFields();
        invoiceFields.style.display = 'none'; clearCardFields();
        resetCharCount(inputs.cardNumber, document.getElementById('cardNumberCount'), 16, true);
        resetCharCount(inputs.cardCvv, document.getElementById('cardCvvCount'), 3, true);
        resetCharCount(inputs.companyName, document.getElementById('compNameCount'), 50, false);
        resetCharCount(inputs.ico, document.getElementById('icoCount'), 8, true);
        resetCharCount(inputs.dic, document.getElementById('dicCount'), 10, true);
        resetCharCount(inputs.address, document.getElementById('addrCount'), 30, false);
    }
    recalcPaymentState();
}
paymentRadio.forEach(r => r.addEventListener('change', handlePaymentChange));
paymentRadio.forEach(r => r.addEventListener('change', recalcPaymentState));

['cardNumber','cardExpiry','cardCvv'].forEach(k => {
  if (inputs[k]) inputs[k].addEventListener('input', recalcPaymentState);
});

['companyName','ico','dic','address'].forEach(k => {
  if (inputs[k]) inputs[k].addEventListener('input', recalcPaymentState);
});

// Author name toggle
const showAuthorBtn = document.getElementById('showAuthorBtn');
showAuthorBtn.addEventListener('click', function () {
    const authorName = inputs.authorName;
    if (authorName.hidden) {
        authorName.hidden = false;
        showAuthorBtn.textContent = 'Skryť autora formulára';
    } else {
        authorName.hidden = true;
        showAuthorBtn.textContent = 'Zobraziť autora formulára';
    }
});

// Real-time validation - define validation handlers for each field
const validationHandlers = {
    firstName: (value) => validateFirstName(value),
    lastName: (value) => validateLastName(value),
    email: (value) => validateEmail(value),
    phonePrefix: (value) => {
        const errorMsg = validatePhonePrefix(value, inputs.phoneNumber.value);

        if (errorMsg) {
            errors.phone.textContent = errorMsg;
            inputs.phonePrefix.classList.add('error');
            inputs.phonePrefix.classList.remove('valid');
        } else {
            const phoneError = validatePhone(value, inputs.phoneNumber.value);
            if (phoneError) {
                errors.phone.textContent = phoneError;
            } else {
                errors.phone.textContent = "";
            }

            if (value) {
                inputs.phonePrefix.classList.remove('error');
                inputs.phonePrefix.classList.add('valid');
            } else {
                inputs.phonePrefix.classList.remove('error', 'valid');
            }
        }

        const phoneError = validatePhone(value, inputs.phoneNumber.value);
        const phoneValue = inputs.phoneNumber.value.trim();

        if (!value && !phoneValue) {
            inputs.phoneNumber.classList.remove('error');
            inputs.phoneNumber.classList.add('valid');
        }
        else if (value && !phoneValue) {
            inputs.phoneNumber.classList.add('error');
            inputs.phoneNumber.classList.remove('valid');
        }
        else if (phoneValue && phoneValue.length >= 6 && phoneValue.length <= 15) {
            inputs.phoneNumber.classList.remove('error');
            inputs.phoneNumber.classList.add('valid');
        }
        else if (phoneError && phoneValue) {
            inputs.phoneNumber.classList.add('error');
            inputs.phoneNumber.classList.remove('valid');
        }
        else {
            inputs.phoneNumber.classList.remove('error', 'valid');
        }

        return errorMsg;
    },
    phoneNumber: (value) => {
        const errorMsg = validatePhone(inputs.phonePrefix.value, value);

        errors.phone.textContent = errorMsg || "";

        if (errorMsg && value.trim()) {
            inputs.phoneNumber.classList.add('error');
            inputs.phoneNumber.classList.remove('valid');
        } else if (!errorMsg && value.trim() && value.length >= 6 && value.length <= 15 && inputs.phonePrefix.value) {
            inputs.phoneNumber.classList.remove('error');
            inputs.phoneNumber.classList.add('valid');
        } else {
            inputs.phoneNumber.classList.remove('error', 'valid');
        }

        const prefixError = validatePhonePrefix(inputs.phonePrefix.value, value);

        if (!value.trim() && !inputs.phonePrefix.value) {
            inputs.phonePrefix.classList.remove('error');
            inputs.phonePrefix.classList.add('valid');
        } else if (prefixError) {
            errors.phone.textContent = prefixError;
            inputs.phonePrefix.classList.add('error');
            inputs.phonePrefix.classList.remove('valid');
        } else if (inputs.phonePrefix.value) {
            inputs.phonePrefix.classList.remove('error');
            inputs.phonePrefix.classList.add('valid');
        } else {
            inputs.phonePrefix.classList.remove('error', 'valid');
        }

        return errorMsg;
    },
    dob: (value) => {
        const errorMsg = validateDob(value);
        syncAgeField(value, errorMsg);
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
function updateCharCount(inputElement, countElement, maxLength, isExactMatch) {
    if (!countElement) return;

    const currentLength = inputElement.value.length;
    countElement.textContent = `${currentLength} / ${maxLength}`;

    if (isExactMatch) {
        // For specific number (ICO, DIC, CVV, cardNumber)
        if (currentLength === maxLength)
            countElement.style.color = 'green';
        else if (currentLength > maxLength)
            countElement.style.color = 'red';
        else
            countElement.style.color = 'red';
    }
    else {
        // For others
        if (currentLength > maxLength)
            countElement.style.color = 'red';
        else if (currentLength >= maxLength * 0.85)
            countElement.style.color = 'orange';
        else
            countElement.style.color = '#666';
    }
}

const charCounters = [
    { input: inputs.firstName, counter: document.getElementById('firstNameCount'), max: 40, exact: false },
    { input: inputs.lastName, counter: document.getElementById('lastNameCount'), max: 40, exact: false },
    { input: inputs.email, counter: document.getElementById('emailCount'), max: 50, exact: false },
    { input: inputs.phoneNumber, counter: document.getElementById('phoneNumberCount'), max: 15, exact: false },
    { input: inputs.message, counter: document.getElementById('messageCount'), max: 500, exact: false },
    { input: inputs.ico, counter: document.getElementById('icoCount'), max: 8, exact: true },
    { input: inputs.dic, counter: document.getElementById('dicCount'), max: 10, exact: true },
    { input: inputs.address, counter: document.getElementById('addrCount'), max: 30, exact: false },
    { input: inputs.companyName, counter: document.getElementById('compNameCount'), max: 50, exact: false },
    { input: inputs.otherEquipmentInput, counter: document.getElementById('otherEquipmentCount'), max: 60, exact: false },
    { input: inputs.cardNumber, counter: document.getElementById('cardNumberCount'), max: 16, exact: true },
    { input: inputs.cardCvv, counter: document.getElementById('cardCvvCount'), max: 3, exact: true }
]

charCounters.forEach(item => {
    if (item.input && item.counter) {
        updateCharCount(item.input, item.counter, item.max, item.exact);

        item.input.addEventListener('input', () => {
            updateCharCount(item.input, item.counter, item.max, item.exact);
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

    const checkedEquipment = document.querySelectorAll('input[name^="equipment"]:checked');
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


// Function for highlighting fieldsets during validation
function highlightFieldsets(validateErrors, isOtherEquipmentChecked) {
    // Gender fieldset
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const genderFieldset = genderRadios[0]?.closest('fieldset');
    if (genderFieldset) {
        if (validateErrors.gender) {
            genderFieldset.classList.add('error');
            genderFieldset.classList.remove('valid');
        } else {
            genderFieldset.classList.remove('error');
            genderFieldset.classList.add('valid');
        }
    }

    // Payment fieldset
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const paymentFieldset = paymentRadios[0]?.closest('fieldset');
    if (paymentFieldset) {
        if (validateErrors.payment) {
            paymentFieldset.classList.add('error');
            paymentFieldset.classList.remove('valid');
        } else {
            paymentFieldset.classList.remove('error');
            paymentFieldset.classList.add('valid');
        }
    }

    // Equipment fieldset
    const equipmentCheckboxes = document.querySelectorAll('input[name^="equipment"]');
    const equipmentFieldset = equipmentCheckboxes[0]?.closest('fieldset');
    if (equipmentFieldset) {
        if (isOtherEquipmentChecked && validateErrors.otherEquipment) {
            equipmentFieldset.classList.add('error');
            equipmentFieldset.classList.remove('valid');
        } else {
            equipmentFieldset.classList.remove('error');
            equipmentFieldset.classList.add('valid');
        }
    }
}

function syncPhoneFields(phonePrefix, phoneNumber, prefixError, phoneError) {
    if (!phonePrefix && !phoneNumber.trim()) {
        inputs.phonePrefix.classList.remove('error');
        inputs.phonePrefix.classList.add('valid');
        inputs.phoneNumber.classList.remove('error');
        inputs.phoneNumber.classList.add('valid');
        return;
    }

    if (!prefixError && phonePrefix) {
        inputs.phonePrefix.classList.add('valid');
        inputs.phonePrefix.classList.remove('error');
    } else if (prefixError) {
        inputs.phonePrefix.classList.add('error');
        inputs.phonePrefix.classList.remove('valid');
    } else {
        inputs.phonePrefix.classList.remove('error', 'valid');
    }

    if (!phoneError && phoneNumber && !prefixError) {
        inputs.phoneNumber.classList.add('valid');
        inputs.phoneNumber.classList.remove('error');
    } else if (phoneError) {
        inputs.phoneNumber.classList.add('error');
        inputs.phoneNumber.classList.remove('valid');
    } else {
        inputs.phoneNumber.classList.remove('error', 'valid');
    }
}

function clearInactivePaymentFields(isCardPayment, isInvoicePayment) {
    if (!isCardPayment) {
        inputs.cardNumber.classList.remove('valid', 'error');
        inputs.cardExpiry.classList.remove('valid', 'error');
        inputs.cardCvv.classList.remove('valid', 'error');
    }

    if (!isInvoicePayment) {
        inputs.companyName.classList.remove('valid', 'error');
        inputs.ico.classList.remove('valid', 'error');
        inputs.dic.classList.remove('valid', 'error');
        inputs.address.classList.remove('valid', 'error');
    }
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
        phonePrefix: validatePhonePrefix(phonePrefix, phoneNumber),
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
        if (key === 'phonePrefix') {
            if (validateErrors.phonePrefix) {
                errors.phone.textContent = validateErrors.phonePrefix;
                if (inputs.phonePrefix) {
                    inputs.phonePrefix.classList.add('error');
                    inputs.phonePrefix.classList.remove('valid');
                }
                hasError = true;
            } else if (!validateErrors.phone) {
                if (inputs.phonePrefix) {
                    inputs.phonePrefix.classList.remove('error');
                    if (phonePrefix) inputs.phonePrefix.classList.add('valid');
                }
            }
            return;
        }

        if (validateErrors[key]) {
            errors[key].textContent = validateErrors[key];
            if (inputs[key]) {
                inputs[key].classList.add('error');
                inputs[key].classList.remove('valid');
            }
            hasError = true;
        } else {
            errors[key].textContent = "";
            if (inputs[key]) {
                inputs[key].classList.remove('error');
                inputs[key].classList.add('valid');
            }
        }
    });

    syncAgeField(dob, validateErrors.dob);
    highlightFieldsets(validateErrors, isOtherEquipmentChecked);
    syncPhoneFields(phonePrefix, phoneNumber, validateErrors.phonePrefix, validateErrors.phone);
    recalcPaymentState();

    if (!hasError) {
        generateOrderSummary();
        modal.style.display = 'block';
    }
});

function toggleEquipmentFieldsDisabled(disabled) {
  document.querySelectorAll('input[name^="equipment_"], #otherEquipmentInput').forEach(el => { el.disabled = disabled; });
}

// Modal button event listeners
confirmBtn.addEventListener('click', function () {
    // pre istotu ešte raz vytvor aktuálny súhrn vybavenia
    const checkedEquipment = [];
    document.querySelectorAll('input[name^="equipment_"]:checked').forEach(cb => {
        if (cb.id !== 'otherEquipmentCheckbox') checkedEquipment.push(cb.value);
    });
    if (inputs.otherEquipmentCheckbox.checked && inputs.otherEquipmentInput.value.trim()) {
        checkedEquipment.push(inputs.otherEquipmentInput.value.trim());
    }
    document.getElementById('equipmentSummary').value = checkedEquipment.join(', ');

    // zablokuj (disable) jednotlivé equipment polia, aby sa neposlali
    toggleEquipmentFieldsDisabled(true);

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
