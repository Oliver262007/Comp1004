var classes = [
  { id: 'c1',  activity: 'Yoga',         instructor: 'Amy',     date: todayPlus(0), start: '09:00', end: '10:00', spots: 12 },
  { id: 'c2',  activity: 'Yoga',         instructor: 'Amy',     date: todayPlus(2), start: '19:15', end: '20:45', spots: 12 },
  { id: 'c3',  activity: 'Yoga',         instructor: 'Hannah',  date: todayPlus(3), start: '05:45', end: '6:45',  spots: 6  },
  { id: 'c4',  activity: 'Running Club', instructor: 'Harvey',  date: todayPlus(0), start: '08:30', end: '10:30', spots: 8  },
  { id: 'c5',  activity: 'Running Club', instructor: 'Harvey',  date: todayPlus(0), start: '06:30', end: '07:15', spots: 25 },
  { id: 'c6',  activity: 'Running club', instructor: 'Fred',    date: todayPlus(1), start: '07:15', end: '09:15', spots: 14 }, // Note: 'Running club' (lowercase c) differs from 'Running Club' above — likely a typo
  { id: 'c7',  activity: 'Swim Lanes',   instructor: 'Tom',     date: todayPlus(2), start: '09:45', end: '11:15', spots: 12 },
  { id: 'c8',  activity: 'Swim Lanes',   instructor: 'Fred',    date: todayPlus(3), start: '12:00', end: '14:00', spots: 10 },
  { id: 'c9',  activity: 'Swim Lanes',   instructor: 'Hannah',  date: todayPlus(0), start: '14:00', end: '15:00', spots: 13 },
  { id: 'c10', activity: 'Family Swim',  instructor: 'Fred',    date: todayPlus(4), start: '16:00', end: '18:30', spots: 30 },
  { id: 'c11', activity: 'Family Swim',  instructor: 'Tom',     date: todayPlus(5), start: '17:15', end: '19:45', spots: 26 },
  { id: 'c12', activity: 'Family Swim',  instructor: 'Hannah',  date: todayPlus(1), start: '09:30', end: '11:00', spots: 40 },
  { id: 'c13', activity: 'Climbing',     instructor: 'Jacob',   date: todayPlus(2), start: '18:30', end: '20:00', spots: 2  },
  { id: 'c14', activity: 'Climbing',     instructor: 'Fred',    date: todayPlus(3), start: '20:15', end: '21:45', spots: 4  },
  { id: 'c15', activity: 'Climbing',     instructor: 'Jacob',   date: todayPlus(2), start: '15:00', end: '16:00', spots: 8  },
  { id: 'c16', activity: 'Table Tennis', instructor: 'Tom',     date: todayPlus(3), start: '19:00', end: '20:00', spots: 12 },
  { id: 'c17', activity: 'Table Tennis', instructor: 'Tom',     date: todayPlus(4), start: '08:00', end: '09:00', spots: 19 },
  { id: 'c18', activity: 'Table Tennis', instructor: 'Fred',    date: todayPlus(5), start: '20:00', end: '21:00', spots: 8  },
  { id: 'c19', activity: 'Badminton',    instructor: 'Olly',    date: todayPlus(1), start: '20:00', end: '21:00', spots: 12 },
  { id: 'c20', activity: 'Badminton',    instructor: 'James',   date: todayPlus(2), start: '17:00', end: '18:00', spots: 15 },
  { id: 'c21', activity: 'Badminton',    instructor: 'Harvey',  date: todayPlus(3), start: '08:00', end: '10:30', spots: 26 },
];
 
// If previously saved class data exists in localStorage (e.g. after a booking
// reduced spot counts), restore it to override the defaults above.
// Silently ignores any parse errors to avoid breaking page load.
try {
  var saved = localStorage.getItem('classes_data');
  if (saved) {
    var parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length) classes = parsed;
  }
} catch (e) { /* Ignore malformed localStorage data */ }
 
// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
 
/**
 * Returns a date string (YYYY-MM-DD) for today offset by n days.
 * n=0 → today, n=1 → tomorrow, n=-1 → yesterday, etc.
 */
function todayPlus(n) {
  var d = new Date();
  d.setDate(d.getDate() + n);
  var y = d.getFullYear();
  var m = ('0' + (d.getMonth()+1)).slice(-2); // Zero-pad month
  var day = ('0' + d.getDate()).slice(-2);     // Zero-pad day
  return y + '-' + m + '-' + day;
}
 
