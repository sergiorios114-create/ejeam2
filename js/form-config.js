/* ========================================
   EJAM - Form Configuration Loader
   - form ID override
   - action, method
   - field ID/name overrides
   - hidden fields, data-* attributes
   - thank you page redirect
   ======================================== */

(function () {
  'use strict';

  var path = window.location.pathname;
  var page = 'index';
  if (path.indexOf('deudores') !== -1) page = 'deudores';
  else if (path.indexOf('pyme') !== -1) page = 'pyme';
  else if (path.indexOf('familia') !== -1) page = 'familia';

  var defaultFormIds = {
    index: 'form-inicio',
    deudores: 'form-deudores',
    pyme: 'form-pyme',
    familia: 'form-familia'
  };

  // Default thank you pages
  var defaultThankYou = {
    index: 'gracias-inicio.html',
    deudores: 'gracias-deudores.html',
    pyme: 'gracias-pyme.html',
    familia: 'gracias-familia.html'
  };

  var configKey = 'ejam_form_' + page;

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById(defaultFormIds[page]);
    if (!form) return;

    var raw = localStorage.getItem(configKey);
    var config = {};
    if (raw) {
      try { config = JSON.parse(raw); } catch (e) { config = {}; }
    }

    // Override form ID
    if (config.formId) {
      form.id = config.formId;
    }

    // Apply action
    if (config.action) {
      form.setAttribute('action', config.action);
    }

    // Apply method
    if (config.method) {
      form.setAttribute('method', config.method);
    }

    // Apply field ID and Name overrides
    if (config.fieldOverrides) {
      Object.keys(config.fieldOverrides).forEach(function (origId) {
        var overrides = config.fieldOverrides[origId];
        var el = document.getElementById(origId);
        if (!el) return;
        if (overrides.newId) {
          var label = form.querySelector('label[for="' + origId + '"]');
          if (label) label.setAttribute('for', overrides.newId);
          el.id = overrides.newId;
        }
        if (overrides.newName) {
          el.name = overrides.newName;
        }
      });
    }

    // Apply custom data attributes
    if (config.dataAttrs && Array.isArray(config.dataAttrs)) {
      config.dataAttrs.forEach(function (attr) {
        if (attr.name && attr.value) {
          form.setAttribute('data-' + attr.name, attr.value);
        }
      });
    }

    // Insert hidden fields
    if (config.hiddenFields && Array.isArray(config.hiddenFields)) {
      config.hiddenFields.forEach(function (field) {
        if (field.name) {
          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = field.name;
          input.value = field.value || '';
          if (field.id) input.id = field.id;
          form.appendChild(input);
        }
      });
    }

    // Thank you page redirect on submit
    // Only redirect if NO action is set (if action is set, the form posts to a server)
    var thankYouUrl = config.thankYouUrl || defaultThankYou[page];
    if (!config.action && thankYouUrl) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        // Basic validation
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        // Redirect to thank you page
        window.location.href = thankYouUrl;
      });
    }
  });
})();
