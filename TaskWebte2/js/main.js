console.log('Main JS loaded');

// Data structure
const sportData = {
    Football: {
        name: "Futbal",
        spaces: {
            small_playground: {
                name: "Malé ihrisko", slots: [
                    { time: "14:00-15:00", price: 20 },
                    { time: "15:00-16:00", price: 20 },
                    { time: "16:00-17:30", price: 28 },
                    { time: "17:30-19:30", price: 35 }
                ]
            },
            big_playground: {
                name: "Veľké ihrisko", slots: [
                    { time: "14:00-15:00", price: 35 },
                    { time: "15:00-16:00", price: 35 },
                    { time: "16:00-17:30", price: 48 },
                    { time: "17:30-19:30", price: 60 }
                ]
            },
            indoor_hall: {
                name: "Halová hala", slots: [
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
                name: "Hala A", slots: [
                    { time: "13:00-14:00", price: 30 },
                    { time: "14:00-15:00", price: 30 },
                    { time: "15:00-16:30", price: 42 },
                    { time: "16:30-18:30", price: 55 }
                ]
            },
            hall_b: {
                name: "Hala B", slots: [
                    { time: "13:00-14:00", price: 25 },
                    { time: "14:00-15:00", price: 25 },
                    { time: "15:00-16:30", price: 35 },
                    { time: "16:30-18:30", price: 45 }
                ]
            },
            outdoor_playground: {
                name: "Vonkajšie ihrisko", slots: [
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
                name: "Kurt 1 (antuka)", slots: [
                    { time: "14:00-15:00", price: 15 },
                    { time: "15:00-16:00", price: 15 },
                    { time: "16:00-17:30", price: 22 },
                    { time: "17:30-19:30", price: 30 }
                ]
            },
            court_2: {
                name: "Kurt 2 (antuka)", slots: [
                    { time: "14:00-15:00", price: 12 },
                    { time: "15:00-16:00", price: 12 },
                    { time: "16:00-17:30", price: 18 },
                    { time: "17:30-19:30", price: 25 }
                ]
            },
            court_3: {
                name: "Kurt 3 (tvrdý povrch)", slots: [
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
                name: "Bazén 25m (dráha)", slots: [
                    { time: "14:00-15:00", price: 10 },
                    { time: "15:00-16:00", price: 10 },
                    { time: "16:00-17:30", price: 15 },
                    { time: "17:30-19:30", price: 20 }
                ]
            },
            pool_50m: {
                name: "Bazén 50m (olympijský)", slots: [
                    { time: "14:00-15:00", price: 15 },
                    { time: "15:00-16:00", price: 15 },
                    { time: "16:00-17:30", price: 22 },
                    { time: "17:30-19:30", price: 30 }
                ]
            },
            recreational_pool: {
                name: "Rekreačný bazén", slots: [
                    { time: "13:00-14:00", price: 20 },
                    { time: "14:00-15:00", price: 20 },
                    { time: "15:00-16:30", price: 28 },
                    { time: "16:30-18:30", price: 38 }
                ]
            }
        }
    }
};

// Inicializácia - DOM prvky
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
    membersCount: document.getElementById('membersCount'),
    message: document.getElementById('message'),
    paymentCash: document.getElementById('paymentCash'),
    paymentCard: document.getElementById('paymentCard'),
    paymentInvoice: document.getElementById('paymentInvoice'),
    cardNumber: document.getElementById('cardNumber'),
    cardExpiry: document.getElementById('cardExpiry'),
    cardCvv: document.getElementById('cardCvv'),
    companyName: document.getElementById('companyName'),
    ico: document.getElementById('ico'),
    dic: document.getElementById('dic'),
    address: document.getElementById('address'),
    authorName: document.getElementById('authorName')
};

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
    membersCount: document.getElementById('membersCountError'),
    message: document.getElementById('messageError'),
    payment: document.getElementById('paymentError'),
    companyName: document.getElementById('companyNameError'),
    cardNumber: document.getElementById('cardNumberError'),
    cardExpiry: document.getElementById('cardExpiryError'),
    cardCvv: document.getElementById('cardCvvError'),
    ico: document.getElementById('icoError'),
    dic: document.getElementById('dicError'),
    address: document.getElementById('addressError')
};

// ==================== HELPER FUNKCIE ====================

function digitsOnly(str) {
    return (str || "").replace(/\D/g, "");
}

function clearFieldState(element, errorElement) {
    errorElement.textContent = "";
    element.classList.remove('error', 'valid');
}

function showError(element, errorElement, errorMessage) {
    if (errorElement) errorElement.textContent = errorMessage || "";

    if (errorMessage) {
        element.classList.add('error');
        element.classList.remove('valid');
    } else {
        element.classList.remove('error');
        element.classList.add('valid');
    }
}

function updateRadioGroupState(radioGroup, errorElement, hasError) {
    errorElement.textContent = hasError || "";
    const fieldset = radioGroup[0].closest('fieldset');

    if (hasError) {
        if (fieldset) {
            fieldset.classList.add('error');
            fieldset.classList.remove('valid');
        }
    } else {
        if (fieldset) {
            fieldset.classList.remove('error');
            fieldset.classList.add('valid');
        }
    }
}

function calculateAgeFromDob(dobValue) {
    if (!dobValue) return "";
    const today = new Date();
    let age = today.getFullYear() - dobValue.getFullYear();
    const monthDiff = today.getMonth() - dobValue.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobValue.getDate())) age--;
    return age;
}