/**
 * Converts a time string "HH:MM" into a total number of minutes since midnight.
 * Used for range comparisons in filtering and isNow checks.
 */
function timeToMinutes(t) {
  var parts = t.split(':');
  return parseInt(parts[0],10) * 60 + parseInt(parts[1],10);
}
 
/**
 * Escapes special HTML characters in a string to prevent XSS when
 * inserting user-supplied or data-driven content into innerHTML.
 */
function escapeHtml(s) {
  if (!s) return '';
  return s
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}
 
// =============================================================================
// DOM ELEMENT REFERENCES
// Grabbed once at script parse time so they can be reused throughout.
// =============================================================================
 
// Import / export controls
var exportJsonBtn  = document.getElementById('exportJsonBtn');
var importJsonInput = document.getElementById('importJsonInput');
 
// Filter panel controls
var activityFilter   = document.getElementById('activityFilter');
var instructorFilter = document.getElementById('instructorFilter');
var dateFilter       = document.getElementById('dateFilter');
var timeFrom         = document.getElementById('timeFrom');
var timeTo           = document.getElementById('timeTo');
var applyBtn         = document.getElementById('applyBtn');
var clearBtn         = document.getElementById('clearBtn');
 
// Schedule display
var scheduleList = document.getElementById('scheduleList');
var noResults    = document.getElementById('noResults');
var nowText      = document.getElementById('nowText'); // Live clock display
 
// Booking form controls
var classSelect  = document.getElementById('classSelect');
var bookingForm  = document.getElementById('bookingForm');
var nameInput    = document.getElementById('name');
var emailInput   = document.getElementById('email');
 
// Booking confirmation dialog
var confirmBox   = document.getElementById('confirm');
var confirmText  = document.getElementById('confirmText');
var closeConfirm = document.getElementById('closeConfirm');
var resetBtn     = document.getElementById('resetBtn');
 
// =============================================================================
// INITIALISATION
// Runs once the DOM is fully loaded.
// =============================================================================
window.onload = function() {
  populateFilters();       // Fill activity and instructor dropdowns
  populateClassSelect();   // Fill the booking class picker
  renderSchedule(classes); // Show the full class list
  updateNow();             // Display current time and apply initial filters
  setInterval(updateNow, 30000); // Refresh clock and schedule every 30 seconds
 
  // Wire up import/export buttons
  exportJsonBtn.onclick  = exportClassesToJson;
  importJsonInput.onchange = importClassesFromJson;
 
  // Wire up filter controls
  applyBtn.onclick = applyFilters;
  clearBtn.onclick = clearFilters;
 
  // Wire up booking form
  bookingForm.onsubmit = submitBooking;
 
  // Close the confirmation dialog when the close button is clicked
  closeConfirm.onclick = function(){ confirmBox.style.display = 'none'; };
 
  // Reset the booking form to its empty state
  resetBtn.onclick = function(){ bookingForm.reset(); };
 
  // Clicking any class card pre-selects that class in the booking dropdown
  // and smoothly scrolls down to the booking panel.
  scheduleList.onclick = function(e){
    var el = e.target;
    // Walk up the DOM tree until we find the class-card container
    while (el && !el.classList.contains('class-card')) el = el.parentNode;
    if (el) {
      var id = el.getAttribute('data-id');
      classSelect.value = id;
      document.getElementById('bookingPanel').scrollIntoView({behavior:'smooth'});
    }
  };
};
 
// =============================================================================
// FILTER FUNCTIONS
// =============================================================================
 
/**
 * Populates the activity and instructor filter dropdowns with the unique
 * values found in the current classes array.
 * Resets each dropdown to just its placeholder option first to avoid
 * duplicates when called after an import.
 */
function populateFilters() {
  var acts = {}; // Unique activity names
  var ins  = {}; // Unique instructor names
  for (var i = 0; i < classes.length; i++) {
    acts[classes[i].activity]   = true;
    ins[classes[i].instructor]  = true;
  }
 
  // Reset to placeholder only (index 1 keeps the first "All" option)
  activityFilter.options.length   = 1;
  instructorFilter.options.length = 1;
 
  for (var a in acts) {
    var o = document.createElement('option');
    o.value = a; o.text = a;
    activityFilter.add(o);
  }
  for (var j in ins) {
    var o2 = document.createElement('option');
    o2.value = j; o2.text = j;
    instructorFilter.add(o2);
  }
}
 
