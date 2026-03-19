/* ========================================
   EJAM Admin Panel - Real Configuration
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
  // ---- Date ----
  var dateEl = document.getElementById('currentDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('es-CL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  // ---- Navigation ----
  var navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  var sections = document.querySelectorAll('.panel-section');
  var pageTitle = document.getElementById('pageTitle');
  var titles = {
    'integraciones': 'Integraciones Google',
    'formularios': 'Gestión de Formularios',
    'eventos': 'Eventos y Conversiones',
    'verificar': 'Verificar Instalación',
    'config': 'Configuración'
  };

  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var sec = item.dataset.section;
      if (!sec) return;
      navItems.forEach(function (n) { n.classList.remove('active'); });
      item.classList.add('active');
      sections.forEach(function (s) { s.classList.remove('active'); });
      var target = document.getElementById('sec-' + sec);
      if (target) target.classList.add('active');
      if (pageTitle && titles[sec]) pageTitle.textContent = titles[sec];
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  // ---- Sidebar toggle (mobile) ----
  var toggleBtn = document.getElementById('sidebarToggle');
  var sidebar = document.getElementById('sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // ---- Load saved values ----
  loadAllConfig();
  updateStatusOverview();
});

// ---- CONFIG KEYS ----
var KEYS = {
  gtm: 'ejam_gtm_id',
  ga4: 'ejam_ga4_id',
  gads: 'ejam_gads_id',
  gadsLabel: 'ejam_gads_label',
  gadsCallLabel: 'ejam_gads_call_label',
  email: 'ejam_cfg_email',
  phone: 'ejam_cfg_phone'
};

function loadAllConfig() {
  setVal('gtmId', KEYS.gtm);
  setVal('ga4Id', KEYS.ga4);
  setVal('gadsId', KEYS.gads);
  setVal('gadsLabel', KEYS.gadsLabel);
  setVal('gadsCallLabel', KEYS.gadsCallLabel);
  setVal('cfgEmail', KEYS.email);
  setVal('cfgPhone', KEYS.phone);

  updateBadge('gtmBadge', localStorage.getItem(KEYS.gtm));
  updateBadge('ga4Badge', localStorage.getItem(KEYS.ga4));
  updateBadge('gadsBadge', localStorage.getItem(KEYS.gads));
}

function setVal(elId, key) {
  var el = document.getElementById(elId);
  var val = localStorage.getItem(key);
  if (el && val) el.value = val;
}

function updateBadge(badgeId, value) {
  var badge = document.getElementById(badgeId);
  if (!badge) return;
  if (value) {
    badge.textContent = 'Activo: ' + value;
    badge.className = 'status-badge active';
  } else {
    badge.textContent = 'No configurado';
    badge.className = 'status-badge pending';
  }
}

function updateStatusOverview() {
  var overview = document.getElementById('statusOverview');
  if (!overview) return;

  var gtm = localStorage.getItem(KEYS.gtm);
  var ga4 = localStorage.getItem(KEYS.ga4);
  var gads = localStorage.getItem(KEYS.gads);
  var total = (gtm ? 1 : 0) + (ga4 ? 1 : 0) + (gads ? 1 : 0);

  var html = '<div class="overview-cards">';
  html += statusCard('GTM', gtm, 'Tag Manager');
  html += statusCard('GA4', ga4, 'Analytics');
  html += statusCard('ADS', gads, 'Conversiones');
  html += '</div>';

  if (total === 0) {
    html += '<div class="overview-msg warning">Ninguna integración configurada. Ingresa tus IDs de Google abajo para activar el tracking en todo el sitio.</div>';
  } else if (total < 3) {
    html += '<div class="overview-msg info">' + total + ' de 3 integraciones activas. Configura las restantes para aprovechar al máximo el monitoreo.</div>';
  } else {
    html += '<div class="overview-msg success">Todas las integraciones activas. El tracking está funcionando en todas las páginas del sitio.</div>';
  }

  overview.innerHTML = html;
}

function statusCard(label, value, desc) {
  var active = value ? 'active' : 'pending';
  var icon = value ? '✓' : '—';
  return '<div class="overview-card ' + active + '">' +
    '<div class="overview-icon">' + label + '</div>' +
    '<div class="overview-info">' +
    '<span class="overview-name">' + desc + '</span>' +
    '<span class="overview-value">' + (value || 'Sin configurar') + '</span>' +
    '</div>' +
    '<span class="overview-check">' + icon + '</span>' +
    '</div>';
}

// ---- SAVE CONFIG ----
function saveConfig(type) {
  if (type === 'gtm') {
    var id = document.getElementById('gtmId').value.trim();
    if (id && !id.match(/^GTM-/i)) { alert('El ID de GTM debe empezar con GTM-'); return; }
    save(KEYS.gtm, id);
    updateBadge('gtmBadge', id);
  }
  else if (type === 'ga4') {
    var id = document.getElementById('ga4Id').value.trim();
    if (id && !id.match(/^G-/i)) { alert('El Measurement ID debe empezar con G-'); return; }
    save(KEYS.ga4, id);
    updateBadge('ga4Badge', id);
  }
  else if (type === 'gads') {
    var id = document.getElementById('gadsId').value.trim();
    if (id && !id.match(/^AW-/i)) { alert('El Conversion ID debe empezar con AW-'); return; }
    save(KEYS.gads, id);
    save(KEYS.gadsLabel, document.getElementById('gadsLabel').value.trim());
    save(KEYS.gadsCallLabel, document.getElementById('gadsCallLabel').value.trim());
    updateBadge('gadsBadge', id);
  }
  else if (type === 'site') {
    save(KEYS.email, document.getElementById('cfgEmail').value.trim());
    save(KEYS.phone, document.getElementById('cfgPhone').value.trim());
  }

  updateStatusOverview();
  showNotification('Configuración guardada correctamente');
}

function save(key, value) {
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}

// ---- CLEAR CONFIG ----
function clearAllConfig() {
  if (!confirm('¿Estás seguro? Se eliminarán todos los IDs de Google guardados.')) return;
  Object.values(KEYS).forEach(function (key) { localStorage.removeItem(key); });
  location.reload();
}

// ---- VERIFICATION ----
function runVerification() {
  var results = document.getElementById('verifyResults');
  var gtm = localStorage.getItem(KEYS.gtm);
  var ga4 = localStorage.getItem(KEYS.ga4);
  var gads = localStorage.getItem(KEYS.gads);
  var gadsLabel = localStorage.getItem(KEYS.gadsLabel);

  var html = '<div class="verify-list">';

  // Check tracking.js
  html += verifyItem(true, 'tracking.js incluido en todas las páginas', 'El script está en index.html, deudores.html, familia.html y tesoreria.html');

  // Check GTM
  if (gtm) {
    html += verifyItem(true, 'Google Tag Manager configurado', 'Container ID: ' + gtm);
  } else {
    html += verifyItem(false, 'Google Tag Manager no configurado', 'Ingresa tu Container ID en la sección de Integraciones');
  }

  // Check GA4
  if (ga4) {
    html += verifyItem(true, 'Google Analytics 4 configurado', 'Measurement ID: ' + ga4 + ' — Verifica en GA4 Real-Time que llegan visitas');
  } else {
    html += verifyItem(false, 'Google Analytics 4 no configurado', 'Ingresa tu Measurement ID en la sección de Integraciones');
  }

  // Check Google Ads
  if (gads) {
    html += verifyItem(true, 'Google Ads Conversion ID configurado', 'ID: ' + gads);
    if (gadsLabel) {
      html += verifyItem(true, 'Conversión de formulario configurada', 'Label: ' + gadsLabel + ' — Se dispara al enviar formulario');
    } else {
      html += verifyItem(false, 'Conversion Label de formulario faltante', 'Sin el label, no se rastrearán envíos de formulario como conversiones en Ads');
    }
  } else {
    html += verifyItem(false, 'Google Ads no configurado', 'Ingresa tu Conversion ID para rastrear conversiones de tus campañas');
  }

  // Check dataLayer
  html += verifyItem(true, 'dataLayer inicializado', 'window.dataLayer disponible para GTM y gtag.js');

  html += '</div>';
  results.innerHTML = html;
}

function verifyItem(pass, title, desc) {
  var cls = pass ? 'pass' : 'fail';
  var icon = pass ? '✓' : '✗';
  return '<div class="verify-item ' + cls + '">' +
    '<span class="verify-icon">' + icon + '</span>' +
    '<div class="verify-info">' +
    '<span class="verify-title">' + title + '</span>' +
    '<span class="verify-desc">' + desc + '</span>' +
    '</div></div>';
}

// ========================================
// FORMS MANAGEMENT
// ========================================
var currentFormPage = 'index';
var formPageNames = { index: 'Inicio', deudores: 'Deudores', pyme: 'PYME', familia: 'Familia' };
var defaultFormIds = { index: 'form-inicio', deudores: 'form-deudores', pyme: 'form-pyme', familia: 'form-familia' };

// Original field definitions per page
var FORM_FIELDS = {
  index: [
    { label: 'Nombre completo', origId: 'nombre', origName: 'nombre', type: 'text', required: true },
    { label: 'Email', origId: 'email', origName: 'email', type: 'email', required: true },
    { label: 'Teléfono', origId: 'telefono', origName: 'telefono', type: 'tel', required: true },
    { label: 'Área de ayuda', origId: 'area', origName: 'area', type: 'select', required: true },
    { label: 'Mensaje', origId: 'mensaje', origName: 'mensaje', type: 'textarea', required: false },
    { label: 'Política privacidad', origId: 'politica', origName: 'politica', type: 'checkbox', required: true }
  ],
  deudores: [
    { label: 'Nombre completo', origId: 'nombre', origName: 'nombre', type: 'text', required: true },
    { label: 'Email', origId: 'email', origName: 'email', type: 'email', required: true },
    { label: 'Teléfono', origId: 'telefono', origName: 'telefono', type: 'tel', required: true },
    { label: 'Confirmar Teléfono', origId: 'confirmar_telefono', origName: 'confirmar_telefono', type: 'tel', required: true },
    { label: 'Monto deuda', origId: 'monto_deuda', origName: 'monto_deuda', type: 'select', required: true },
    { label: 'Entidad', origId: 'entidad', origName: 'entidad', type: 'select', required: true },
    { label: 'Tiempo sin pagar', origId: 'tiempo_sin_pagar', origName: 'tiempo_sin_pagar', type: 'select', required: true },
    { label: '¿Tiene demanda?', origId: 'demanda', origName: 'demanda', type: 'select', required: true },
    { label: '¿Descuento planilla?', origId: 'descuento_planilla', origName: 'descuento_planilla', type: 'select', required: true },
    { label: 'Política privacidad', origId: 'politica', origName: 'politica', type: 'checkbox', required: true }
  ],
  familia: [
    { label: 'Nombre completo', origId: 'nombre', origName: 'nombre', type: 'text', required: true },
    { label: 'Email', origId: 'email', origName: 'email', type: 'email', required: true },
    { label: 'Teléfono', origId: 'telefono', origName: 'telefono', type: 'tel', required: true },
    { label: 'Tipo consulta', origId: 'tipo_consulta', origName: 'tipo_consulta', type: 'select', required: true },
    { label: 'Domicilio distinto', origId: 'domicilio_distinto', origName: 'domicilio_distinto', type: 'select', required: true },
    { label: 'Cónyuge en Chile', origId: 'conyuge_chile', origName: 'conyuge_chile', type: 'select', required: true },
    { label: 'Situación', origId: 'situacion', origName: 'situacion', type: 'textarea', required: false },
    { label: 'Política privacidad', origId: 'politica', origName: 'politica', type: 'checkbox', required: true }
  ],
  pyme: [
    { label: 'Nombre completo', origId: 'nombre', origName: 'nombre', type: 'text', required: true },
    { label: 'Email', origId: 'email', origName: 'email', type: 'email', required: true },
    { label: 'Teléfono', origId: 'telefono', origName: 'telefono', type: 'tel', required: true },
    { label: 'Servicio PYME', origId: 'servicio_pyme', origName: 'servicio_pyme', type: 'select', required: true },
    { label: 'Tipo empresa', origId: 'tipo_empresa', origName: 'tipo_empresa', type: 'select', required: true },
    { label: 'Antigüedad', origId: 'antiguedad', origName: 'antiguedad', type: 'select', required: false },
    { label: 'Situación', origId: 'situacion', origName: 'situacion', type: 'textarea', required: false },
    { label: 'Política privacidad', origId: 'politica', origName: 'politica', type: 'checkbox', required: true }
  ]
};

var pageFiles = { index: 'index.html', deudores: 'deudores.html', pyme: 'pyme.html', familia: 'familia.html' };

document.addEventListener('DOMContentLoaded', function () {
  // Build editable tables for all pages
  Object.keys(FORM_FIELDS).forEach(function (page) { buildFieldsTable(page); });

  // Tab switching
  var tabs = document.querySelectorAll('.form-tab');
  var contents = document.querySelectorAll('.form-tab-content');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      contents.forEach(function (c) { c.classList.remove('active'); });
      tab.classList.add('active');
      var page = tab.dataset.form;
      document.getElementById('formtab-' + page).classList.add('active');
      currentFormPage = page;
      document.getElementById('formConfigTitle').textContent = formPageNames[page];
      loadFormConfig(page);
    });
  });

  // Load initial
  loadFormConfig('index');
});

function buildFieldsTable(page) {
  var container = document.getElementById('formtab-' + page);
  if (!container) return;

  var config = getFormConfig(page);
  var fieldOverrides = config.fieldOverrides || {};
  var fields = FORM_FIELDS[page];

  var formIdOverride = config.formId || '';

  var html = '<h4 class="form-page-title">' + pageFiles[page] + ' <a href="../' + pageFiles[page] + '#contacto" target="_blank" class="page-link">Abrir ↗</a></h4>';

  // Form ID row
  html += '<div class="form-id-row">';
  html += '<span class="form-id-label">ID del formulario:</span>';
  html += '<code>' + defaultFormIds[page] + '</code>';
  html += '<span class="form-id-arrow">→</span>';
  html += '<input type="text" class="field-edit form-id-input" data-page="' + page + '" id="formIdOverride-' + page + '" placeholder="' + defaultFormIds[page] + '" value="' + formIdOverride + '">';
  html += '</div>';

  html += '<table class="fields-table"><thead><tr><th>Label</th><th>ID original</th><th>Nuevo ID</th><th>Nuevo Name</th><th>Tipo</th><th>Req.</th></tr></thead><tbody>';

  fields.forEach(function (f) {
    var ov = fieldOverrides[f.origId] || {};
    html += '<tr>' +
      '<td>' + f.label + '</td>' +
      '<td><code>' + f.origId + '</code></td>' +
      '<td><input type="text" class="field-edit" data-page="' + page + '" data-orig="' + f.origId + '" data-prop="newId" placeholder="' + f.origId + '" value="' + (ov.newId || '') + '"></td>' +
      '<td><input type="text" class="field-edit" data-page="' + page + '" data-orig="' + f.origId + '" data-prop="newName" placeholder="' + f.origName + '" value="' + (ov.newName || '') + '"></td>' +
      '<td>' + f.type + '</td>' +
      '<td>' + (f.required ? '✓' : '—') + '</td>' +
      '</tr>';
  });

  html += '</tbody></table>';
  html += '<p class="edit-hint">Deja vacío para mantener el valor original. Los cambios se aplican al guardar.</p>';
  container.innerHTML = html;
}

function getFormConfig(page) {
  var raw = localStorage.getItem('ejam_form_' + page);
  return raw ? JSON.parse(raw) : {};
}

function loadFormConfig(page) {
  var config = getFormConfig(page);

  var defaultTY = { index: 'gracias-inicio.html', deudores: 'gracias-deudores.html', pyme: 'gracias-pyme.html', familia: 'gracias-familia.html' };

  document.getElementById('formAction').value = config.action || '';
  document.getElementById('formMethod').value = config.method || '';
  document.getElementById('formThankYou').value = config.thankYouUrl || '';
  document.getElementById('formThankYou').placeholder = defaultTY[page] || '';
  document.getElementById('thankYouDefault').textContent = 'Por defecto: ' + (defaultTY[page] || '') + ' — deja vacío para usar la predeterminada';

  // Hidden fields
  var container = document.getElementById('hiddenFieldsList');
  container.innerHTML = '';
  if (config.hiddenFields && config.hiddenFields.length) {
    config.hiddenFields.forEach(function (f, i) {
      container.appendChild(createFieldRow(f.name, f.value, f.id || '', i));
    });
  }

  // Data attributes
  var attrContainer = document.getElementById('dataAttrsList');
  attrContainer.innerHTML = '';
  if (config.dataAttrs && config.dataAttrs.length) {
    config.dataAttrs.forEach(function (a, i) {
      attrContainer.appendChild(createAttrRow(a.name, a.value, i));
    });
  }

  // Badge
  var badge = document.getElementById('formConfigBadge');
  var hasConfig = config.action || (config.hiddenFields && config.hiddenFields.length) || (config.dataAttrs && config.dataAttrs.length) || (config.fieldOverrides && Object.keys(config.fieldOverrides).length);
  badge.textContent = hasConfig ? 'Configurado' : 'Sin configurar';
  badge.className = 'status-badge ' + (hasConfig ? 'active' : 'pending');
}

function createFieldRow(name, value, id, index) {
  var row = document.createElement('div');
  row.className = 'dynamic-row';
  row.innerHTML =
    '<input type="text" class="panel-input small" placeholder="name" value="' + (name || '') + '">' +
    '<input type="text" class="panel-input small" placeholder="value" value="' + (value || '') + '">' +
    '<input type="text" class="panel-input small" placeholder="id (opcional)" value="' + (id || '') + '">' +
    '<button class="btn-remove" onclick="this.parentElement.remove()">✕</button>';
  return row;
}

function createAttrRow(name, value, index) {
  var row = document.createElement('div');
  row.className = 'dynamic-row';
  row.innerHTML =
    '<span class="attr-prefix">data-</span>' +
    '<input type="text" class="panel-input small" placeholder="nombre" value="' + (name || '') + '">' +
    '<input type="text" class="panel-input small" placeholder="valor" value="' + (value || '') + '">' +
    '<button class="btn-remove" onclick="this.parentElement.remove()">✕</button>';
  return row;
}

function addHiddenField() {
  var container = document.getElementById('hiddenFieldsList');
  container.appendChild(createFieldRow('', '', '', container.children.length));
}

function addDataAttr() {
  var container = document.getElementById('dataAttrsList');
  container.appendChild(createAttrRow('', '', container.children.length));
}

function saveFormConfig() {
  var config = {};

  // Form ID override
  var formIdInput = document.getElementById('formIdOverride-' + currentFormPage);
  var formIdVal = formIdInput ? formIdInput.value.trim() : '';
  if (formIdVal) config.formId = formIdVal;

  var action = document.getElementById('formAction').value.trim();
  var method = document.getElementById('formMethod').value;
  var thankYou = document.getElementById('formThankYou').value.trim();
  if (action) config.action = action;
  if (method) config.method = method;
  if (thankYou) config.thankYouUrl = thankYou;

  // Collect field overrides from the editable table
  var fieldOverrides = {};
  var fieldInputs = document.querySelectorAll('.field-edit[data-page="' + currentFormPage + '"]');
  fieldInputs.forEach(function (input) {
    var origId = input.dataset.orig;
    var prop = input.dataset.prop;
    var val = input.value.trim();
    if (val) {
      if (!fieldOverrides[origId]) fieldOverrides[origId] = {};
      fieldOverrides[origId][prop] = val;
    }
  });
  if (Object.keys(fieldOverrides).length) config.fieldOverrides = fieldOverrides;

  // Collect hidden fields
  var hiddenRows = document.getElementById('hiddenFieldsList').querySelectorAll('.dynamic-row');
  var hiddenFields = [];
  hiddenRows.forEach(function (row) {
    var inputs = row.querySelectorAll('input');
    var name = inputs[0].value.trim();
    var value = inputs[1].value.trim();
    var id = inputs[2] ? inputs[2].value.trim() : '';
    if (name) hiddenFields.push({ name: name, value: value, id: id });
  });
  if (hiddenFields.length) config.hiddenFields = hiddenFields;

  // Collect data attributes
  var attrRows = document.getElementById('dataAttrsList').querySelectorAll('.dynamic-row');
  var dataAttrs = [];
  attrRows.forEach(function (row) {
    var inputs = row.querySelectorAll('input');
    var name = inputs[0].value.trim();
    var value = inputs[1].value.trim();
    if (name) dataAttrs.push({ name: name, value: value });
  });
  if (dataAttrs.length) config.dataAttrs = dataAttrs;

  // Save
  var key = 'ejam_form_' + currentFormPage;
  if (Object.keys(config).length > 0) {
    localStorage.setItem(key, JSON.stringify(config));
  } else {
    localStorage.removeItem(key);
  }

  loadFormConfig(currentFormPage);
  showNotification('Configuración del formulario de ' + formPageNames[currentFormPage] + ' guardada');
}

// ---- NOTIFICATION ----
function showNotification(msg) {
  var existing = document.querySelector('.notification');
  if (existing) existing.remove();

  var notif = document.createElement('div');
  notif.className = 'notification';
  notif.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ' + msg;
  document.body.appendChild(notif);

  setTimeout(function () { notif.classList.add('show'); }, 10);
  setTimeout(function () { notif.classList.remove('show'); }, 2500);
  setTimeout(function () { notif.remove(); }, 3000);
}