function isAnyEquipmentSelected() {
    const equipmentCheckboxes = document.querySelectorAll('[name^="equipment_"]');
    const anyChecked = Array.from(equipmentCheckboxes).some(cb => cb.checked);
    const otherChecked = inputs.otherEquipmentCheckbox?.checked;
    const otherText = inputs.otherEquipmentInput?.value.trim();
    const otherValid = !!(otherChecked && otherText);
    return anyChecked || otherValid;
}

function updateCharCount(inputElement, counterElement, maxLength, isExactMatch) {
    if (!counterElement) return;
    const currentLength = inputElement.value.length;
    counterElement.textContent = `${currentLength} / ${maxLength}`;

    if (isExactMatch) {
        counterElement.style.color = currentLength === maxLength ? 'green' : 'red';
    } else {
        if (currentLength > maxLength) counterElement.style.color = 'red';
        else if (currentLength >= maxLength * 0.85) counterElement.style.color = 'orange';
        else counterElement.style.color = '#666';
    }
}

function resetCharCount(inputElement, counterElement, maxLength, isExactMatch) {
    updateCharCount(inputElement, counterElement, maxLength, isExactMatch);
}

// ==================== VALIDAČNÉ FUNKCIE ====================

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
    const pattern = /^[^\s@]{3,}@[^\s@]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(value)) return "Neplatný formát emailu";
    if (value.length > 50) return "Pole môže mať maximálne 50 znakov";
    return "";
}

function validatePhonePrefix(prefix, number) {
    if (!prefix && !number.trim()) return "";
    if (prefix && !number.trim()) return "";
    if (!prefix && number.trim()) return "Predvoľba je povinná";
    return "";
}

function validatePhoneNumber(prefix, number) {
    if (!prefix && !number.trim()) return "";
    if (!number.trim() && prefix) return "Telefónne číslo je povinné";
    const digitsOnly_var = digitsOnly(number);
    if (digitsOnly_var.length < 7) return "Telefónne číslo musí mať aspoň 7 číslic";
    if (digitsOnly_var.length > 15) return "Telefónne číslo nemôže mať viac ako 15 číslic";
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
    return s.length >= 12 && sum % 10 === 0;
}

function isExpiryValid(value) {
    if (!value) return false;
    const [y, m] = value.split('-').map(Number);
    if (!y || !m) return false;
    const expAfter = new Date(y, m, 1);
    const now = new Date();
    if (expAfter <= new Date(now.getFullYear(), now.getMonth(), now.getDate())) return false;
    return true;
}

function validateSport(value) {
    return !value ? "Musíte vybrať šport" : "";
}

function validateSpace(value) {
    return !value ? "Musíte vybrať priestor" : "";
}

function validateTime(value) {
    return !value ? "Musíte vybrať čas a cenu" : "";
}

function validateGender() {
    const genderRadio = document.querySelectorAll('input[name="gender"]');
    const checked = Array.from(genderRadio).some(radio => radio.checked);
    return !checked ? "Musíte vybrať pohlavie" : "";
}

function validateOtherEquipment(value, isOtherChecked) {
    if (value.length > 60) return "Správa nesmie presiahnuť 60 znakov";
    if (isOtherChecked && !value.trim()) return "Musíte uviesť aké iné vybavenie potrebujete";
    return "";
}

function validateMemberCount(value, anyEquipmentSelected) {
    const v = String(value ?? "").trim();

    if (!anyEquipmentSelected && v === "") return "";
    if (anyEquipmentSelected && v === "") return "Zadajte počet osôb";
    if (!anyEquipmentSelected && v !== "") return "Vyberte aspoň jedno vybavenie";
    if (!/^\d+$/.test(v)) return "Zadajte celé kladné číslo";
    const n = Number(v);
    if (!Number.isInteger(n)) return "Zadajte celé číslo";
    if (n < 1) return "Počet musí byť aspoň 1";
    if (n > 30) return "Nevieme zabezpečiť vybavenie pre viac ako 30 ľudí";
    return "";
}