/**
 * Rebuilds the booking form's class <select> from the current classes array.
 * Disabled options are added for fully-booked classes (spots <= 0).
 */
function populateClassSelect() {
  classSelect.options.length = 0; // Clear existing options
  for (var i = 0; i < classes.length; i++) {
    var c = classes[i];
    var opt = document.createElement('option');
    opt.value = c.id;
    opt.text  = c.activity + ' - ' + c.date + ' ' + c.start +
                ' (' + c.instructor + ') - ' + c.spots + ' spots';
    if (c.spots <= 0) opt.disabled = true; // Prevent selecting full classes
    classSelect.add(opt);
  }
}
 
/**
 * Renders the schedule list from the provided array of class objects.
 * Shows a "no results" message if the list is empty.
 * Highlights currently-running classes with a green left border.
 */
function renderSchedule(list) {
  scheduleList.innerHTML = ''; // Clear previous cards
 
  if (!list || list.length === 0) {
    noResults.style.display = 'block';
    return;
  } else {
    noResults.style.display = 'none';
  }
 
  for (var i = 0; i < list.length; i++) {
    var c = list[i];
 
    // Create the card container; mark fully-booked classes with 'full' class
    var card = document.createElement('div');
    card.className = 'class-card';
    if (c.spots <= 0) card.className += ' full';
    card.setAttribute('data-id', c.id); // Used by the click handler to identify the class
 
    // Left column: activity title and date/time range
    var left = document.createElement('div');
    left.className = 'class-left';
    left.innerHTML = '<div class="class-title">'  + escapeHtml(c.activity) + '</div>' +
                     '<div class="class-meta">'   + escapeHtml(c.date) + ' • ' +
                                                    escapeHtml(c.start) + '–' +
                                                    escapeHtml(c.end) + '</div>';
 
    // Right column: instructor badge and remaining spots
    var right = document.createElement('div');
    right.className = 'class-right';
    right.innerHTML = '<div class="badge">'      + escapeHtml(c.instructor) + '</div>' +
                      '<div class="class-meta">' + c.spots + ' spots</div>';
 
    card.appendChild(left);
    card.appendChild(right);
 
    // Visually highlight classes that are in progress right now
    if (isNow(c)) {
      card.style.borderLeft  = '4px solid #0b8f6b';
      card.style.paddingLeft = '8px';
    }
 
    scheduleList.appendChild(card);
  }
}
 
/**
 * Updates the live clock display with the current time,
 * then re-applies filters so in-progress highlighting stays accurate.
 * Called on load and every 30 seconds via setInterval.
 */
function updateNow() {
  var d = new Date();
  nowText.innerText = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  applyFilters(); // Rerender so isNow highlighting reflects the current moment
}
 
/**
 * Returns true if the given class is currently in progress:
 * its date matches today and the current time falls within its start–end range.
 */
function isNow(c) {
  var today = new Date();
  var ymd = today.getFullYear() + '-' +
            ('0'+(today.getMonth()+1)).slice(-2) + '-' +
            ('0'+today.getDate()).slice(-2);
  if (c.date !== ymd) return false; // Wrong date
  var nowMin = today.getHours() * 60 + today.getMinutes();
  return nowMin >= timeToMinutes(c.start) && nowMin < timeToMinutes(c.end);
}
 
/**
 * Reads the current filter values and rebuilds the schedule with only the
 * classes that match every active filter.
 * Empty filter values are treated as "no constraint" for that field.
 */
function applyFilters() {
  var a    = activityFilter.value;
  var ins  = instructorFilter.value;
  var d    = dateFilter.value;
  var from = timeFrom.value;
  var to   = timeTo.value;
 
  var out = [];
  for (var i = 0; i < classes.length; i++) {
    var c = classes[i];
    if (a   && c.activity   !== a)   continue; // Activity mismatch
    if (ins && c.instructor !== ins)  continue; // Instructor mismatch
    if (d   && c.date       !== d)   continue; // Date mismatch
    // Exclude classes that end before the requested start time
    if (from && timeToMinutes(c.end)   < timeToMinutes(from)) continue;
    // Exclude classes that start after the requested end time
    if (to   && timeToMinutes(c.start) > timeToMinutes(to))   continue;
    out.push(c);
  }
  renderSchedule(out);
}
 
/**
 * Resets all filter inputs to their empty/default state and
 * re-renders the full unfiltered schedule.
 */
