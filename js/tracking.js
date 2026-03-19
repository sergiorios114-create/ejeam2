/* ========================================
   EJAM - Google Tracking Loader
   Reads config from localStorage and
   dynamically injects GTM / GA4 / Google Ads
   ======================================== */

(function () {
  'use strict';

  var config = {
    gtm: localStorage.getItem('ejam_gtm_id') || '',
    ga4: localStorage.getItem('ejam_ga4_id') || '',
    gads: localStorage.getItem('ejam_gads_id') || '',
    gadsLabel: localStorage.getItem('ejam_gads_label') || '',
    gadsCallLabel: localStorage.getItem('ejam_gads_call_label') || ''
  };

  // ---- Google Tag Manager ----
  if (config.gtm) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', config.gtm);

    // noscript iframe fallback
    document.addEventListener('DOMContentLoaded', function () {
      var ns = document.createElement('noscript');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + config.gtm;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      ns.appendChild(iframe);
      document.body.insertBefore(ns, document.body.firstChild);
    });
  }

  // ---- GA4 + Google Ads via gtag.js ----
  if (config.ga4 || config.gads) {
    var gtagId = config.ga4 || config.gads;

    var gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + gtagId;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());

    if (config.ga4) {
      gtag('config', config.ga4);
    }

    if (config.gads) {
      gtag('config', config.gads);
    }
  }

  // ---- Conversion tracking on form submit ----
  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function () {
        if (config.gads && config.gadsLabel && window.gtag) {
          gtag('event', 'conversion', {
            'send_to': config.gads + '/' + config.gadsLabel
          });
        }
        if (config.ga4 && window.gtag) {
          gtag('event', 'form_submit', {
            'event_category': 'lead',
            'event_label': window.location.pathname
          });
        }
      });
    });

    // Track phone clicks
    var phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (config.gads && config.gadsCallLabel && window.gtag) {
          gtag('event', 'conversion', {
            'send_to': config.gads + '/' + config.gadsCallLabel
          });
        }
        if (config.ga4 && window.gtag) {
          gtag('event', 'phone_click', {
            'event_category': 'contact',
            'event_label': link.href
          });
        }
      });
    });

    // Track CTA button clicks
    var ctaButtons = document.querySelectorAll('.btn, .nav-cta');
    ctaButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (config.ga4 && window.gtag) {
          gtag('event', 'click_cta', {
            'event_category': 'engagement',
            'event_label': btn.textContent.trim()
          });
        }
      });
    });
  });
})();