function validateMessage(value) {
    return value.length > 500 ? "Správa nesmie presiahnuť 500 znakov" : "";
}

function validatePayment() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const checked = Array.from(paymentRadios).some(radio => radio.checked);
    return !checked ? "Musíte vybrať spôsob platby" : "";
}

function validateCardNumber(value, isCardPayment) {
    const digits = digitsOnly(value);
    if (!digits && isCardPayment) return "Číslo karty je povinné";
    if (digits.length !== 16 && isCardPayment) return "Číslo karty musí mať 16 číslic";
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
    if (d.length !== 3 && isCardPayment) return "CVV musí mať 3 čísla";
    return "";
}

function validateCompanyName(value, isInvoicePayment) {
    return isInvoicePayment && !value.trim() ? "Názov spoločnosti je povinný pri platbe faktúrou" : "";
}

function validateICO(value, isInvoicePayment) {
    if (isInvoicePayment && !value.trim()) return "IČO je povinné pri platbe faktúrou";
    if (isInvoicePayment && !/^\d{8}$/.test(value)) return "IČO musí mať 8 číslic";
    return "";
}

function validateDIC(value, isInvoicePayment) {
    if (isInvoicePayment && !value.trim()) return "DIČ je povinné pri platbe faktúrou";
    if (isInvoicePayment && !/^\d{10}$/.test(value)) return "DIČ musí mať 10 číslic";
    return "";
}

function validateAddress(value, isInvoicePayment) {
    if (isInvoicePayment && !value.trim()) return "Adresa je povinná pri platbe faktúrou";
    if (isInvoicePayment && value.length > 60) return "Pole môže mať maximálne 60 znakov";
    return "";
}

// ==================== DYNAMICKÉ UPDATERY ====================

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

function resetCharCount(inputElement, counterElement, maxLength, isExactMatch) {
    updateCharCount(inputElement, counterElement, maxLength, isExactMatch);
}

// ==================== SPORT, PRIESTOR, ČAS SELECTY ====================

function populateSpaces(sportKey) {
    inputs.space.innerHTML = '<option value="">--Vyberte priestor--</option>';
    inputs.time.innerHTML = '<option value="">--Najprv vyberte priestor--</option>';
    inputs.time.disabled = true;
    clearFieldState(inputs.space, errors.space);
    clearFieldState(inputs.time, errors.time);

    if (sportKey && sportData[sportKey]) {
        const spaces = sportData[sportKey].spaces;
        for (const [key, space] of Object.entries(spaces)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = space.name;
            inputs.space.appendChild(option);
        }
        inputs.space.disabled = false;
    } else {
        inputs.space.disabled = true;
    }
}

function populateTimes(sportKey, spaceKey) {
    inputs.time.innerHTML = '<option value="">--Vyberte čas--</option>';
    inputs.time.disabled = true;
    clearFieldState(inputs.time, errors.time);

    if (sportKey && spaceKey && sportData[sportKey]) {
        const slots = sportData[sportKey].spaces[spaceKey].slots;
        slots.forEach(slot => {
            const option = document.createElement('option');
            option.value = `${slot.time}|${slot.price}`;
            option.textContent = `${slot.time} - ${slot.price} €`;
            inputs.time.appendChild(option);
        });
        inputs.time.disabled = false;
    }
}

// ==================== PAYMENT STATE ====================

function recalcPaymentState() {
    const paymentFieldsetEl = document.querySelector('input[name="payment"]')?.closest('fieldset');
    if (!paymentFieldsetEl) return;

    const isCardPayment = inputs.paymentCard.checked;
    const isInvoicePayment = inputs.paymentInvoice.checked;

    const payErr = validatePayment();
    errors.payment.textContent = payErr || "";

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
    const paymentRadio = document.querySelectorAll('input[name="payment"]');
    const invoiceFields = document.getElementById('invoiceFields');
    const cardFields = document.getElementById('cardFields');

    const err = validatePayment();
    updateRadioGroupState(paymentRadio, errors.payment, err);

    if (selected === 'invoice') {
        invoiceFields.style.display = 'block';
        cardFields.style.display = 'none';
        clearCardFields();
        resetCharCount(inputs.cardNumber, document.getElementById('cardNumberCount'), 16, true);
        resetCharCount(inputs.cardCvv, document.getElementById('cardCvvCount'), 3, true);
    }
    else if (selected === 'card') {
        cardFields.style.display = 'block';
        invoiceFields.style.display = 'none';
        clearInvoiceFields();
        resetCharCount(inputs.companyName, document.getElementById('compNameCount'), 50, false);
        resetCharCount(inputs.ico, document.getElementById('icoCount'), 8, true);
        resetCharCount(inputs.dic, document.getElementById('dicCount'), 10, true);
        resetCharCount(inputs.address, document.getElementById('addrCount'), 30, false);
    }
    else {
        cardFields.style.display = 'none';
        invoiceFields.style.display = 'none';
        clearInvoiceFields();
        clearCardFields();
        resetCharCount(inputs.cardNumber, document.getElementById('cardNumberCount'), 16, true);
        resetCharCount(inputs.cardCvv, document.getElementById('cardCvvCount'), 3, true);
        resetCharCount(inputs.companyName, document.getElementById('compNameCount'), 50, false);
        resetCharCount(inputs.ico, document.getElementById('icoCount'), 8, true);
        resetCharCount(inputs.dic, document.getElementById('dicCount'), 10, true);
        resetCharCount(inputs.address, document.getElementById('addrCount'), 30, false);
    }
    recalcPaymentState();
}

