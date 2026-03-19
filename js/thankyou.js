/* ========================================
   EJAM - Thank You Page Conversion Trigger
   Fires Google Ads conversion + GA4 event
   when a thank you page loads
   ======================================== */

(function () {
  'use strict';

  // Wait for tracking.js to initialize gtag
  window.addEventListener('load', function () {
    var gads = localStorage.getItem('ejam_gads_id') || '';
    var gadsLabel = localStorage.getItem('ejam_gads_label') || '';
    var ga4 = localStorage.getItem('ejam_ga4_id') || '';

    // Detect which service from the URL
    var path = window.location.pathname;
    var service = 'general';
    if (path.indexOf('deudores') !== -1) service = 'deudores';
    else if (path.indexOf('familia') !== -1) service = 'familia';
    else if (path.indexOf('tesoreria') !== -1) service = 'tesoreria';

    // Fire Google Ads conversion
    if (gads && gadsLabel && window.gtag) {
      gtag('event', 'conversion', {
        'send_to': gads + '/' + gadsLabel
      });
    }

    // Fire GA4 conversion event
    if (ga4 && window.gtag) {
      gtag('event', 'generate_lead', {
        'event_category': 'conversion',
        'event_label': service,
        'value': 1
      });
    }
  });
})();
