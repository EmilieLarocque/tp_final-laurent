// Validation JS personnalisée du formulaire de contact.
// La validation HTML5 native est désactivée (attribut novalidate sur le <form>) :
// chaque champ est vérifié ici et les messages d'erreur sont affichés à la main.

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('contact-form-status');
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const DEST_EMAIL = 'contact@exemple.com';

  const validators = {
    'contact-name': (value) => {
      if (value.trim().length === 0) return 'Ton nom est requis.';
      if (value.trim().length < 2) return 'Ton nom doit contenir au moins 2 caractères.';
      return '';
    },
    'contact-email': (value) => {
      if (value.trim().length === 0) return 'Ton adresse courriel est requise.';
      if (!EMAIL_PATTERN.test(value.trim())) return 'Format de courriel invalide (ex. : nom@domaine.com).';
      return '';
    },
    'contact-call-app': (value) => {
      if (value.trim().length > 60) return 'Maximum 60 caractères.';
      return '';
    },
    'contact-company': (value) => {
      if (value.trim().length > 80) return 'Maximum 80 caractères.';
      return '';
    },
    'contact-project-type': (value) => {
      if (value.trim().length === 0) return 'Choisis un type de projet.';
      return '';
    },
    'contact-budget': (value) => {
      const allowed = ['', 'moins-1000', '1000-3000', '3000-5000', 'plus-5000'];
      if (!allowed.includes(value)) return 'Choix de budget invalide.';
      return '';
    },
    'contact-deadline': (value) => {
      if (value.trim().length > 60) return 'Maximum 60 caractères.';
      return '';
    },
    'contact-message': (value) => {
      if (value.trim().length === 0) return 'Ton message est requis.';
      if (value.trim().length < 10) return 'Ton message doit contenir au moins 10 caractères.';
      return '';
    },
  };

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    const wrapper = field.closest('.contact-field');
    if (message) {
      wrapper.classList.add('contact-field--invalid');
      field.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    } else {
      wrapper.classList.remove('contact-field--invalid');
      field.setAttribute('aria-invalid', 'false');
      errorEl.textContent = '';
    }
    return message === '';
  }

  function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const validate = validators[fieldId];
    if (!field || !validate) return true;
    return showFieldError(fieldId, validate(field.value));
  }

  function selectedText(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value;
    if (!value) return '(non précisé)';
    const option = field.querySelector(`option[value="${value}"]`);
    return option ? option.textContent.trim() : value;
  }

  function textValue(fieldId) {
    const value = document.getElementById(fieldId).value.trim();
    return value || '(non précisé)';
  }

  function buildMailtoUrl() {
    const subject = `Nouveau message de ${textValue('contact-name')} — Portfolio`;
    const body = [
      `Nom : ${textValue('contact-name')}`,
      `Email : ${textValue('contact-email')}`,
      `Appli de visio préférée : ${textValue('contact-call-app')}`,
      `Entreprise / organisation : ${textValue('contact-company')}`,
      `Type de projet : ${selectedText('contact-project-type')}`,
      `Budget estimé : ${selectedText('contact-budget')}`,
      `Délai souhaité : ${textValue('contact-deadline')}`,
      '',
      'Message :',
      textValue('contact-message'),
    ].join('\n');
    return `mailto:${DEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  Object.keys(validators).forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(eventName, () => validateField(fieldId));
    field.addEventListener('blur', () => validateField(fieldId));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalidField = null;
    let allValid = true;
    Object.keys(validators).forEach((fieldId) => {
      const fieldIsValid = validateField(fieldId);
      if (!fieldIsValid) {
        allValid = false;
        if (!firstInvalidField) firstInvalidField = document.getElementById(fieldId);
      }
    });

    if (!allValid) {
      status.textContent = 'Corrige les champs en rouge avant d\'envoyer le formulaire.';
      status.classList.remove('contact-form__status--success');
      status.classList.add('contact-form__status--error');
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    // Pas de vrai backend ici : on ouvre le client courriel de la visite avec
    // un lien mailto pré-rempli, puis on redirige vers la page de confirmation.
    try {
      sessionStorage.setItem('contact-name', document.getElementById('contact-name').value.trim());
    } catch (err) {
      // sessionStorage indisponible (navigation privée, etc.) : la page de
      // confirmation retombera simplement sur son titre générique.
    }

    // Un clic sur un lien mailto invisible (plutôt que window.location.href)
    // laisse le navigateur ouvrir le client courriel sans quitter la page.
    const mailtoLink = document.createElement('a');
    mailtoLink.href = buildMailtoUrl();
    mailtoLink.click();

    // Petit délai pour laisser le temps au navigateur de proposer/ouvrir le
    // client courriel avant de rediriger vers la page de confirmation.
    window.setTimeout(() => {
      window.location.href = 'merci.html';
    }, 400);
  });
})();