// ==================== EQUIPMENT ====================

function updateEquipmentFieldsetState() {
    const equipmentFieldset = document.querySelector('input[name^="equipment_"]')?.closest('fieldset');
    if (!equipmentFieldset) return;

    const anySel = isAnyEquipmentSelected();
    const membersVal = inputs.membersCount?.value.trim() || "";
    const membersErr = validateMemberCount(membersVal, anySel);
    const otherErr = validateOtherEquipment(inputs.otherEquipmentInput.value.trim(), inputs.otherEquipmentCheckbox.checked);

    if (!anySel && membersVal !== "") {
        equipmentFieldset.classList.add('error');
        equipmentFieldset.classList.remove('valid');
    } else if (anySel && (otherErr || membersErr)) {
        equipmentFieldset.classList.add('error');
        equipmentFieldset.classList.remove('valid');
    } else {
        equipmentFieldset.classList.remove('error');
        equipmentFieldset.classList.add('valid');
    }
}

function handleEquipmentCheckboxChange() {
    updateEquipmentFieldsetState();
    const mErr = validateMemberCount(inputs.membersCount.value, isAnyEquipmentSelected());
    showError(inputs.membersCount, errors.membersCount, mErr);
}

// ==================== EVENT LISTENERS ====================

inputs.sport.addEventListener('change', function () {
    const errorMessage = validateSport(this.value);
    showError(inputs.sport, errors.sport, errorMessage);
    populateSpaces(this.value);
});

inputs.space.addEventListener('change', function () {
    const errorMessage = validateSpace(this.value);
    showError(inputs.space, errors.space, errorMessage);
    populateTimes(inputs.sport.value, this.value);
});

inputs.time.addEventListener('change', function () {
    const errorMsg = validateTime(this.value);
    showError(this, errors.time, errorMsg);
});

document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const errorMsg = validateGender();
        const genderRadio = document.querySelectorAll('input[name="gender"]');
        updateRadioGroupState(genderRadio, errors.gender, errorMsg);
    });
});

inputs.otherEquipmentCheckbox.addEventListener('change', function () {
    const otherEquipmentContainer = document.getElementById('otherEquipmentContainer');
    if (this.checked) {
        otherEquipmentContainer.style.display = 'block';
    } else {
        otherEquipmentContainer.style.display = 'none';
        inputs.otherEquipmentInput.value = '';
        clearFieldState(inputs.otherEquipmentInput, errors.otherEquipment);
        resetCharCount(inputs.otherEquipmentInput, document.getElementById('otherEquipmentCount'), 60, false);
    }
    updateEquipmentFieldsetState();
});

document.querySelectorAll('[name^="equipment_"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const err = validateOtherEquipment(this.value, inputs.otherEquipmentCheckbox.checked);
        showError(this, errors.otherEquipment, err);
        updateEquipmentFieldsetState();

        const mErr = validateMemberCount(inputs.membersCount.value, isAnyEquipmentSelected());
        showError(inputs.membersCount, errors.membersCount, mErr);
    });
});

document.querySelectorAll('input[name="payment"]').forEach(r => {
    r.addEventListener('change', handlePaymentChange);
    r.addEventListener('change', recalcPaymentState);
});

['cardNumber', 'cardExpiry', 'cardCvv', 'companyName', 'ico', 'dic', 'address'].forEach(k => {
    if (inputs[k]) inputs[k].addEventListener('input', recalcPaymentState);
});