function clearFilters() {
  activityFilter.value   = '';
  instructorFilter.value = '';
  dateFilter.value       = '';
  timeFrom.value         = '';
  timeTo.value           = '';
  renderSchedule(classes);
}
 
// =============================================================================
// BOOKING FUNCTIONS
// =============================================================================
 
/**
 * Handles the booking form submission.
 * Validates inputs, records the booking in localStorage, decrements the
 * spot count on the selected class, refreshes the UI, then generates a
 * secure token and shows a confirmation message.
 */
function submitBooking(e) {
  e.preventDefault(); // Prevent default form submission / page reload
 
  var selectedId = classSelect.value;
  var name  = nameInput.value.trim();
  var email = emailInput.value.trim();
 
  // Basic input validation
  if (!selectedId)              { alert('Please select a class.');       return; }
  if (name.length < 2)          { alert('Please enter your name.');      return; }
  if (!validateEmail(email))    { alert('Please enter a valid email.');  return; }
 
  // Find the selected class in the array
  var idx = -1;
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].id === selectedId) { idx = i; break; }
  }
  if (idx === -1) { alert('Class not found.'); return; }
 
  var cls = classes[idx];
  if (cls.spots <= 0) { alert('This class is fully booked.'); return; }
 
  // Sanitise user input before storing or displaying
  var safeName  = escapeHtml(name);
  var safeEmail = escapeHtml(email);
 
  // Build a booking record with a timestamp-based unique id
  var booking = {
    id:      'b' + (new Date()).getTime(),
    classId: cls.id,
    name:    safeName,
    email:   safeEmail,
    created: new Date().toISOString()
  };
 
  // Append the new booking to the existing list in localStorage
  var key = 'simple_bookings';
  var existing = localStorage.getItem(key);
  var arr = [];
  if (existing) {
    try { arr = JSON.parse(existing); } catch (err) { arr = []; }
  }
  arr.push(booking);
  localStorage.setItem(key, JSON.stringify(arr));
 
  // Decrement the spot count (floor at 0) and persist the updated classes
  classes[idx].spots = Math.max(0, classes[idx].spots - 1);
  try { localStorage.setItem('classes_data', JSON.stringify(classes)); } catch (err) { /* Ignore storage errors */ }
 
  // Refresh the booking dropdown and visible schedule to reflect new spot count
  populateClassSelect();
  applyFilters();
 
  // Generate a booking token, then show the confirmation message
  generateAndStoreToken(booking.id, function(){
    confirmText.innerText = 'Thanks ' + safeName + '. Your booking is confirmed for ' +
                            cls.activity + ' at ' + cls.start + '.';
    confirmBox.style.display = 'block';
    bookingForm.reset();
  });
}
 
/**
 * Returns true if the string looks like a valid email address.
 * Uses a simple regex — not RFC 5322 compliant, but sufficient for basic UX validation.
 */
function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
 
/**
 * Generates a cryptographically random token for the booking and stores it
 * in localStorage, then invokes the callback.
 *
 * Security path (Web Crypto API available):
 *   1. Generate 24 random bytes → base64 token.
 *   2. If SubtleCrypto is available, derive an AES-256-GCM key via PBKDF2
 *      and encrypt the token, storing { cipher, iv, salt, hint }.
 *   3. If SubtleCrypto is unavailable, store the raw token unencrypted.
 *
 * Fallback (no Web Crypto): store a base64-encoded version of the booking id seed.
 *
 * Note: storing a key derived from a random password in the same localStorage
 * entry as the ciphertext provides no meaningful security — both are equally
 * accessible to any script on the page. This is suitable only as a lightweight
 * integrity hint, not as real encryption.
 *
 * @param {string}   seed - The booking id used as a hint / fallback value.
 * @param {Function} cb   - Callback invoked after the token is stored.
 */
