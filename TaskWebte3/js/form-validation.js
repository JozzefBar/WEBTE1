// Contact Form Handler with Validation
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const subjectInput = document.getElementById('contactSubject');
        const messageInput = document.getElementById('contactMessage');

        nameInput.addEventListener('blur', () => validateName());
        emailInput.addEventListener('blur', () => validateEmail());
        subjectInput.addEventListener('blur', () => validateSubject());
        messageInput.addEventListener('blur', () => validateMessage());

        const errorMap = {
            'contactName': 'nameError',
            'contactEmail': 'emailError',
            'contactSubject': 'subjectError',
            'contactMessage': 'messageError'
        };

        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            input.addEventListener('focus', () => {
                input.classList.remove('input-error');
                const errorId = errorMap[input.id];
                const errorDiv = document.getElementById(errorId);
                if (errorDiv) {
                    errorDiv.classList.remove('active');
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearFormErrors();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isSubjectValid = validateSubject();
            const isMessageValid = validateMessage();

            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                const name = nameInput.value;
                const email = emailInput.value;
                const subject = subjectInput.value;
                const message = messageInput.value;

                console.log('Kontaktný formulár odoslaný:', {
                    name,
                    email,
                    subject,
                    message
                });

                showToast('Správa bola úspešne odoslaná! Čoskoro vás budeme kontaktovať.', 'success');
                contactForm.reset();
                clearFormErrors();
            } else {
                showToast('Prosím, skontrolujte všetky polia formulára', 'info');
            }
        });
    }
}

function validateName() {
    const nameInput = document.getElementById('contactName');
    const errorDiv = document.getElementById('nameError');
    const value = nameInput.value.trim();

    if (value.length < 2) {
        nameInput.classList.add('input-error');
        errorDiv.textContent = 'Meno musí obsahovať aspoň 2 znaky';
        errorDiv.classList.add('active');
        return false;
    }

    nameInput.classList.remove('input-error');
    errorDiv.classList.remove('active');
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('contactEmail');
    const errorDiv = document.getElementById('emailError');
    const value = emailInput.value.trim();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
        emailInput.classList.add('input-error');
        errorDiv.textContent = 'Zadajte platnú emailovú adresu (bez diakritiky)';
        errorDiv.classList.add('active');
        return false;
    }

    emailInput.classList.remove('input-error');
    errorDiv.classList.remove('active');
    return true;
}

function validateSubject() {
    const subjectInput = document.getElementById('contactSubject');
    const errorDiv = document.getElementById('subjectError');
    const value = subjectInput.value.trim();

    if (value.length < 3) {
        subjectInput.classList.add('input-error');
        errorDiv.textContent = 'Predmet musí obsahovať aspoň 3 znaky';
        errorDiv.classList.add('active');
        return false;
    }

    subjectInput.classList.remove('input-error');
    errorDiv.classList.remove('active');
    return true;
}

function validateMessage() {
    const messageInput = document.getElementById('contactMessage');
    const errorDiv = document.getElementById('messageError');
    const value = messageInput.value.trim();

    if (value.length < 5) {
        messageInput.classList.add('input-error');
        errorDiv.textContent = 'Správa musí obsahovať aspoň 5 znakov';
        errorDiv.classList.add('active');
        return false;
    }

    messageInput.classList.remove('input-error');
    errorDiv.classList.remove('active');
    return true;
}

function clearFormErrors() {
    const inputs = document.querySelectorAll('.input-error');
    inputs.forEach(input => input.classList.remove('input-error'));

    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.classList.remove('active'));
}