document.getElementById('showAuthorBtn')?.addEventListener('click', function () {
    if (inputs.authorName.hidden) {
        inputs.authorName.hidden = false;
        this.textContent = 'Skryť autora formulára';
    } else {
        inputs.authorName.hidden = true;
        this.textContent = 'Zobraziť autora formulára';
    }
});

// ==================== REAL-TIME VALIDATION ====================

const validationHandlers = {
    firstName: (value) => validateFirstName(value),
    lastName: (value) => validateLastName(value),
    email: (value) => validateEmail(value),
    bookingDate: (value) => validateBookingDate(value),
    otherEquipmentInput: (value) => validateOtherEquipment(value, inputs.otherEquipmentCheckbox.checked),
    membersCount: (value) => validateMemberCount(value, isAnyEquipmentSelected()),
    message: (value) => validateMessage(value),
    cardNumber: (value) => validateCardNumber(value, inputs.paymentCard.checked),
    cardExpiry: (value) => validateCardExpiry(value, inputs.paymentCard.checked),
    cardCvv: (value) => validateCardCvv(value, inputs.paymentCard.checked),
    companyName: (value) => validateCompanyName(value, inputs.paymentInvoice.checked),
    ico: (value) => validateICO(value, inputs.paymentInvoice.checked),
    dic: (value) => validateDIC(value, inputs.paymentInvoice.checked),
    address: (value) => validateAddress(value, inputs.paymentInvoice.checked),
    dob: (value) => {
        const errorMsg = validateDob(value);
        syncAgeField(value, errorMsg);
        return errorMsg;
    }
};

Object.keys(validationHandlers).forEach(key => {
    if (inputs[key]) {
        inputs[key].addEventListener('input', function () {
            const errorMessage = validationHandlers[key](this.value);
            showError(this, errors[key], errorMessage);
        });
    }
});

// ==================== PHONE FIELDS REAL-TIME VALIDATION ====================

function highlightPhoneFieldsRealtime() {
    const prefixValue = inputs.phonePrefix.value;
    const numberValue = inputs.phoneNumber.value.trim();

    // Obe prázdne = bez farby (nepovinné)
    const isBothEmpty = !prefixValue && !numberValue;

    if (isBothEmpty) {
        // Obe prázdne = bez chyby, bez farby
        errors.phone.textContent = "";
        inputs.phonePrefix.classList.remove('error', 'valid');
        inputs.phoneNumber.classList.remove('error', 'valid');
        return;
    }

    // Niečo je vyplnené - overovať chyby
    const prefixError = validatePhonePrefix(prefixValue, numberValue);
    const numberError = validatePhoneNumber(prefixValue, numberValue);

    // Zdieľaná chybová správa
    const hasError = prefixError || numberError;
    errors.phone.textContent = prefixError || numberError || "";

    // Prefix field
    if (!prefixValue && numberValue) {
        // Číslo je vyplnené ALE prefix je prázdny = ERROR
        inputs.phonePrefix.classList.add('error');
        inputs.phonePrefix.classList.remove('valid');
    } else if (prefixValue) {
        if (prefixError) {
            inputs.phonePrefix.classList.add('error');
            inputs.phonePrefix.classList.remove('valid');
        } else {
            inputs.phonePrefix.classList.remove('error');
            inputs.phonePrefix.classList.add('valid');
        }
    } else {
        inputs.phonePrefix.classList.remove('error', 'valid');
    }

    // Number field
    if (numberValue) {
        // Ak je číslo vyplnené a má validnú dĺžku = ZELENÉ (aj bez prefixu)
        if (!numberError) {
            inputs.phoneNumber.classList.remove('error');
            inputs.phoneNumber.classList.add('valid');
        }
        // Ak je číslo vyplnené ale má chybu (zla dlzka atd) = CERVENE
        else if (numberError) {
            inputs.phoneNumber.classList.add('error');
            inputs.phoneNumber.classList.remove('valid');
        }
    } else if (prefixValue) {
        // Prefix je vybraný ALE číslo je prázdne = ERROR
        inputs.phoneNumber.classList.add('error');
        inputs.phoneNumber.classList.remove('valid');
    } else {
        // Obe prázdne = bez farby
        inputs.phoneNumber.classList.remove('error', 'valid');
    }
}

inputs.phonePrefix.addEventListener('change', highlightPhoneFieldsRealtime);
inputs.phoneNumber.addEventListener('input', highlightPhoneFieldsRealtime);