function generateAndStoreToken(seed, cb) {
  try {
    if (window.crypto && window.crypto.getRandomValues) {
      // Generate 24 cryptographically random bytes and base64-encode them
      var arr = new Uint8Array(24);
      window.crypto.getRandomValues(arr);
      var token = btoa(String.fromCharCode.apply(null, arr));
 
      if (window.crypto.subtle) {
        // Derive an AES-256-GCM key from a random password using PBKDF2
        var salt = window.crypto.getRandomValues(new Uint8Array(12));
        var pw   = window.crypto.getRandomValues(new Uint8Array(16));
 
        window.crypto.subtle.importKey('raw', pw, {name:'PBKDF2'}, false, ['deriveKey'])
          .then(function(baseKey){
            return window.crypto.subtle.deriveKey(
              { name: 'PBKDF2', salt: salt, iterations: 1000, hash: 'SHA-256' },
              baseKey,
              { name: 'AES-GCM', length: 256 },
              true,
              ['encrypt','decrypt']
            );
          })
          .then(function(aesKey){
            var iv  = window.crypto.getRandomValues(new Uint8Array(12));
            var enc = new TextEncoder().encode(token);
            // Encrypt the token and store ciphertext alongside iv, salt, and a seed hint
            return window.crypto.subtle.encrypt({name:'AES-GCM', iv: iv}, aesKey, enc)
              .then(function(cipher){
                var payload = {
                  cipher: arrayBufferToBase64(cipher),
                  iv:     arrayBufferToBase64(iv),
                  salt:   arrayBufferToBase64(salt),
                  hint:   btoa(seed).slice(0,12) // First 12 chars of base64 seed for identification
                };
                localStorage.setItem('booking_token_secure', JSON.stringify(payload));
                if (typeof cb === 'function') cb();
              });
          })
          .catch(function(){
            // SubtleCrypto operation failed — fall back to storing raw token
            try { localStorage.setItem('booking_token', token); } catch(e){}
            if (typeof cb === 'function') cb();
          });
      } else {
        // SubtleCrypto not available — store the unencrypted token
        try { localStorage.setItem('booking_token', token); } catch(e){}
        if (typeof cb === 'function') cb();
      }
    } else {
      // Web Crypto API entirely unavailable — use base64 of the seed as a fallback
      try { localStorage.setItem('booking_token', btoa(seed)); } catch(e){}
      if (typeof cb === 'function') cb();
    }
  } catch (err) {
    // Unexpected error — store base64 seed and continue so the UI isn't blocked
    try { localStorage.setItem('booking_token', btoa(seed)); } catch(e){}
    if (typeof cb === 'function') cb();
  }
}
 
/**
 * Converts an ArrayBuffer (e.g. from SubtleCrypto) to a base64 string.
 * Used to serialise encrypted token data for localStorage storage.
 *
 * @param  {ArrayBuffer} buf
 * @returns {string} Base64-encoded representation of the buffer.
 */
function arrayBufferToBase64(buf) {
  var bytes  = new Uint8Array(buf);
  var binary = '';
  for (var i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
 
// =============================================================================
// JSON IMPORT / EXPORT
// =============================================================================
 
/**
 * Serialises the current classes array to JSON and triggers a file download
 * named 'classes-export.json'. A temporary <a> element is created,
 * clicked programmatically, and then immediately removed.
 */
function exportClassesToJson() {
  if (!Array.isArray(classes) || !classes.length) {
    alert('No classes to export');
    return;
  }
 
  var json = JSON.stringify(classes, null, 2); // Pretty-print with 2-space indent
  var blob = new Blob([json], { type: 'application/json' });
  var url  = URL.createObjectURL(blob);
 
  // Create a temporary link, trigger the download, then clean up
  var a = document.createElement('a');
  a.href     = url;
  a.download = 'classes-export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Free the object URL to avoid memory leaks
}
 
/**
 * Reads a JSON file selected via the file input, parses it, and replaces
 * the current classes array with the imported data.
 * Persists the imported data to localStorage and refreshes all UI components.
 *
 * @param {Event} e - The 'change' event from the file input element.
 */
function importClassesFromJson(e) {
  var file = e.target.files[0];
  if (!file) return;
 
  var reader = new FileReader();
 
  reader.onload = function(evt) {
    try {
      var parsed = JSON.parse(evt.target.result);
 
      if (!Array.isArray(parsed)) {
        alert('Invalid JSON: expected an array');
        return;
      }
 
      // Replace in-memory data and persist to localStorage
      classes = parsed;
      localStorage.setItem('classes_data', JSON.stringify(classes));
 
      // Rebuild all UI components with the imported data
      populateFilters();
      populateClassSelect();
      renderSchedule(classes);
 
      alert('Classes imported successfully ✅');
    } catch (err) {
      alert('Invalid JSON file');
    }
  };
 
  reader.readAsText(file);
  e.target.value = ''; // Reset the input so the same file can be re-imported if needed
}