inputs.membersCount.addEventListener('input', function () {
    const anySel = isAnyEquipmentSelected();
    const membersVal = this.value.trim();

    // Skontroluj validáciu
    const membersErr = validateMemberCount(membersVal, anySel);

    // Aktualizuj farbu poľa
    showError(this, errors.membersCount, membersErr);

    // Aktualizuj equipment fieldset
    const equipmentCheckboxes = document.querySelectorAll('[name^="equipment_"]');
    const equipmentFieldset = equipmentCheckboxes[0]?.closest('fieldset');
    if (equipmentFieldset) {
        const equipmentBothEmpty = !anySel && !membersVal;

        if (equipmentBothEmpty) {
            // Obe prázdne = zelené
            equipmentFieldset.classList.remove('error');
            equipmentFieldset.classList.add('valid');
        } else {
            // Niečo je vyplnené - skontroluj chyby
            const equipErr = validateOtherEquipment(inputs.otherEquipmentInput.value.trim(), inputs.otherEquipmentCheckbox.checked);
            const hasError = equipErr || membersErr;

            equipmentFieldset.classList.toggle('error', !!hasError);
            equipmentFieldset.classList.toggle('valid', !hasError);
        }
    }
});

// Real-time validácia iného vybavenia
inputs.otherEquipmentInput.addEventListener('input', function () {
    const anySel = isAnyEquipmentSelected();
    const membersVal = inputs.membersCount.value.trim();

    // Skontroluj validáciu
    const equipErr = validateOtherEquipment(this.value.trim(), inputs.otherEquipmentCheckbox.checked);

    // Aktualizuj farbu poľa
    showError(this, errors.otherEquipment, equipErr);

    // Aktualizuj equipment fieldset
    const equipmentCheckboxes = document.querySelectorAll('[name^="equipment_"]');
    const equipmentFieldset = equipmentCheckboxes[0]?.closest('fieldset');
    if (equipmentFieldset) {
        const equipmentBothEmpty = !anySel && !membersVal;

        if (equipmentBothEmpty) {
            // Obe prázdne = zelené
            equipmentFieldset.classList.remove('error');
            equipmentFieldset.classList.add('valid');
        } else {
            // Niečo je vyplnené - skontroluj chyby
            const membersErr = validateMemberCount(membersVal, anySel);
            const hasError = equipErr || membersErr;

            equipmentFieldset.classList.toggle('error', !!hasError);
            equipmentFieldset.classList.toggle('valid', !hasError);
        }
    }
});

// Character counters
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
];

charCounters.forEach(item => {
    if (item.input && item.counter) {
        updateCharCount(item.input, item.counter, item.max, item.exact);
        item.input.addEventListener('input', () => {
            updateCharCount(item.input, item.counter, item.max, item.exact);
        });
    }
});

// ==================== MODAL & SUMMARY ====================

const modal = document.getElementById('orderModal');
const orderSummary = document.getElementById('orderSummary');
const totalPriceElement = document.getElementById('totalPrice');
const confirmBtn = document.getElementById('confirmOrder');
const cancelBtn = document.getElementById('cancelOrder');

function generateOrderSummary() {
    let summary = "";
    let totalPrice = 0;

    summary += '<h3>Osobné údaje</h3>';
    if (inputs.firstName.value) summary += `<div class="summary-item"><strong>Meno:</strong><span>${inputs.firstName.value}</span></div>`;
    if (inputs.lastName.value) summary += `<div class="summary-item"><strong>Priezvisko:</strong><span>${inputs.lastName.value}</span></div>`;
    if (inputs.email.value) summary += `<div class="summary-item"><strong>Email:</strong><span>${inputs.email.value}</span></div>`;

    const genderRadio = document.querySelector('input[name="gender"]:checked');
    if (genderRadio) {
        const genderText = genderRadio.value === 'male' ? 'Muž' : genderRadio.value === 'female' ? 'Žena' : 'Iné';
        summary += `<div class="summary-item"><strong>Pohlavie:</strong><span>${genderText}</span></div>`;
    }

    if (inputs.dob.value) summary += `<div class="summary-item"><strong>Dátum narodenia:</strong><span>${inputs.dob.value}</span></div>`;
    if (inputs.age.value) summary += `<div class="summary-item"><strong>Vek:</strong><span>${inputs.age.value} rokov</span></div>`;
    if (inputs.phoneNumber.value && inputs.phonePrefix.value) summary += `<div class="summary-item"><strong>Telefón:</strong><span>${inputs.phonePrefix.value} ${inputs.phoneNumber.value}</span></div>`;

    summary += '<h3>Rezervácia</h3>';
    if (inputs.bookingDate.value) summary += `<div class="summary-item"><strong>Dátum rezervácie:</strong><span>${inputs.bookingDate.value}</span></div>`;

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
            if (checkbox.id === 'otherEquipmentCheckbox' && inputs.otherEquipmentInput.value) {
                summary += `<div class="summary-item"><strong>Iné vybavenie:</strong><span>${inputs.otherEquipmentInput.value}</span></div>`;
            } else if (checkbox.id !== 'otherEquipmentCheckbox') {
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
            if (inputs.companyName.value) summary += `<div class="summary-item"><strong>Názov spoločnosti:</strong><span>${inputs.companyName.value}</span></div>`;
            if (inputs.ico.value) summary += `<div class="summary-item"><strong>IČO:</strong><span>${inputs.ico.value}</span></div>`;
            if (inputs.dic.value) summary += `<div class="summary-item"><strong>DIČ:</strong><span>${inputs.dic.value}</span></div>`;
            if (inputs.address.value) summary += `<div class="summary-item"><strong>Adresa:</strong><span>${inputs.address.value}</span></div>`;
        } else if (paymentRadio.value === 'card') {
            if (inputs.cardNumber.value) summary += `<div class="summary-item"><strong>Číslo karty:</strong><span>${inputs.cardNumber.value}</span></div>`;
            if (inputs.cardExpiry.value) summary += `<div class="summary-item"><strong>Dátum platnosti:</strong><span>${inputs.cardExpiry.value}</span></div>`;
            if (inputs.cardCvv.value) summary += `<div class="summary-item"><strong>CVV:</strong><span>${inputs.cardCvv.value}</span></div>`;
        }
    }

    if (inputs.message.value) {
        summary += '<h3>Dodatkková správa</h3>';
        summary += `<div class="summary-item"><span style="font-style: italic;">${inputs.message.value}</span></div>`;
    }

    orderSummary.innerHTML = summary;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)}`;
}

// ==================== FORM SUBMISSION ====================

function validateAllFields() {
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
    const anyEquipmentSelected = isAnyEquipmentSelected();
    const membersCount = inputs.membersCount.value.trim();
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

    return {
        firstName: validateFirstName(firstName),
        lastName: validateLastName(lastName),
        email: validateEmail(email),
        phonePrefix: validatePhonePrefix(phonePrefix, phoneNumber),
        phone: validatePhoneNumber(phonePrefix, phoneNumber),
        dob: validateDob(dob),
        bookingDate: validateBookingDate(bookingDate),
        sport: validateSport(sport),
        space: validateSpace(space),
        time: validateTime(time),
        gender: validateGender(),
        otherEquipment: validateOtherEquipment(otherEquipment, isOtherEquipmentChecked),
        membersCount: validateMemberCount(membersCount, anyEquipmentSelected),
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
}

function displayValidationErrors(validateErrors) {
    let hasError = false;

    Object.keys(validateErrors).forEach(key => {
        // Skip phone fields - budú spracované samostatne
        if (key === 'phonePrefix' || key === 'phone') return;

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

    return hasError;
}

function displayPhoneFieldsErrors(validateErrors) {
    const prefixError = validateErrors.phonePrefix;
    const numberError = validateErrors.phone;
    const hasPhoneError = prefixError || numberError;

    // Telefón nie je povinný - ak sú obe prázdne, je to OK
    const isPrefixEmpty = !inputs.phonePrefix.value;
    const isNumberEmpty = !inputs.phoneNumber.value.trim();
    const isBothEmpty = isPrefixEmpty && isNumberEmpty;

    // Spoločná chybová správa pre obe polia
    errors.phone.textContent = (hasPhoneError && !isBothEmpty) ? (prefixError || numberError || "") : "";

    // Prefix field
    if (prefixError && !isBothEmpty) {
        inputs.phonePrefix.classList.add('error');
        inputs.phonePrefix.classList.remove('valid');
    } else if (inputs.phonePrefix.value || isBothEmpty) {
        inputs.phonePrefix.classList.remove('error');
        inputs.phonePrefix.classList.add('valid');
    } else {
        inputs.phonePrefix.classList.remove('error', 'valid');
    }

    // Number field
    if (numberError && !isBothEmpty) {
        inputs.phoneNumber.classList.add('error');
        inputs.phoneNumber.classList.remove('valid');
    } else if (inputs.phoneNumber.value || isBothEmpty) {
        inputs.phoneNumber.classList.remove('error');
        inputs.phoneNumber.classList.add('valid');
    } else {
        inputs.phoneNumber.classList.remove('error', 'valid');
    }

    return hasPhoneError && !isBothEmpty;
}

function highlightPhoneFieldsOnSubmit(validateErrors) {
    const phoneFieldset = document.querySelector('input[name="phonePrefix"]')?.closest('fieldset');
    if (!phoneFieldset) return;

    const hasPhoneError = validateErrors.phonePrefix || validateErrors.phone;

    // Telefón nie je povinný - ak je prázdny, je OK (zelené)
    const isPrefixEmpty = !inputs.phonePrefix.value;
    const isNumberEmpty = !inputs.phoneNumber.value.trim();
    const isBothEmpty = isPrefixEmpty && isNumberEmpty;

    if (hasPhoneError && !isBothEmpty) {
        phoneFieldset.classList.add('error');
        phoneFieldset.classList.remove('valid');
    } else {
        phoneFieldset.classList.remove('error');
        phoneFieldset.classList.add('valid');
    }
}

function highlightFieldsetsOnSubmit(validateErrors) {
    // Gender fieldset
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const genderFieldset = genderRadios[0]?.closest('fieldset');
    if (genderFieldset) {
        genderFieldset.classList.toggle('error', !!validateErrors.gender);
        genderFieldset.classList.toggle('valid', !validateErrors.gender);
    }

    // Phone fieldset
    highlightPhoneFieldsOnSubmit(validateErrors);

    // Payment fieldset
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const paymentFieldset = paymentRadios[0]?.closest('fieldset');
    if (paymentFieldset) {
        paymentFieldset.classList.toggle('error', !!validateErrors.payment);
        paymentFieldset.classList.toggle('valid', !validateErrors.payment);
    }

    // Equipment fieldset
    const equipmentCheckboxes = document.querySelectorAll('[name^="equipment_"]');
    const equipmentFieldset = equipmentCheckboxes[0]?.closest('fieldset');
    if (equipmentFieldset) {
        const anySel = isAnyEquipmentSelected();
        const membersVal = inputs.membersCount?.value.trim() || "";
        const equipErr = validateErrors.otherEquipment;
        const membersErr = validateErrors.membersCount;

        // Obe prázdne = bez chyby
        const equipmentBothEmpty = !anySel && !membersVal;

        // Ak sú obe prázdne = OK, zelené
        if (equipmentBothEmpty) {
            equipmentFieldset.classList.remove('error');
            equipmentFieldset.classList.add('valid');
        }
        // Ak je niečo vyplnené - skontroluj chyby
        else {
            const hasEquipmentError = equipErr || membersErr;
            equipmentFieldset.classList.toggle('error', !!hasEquipmentError);
            equipmentFieldset.classList.toggle('valid', !hasEquipmentError);
        }
    }
}

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
        phone: validatePhoneNumber(phonePrefix, phoneNumber),
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

    // Spracovanie všetkých polí okrem phonePrefix, phone, otherEquipment a membersCount
    Object.keys(validateErrors).forEach(key => {
        if (key === 'phonePrefix' || key === 'phone' || key === 'otherEquipment' || key === 'membersCount') return;

        if (validateErrors[key]) {
            if (errors[key]) errors[key].textContent = validateErrors[key];
            if (inputs[key]) {
                inputs[key].classList.add('error');
                inputs[key].classList.remove('valid');
            }
            hasError = true;
        } else {
            if (errors[key]) errors[key].textContent = "";
            if (inputs[key]) {
                inputs[key].classList.remove('error');
                inputs[key].classList.add('valid');
            }
        }
    });

    if (!inputs.membersCount.value.trim() && !isAnyEquipmentSelected()) {
        inputs.membersCount.classList.remove('error');
        inputs.membersCount.classList.add('valid');
    }

    // Spracovanie telefónnych polí
    displayPhoneFieldsErrors(validateErrors);
    if (validateErrors.phonePrefix || validateErrors.phone) {
        hasError = true;
    }

    syncAgeField(dob, validateErrors.dob);
    highlightFieldsetsOnSubmit(validateErrors, isOtherEquipmentChecked);
    clearInactivePaymentFields(isCardPayment, isInvoicePayment);
    recalcPaymentState();

    if (!hasError) {
        generateOrderSummary();
        modal.style.display = 'block';
    }
});

// Modal listeners
confirmBtn.addEventListener('click', function () {
    const checkedEquipment = [];
    document.querySelectorAll('input[name^="equipment_"]:checked').forEach(cb => {
        if (cb.id !== 'otherEquipmentCheckbox') checkedEquipment.push(cb.value);
    });
    if (inputs.otherEquipmentCheckbox.checked && inputs.otherEquipmentInput.value.trim()) {
        checkedEquipment.push(inputs.otherEquipmentInput.value.trim());
    }
    document.getElementById('equipmentSummary').value = checkedEquipment.join(', ');

    document.querySelectorAll('input[name^="equipment_"], #otherEquipmentInput').forEach(el => {
        el.disabled = true;
    });

    modal.style.display = 'none';
    form.submit();
});

cancelBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

window.addEventListener('click', function (event) {
    if (event.target === modal) modal.style.display = 'none';
});