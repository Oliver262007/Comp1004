
var classes = [
  { id: 'c1',  activity: 'Yoga',         instructor: 'Amy',     date: todayPlus(0), start: '09:00', end: '10:00', spots: 12 },
  { id: 'c2',  activity: 'Yoga',         instructor: 'Amy',     date: todayPlus(2), start: '19:15', end: '20:45', spots: 12 },
  { id: 'c3',  activity: 'Yoga',         instructor: 'Hannah',  date: todayPlus(3), start: '05:45', end: '6:45', spots: 6  },
  { id: 'c4',  activity: 'Running Club', instructor: 'Harvey',  date: todayPlus(0), start: '08:30', end: '10:30', spots: 8  },
  { id: 'c5',  activity: 'Running Club', instructor: 'Harvey',  date: todayPlus(0), start: '06:30', end: '07:15', spots: 25 },
  { id: 'c6',  activity: 'Running club', instructor: 'Fred',    date: todayPlus(1), start: '07:15', end: '09:15', spots: 14 },
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
  { id: 'c20', activity: 'Badminton',    instructor: 'James',    date: todayPlus(2), start: '17:00', end: '18:00', spots: 15 },
  { id: 'c21', activity: 'Badminton',    instructor: 'Harvey',  date: todayPlus(3), start: '08:00', end: '10:30', spots: 26 },
];

try {
  var saved = localStorage.getItem('classes_data');
  if (saved) {
    var parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length) classes = parsed;
  }
} catch (e) {  }

function todayPlus(n) {
  var d = new Date();
  d.setDate(d.getDate() + n);
  var y = d.getFullYear();
  var m = ('0' + (d.getMonth()+1)).slice(-2);
  var day = ('0' + d.getDate()).slice(-2);
  return y + '-' + m + '-' + day;
}

function timeToMinutes(t) {
  var parts = t.split(':');
  return parseInt(parts[0],10) * 60 + parseInt(parts[1],10);
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

var activityFilter = document.getElementById('activityFilter');
var instructorFilter = document.getElementById('instructorFilter');
var dateFilter = document.getElementById('dateFilter');
var timeFrom = document.getElementById('timeFrom');
var timeTo = document.getElementById('timeTo');
var applyBtn = document.getElementById('applyBtn');
var clearBtn = document.getElementById('clearBtn');
var scheduleList = document.getElementById('scheduleList');
var noResults = document.getElementById('noResults');
var nowText = document.getElementById('nowText');

var classSelect = document.getElementById('classSelect');
var bookingForm = document.getElementById('bookingForm');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var confirmBox = document.getElementById('confirm');
var confirmText = document.getElementById('confirmText');
var closeConfirm = document.getElementById('closeConfirm');
var resetBtn = document.getElementById('resetBtn');

window.onload = function() {
  populateFilters();
  populateClassSelect();
  renderSchedule(classes);
  updateNow();
  setInterval(updateNow, 30000);

  applyBtn.onclick = applyFilters;
  clearBtn.onclick = clearFilters;
  bookingForm.onsubmit = submitBooking;
  closeConfirm.onclick = function(){ confirmBox.style.display = 'none'; };
  resetBtn.onclick = function(){ bookingForm.reset(); };

  scheduleList.onclick = function(e){
    var el = e.target;
    while (el && !el.classList.contains('class-card')) el = el.parentNode;
    if (el) {
      var id = el.getAttribute('data-id');
      classSelect.value = id;
      document.getElementById('bookingPanel').scrollIntoView({behavior:'smooth'});
    }
  };
};

function populateFilters() {
  var acts = {};
  var ins = {};
  for (var i=0;i<classes.length;i++) {
    acts[classes[i].activity] = true;
    ins[classes[i].instructor] = true;
  }
  activityFilter.options.length = 1; 
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

function populateClassSelect() {
  classSelect.options.length = 0;
  for (var i=0;i<classes.length;i++) {
    var c = classes[i];
    var opt = document.createElement('option');
    opt.value = c.id;
    opt.text = c.activity + ' - ' + c.date + ' ' + c.start + ' (' + c.instructor + ') - ' + c.spots + ' spots';
    if (c.spots <= 0) opt.disabled = true;
    classSelect.add(opt);
  }
}

function renderSchedule(list) {
  scheduleList.innerHTML = '';
  if (!list || list.length === 0) {
    noResults.style.display = 'block';
    return;
  } else {
    noResults.style.display = 'none';
  }
  for (var i=0;i<list.length;i++) {
    var c = list[i];
    var card = document.createElement('div');
    card.className = 'class-card';
    if (c.spots <= 0) card.className += ' full';
    card.setAttribute('data-id', c.id);

    var left = document.createElement('div');
    left.className = 'class-left';
    left.innerHTML = '<div class="class-title">' + escapeHtml(c.activity) + '</div>' +
                     '<div class="class-meta">' + escapeHtml(c.date) + ' • ' + escapeHtml(c.start) + '–' + escapeHtml(c.end) + '</div>';

    var right = document.createElement('div');
    right.className = 'class-right';
    right.innerHTML = '<div class="badge">' + escapeHtml(c.instructor) + '</div>' +
                      '<div class="class-meta">' + c.spots + ' spots</div>';

    card.appendChild(left);
    card.appendChild(right);

    if (isNow(c)) {
      card.style.borderLeft = '4px solid #0b8f6b';
      card.style.paddingLeft = '8px';
    }

    scheduleList.appendChild(card);
  }
}

function updateNow() {
  var d = new Date();
  nowText.innerText = d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  applyFilters(); 
}

function isNow(c) {
  var today = new Date();
  var ymd = today.getFullYear() + '-' + ('0'+(today.getMonth()+1)).slice(-2) + '-' + ('0'+today.getDate()).slice(-2);
  if (c.date !== ymd) return false;
  var nowMin = today.getHours()*60 + today.getMinutes();
  return nowMin >= timeToMinutes(c.start) && nowMin < timeToMinutes(c.end);
}

function applyFilters() {
  var a = activityFilter.value;
  var ins = instructorFilter.value;
  var d = dateFilter.value;
  var from = timeFrom.value;
  var to = timeTo.value;

  var out = [];
  for (var i=0;i<classes.length;i++) {
    var c = classes[i];
    if (a && c.activity !== a) continue;
    if (ins && c.instructor !== ins) continue;
    if (d && c.date !== d) continue;
    if (from && timeToMinutes(c.end) < timeToMinutes(from)) continue;
    if (to && timeToMinutes(c.start) > timeToMinutes(to)) continue;
    out.push(c);
  }
  renderSchedule(out);
}

function clearFilters() {
  activityFilter.value = '';
  instructorFilter.value = '';
  dateFilter.value = '';
  timeFrom.value = '';
  timeTo.value = '';
  renderSchedule(classes);
}

function submitBooking(e) {
  e.preventDefault();
  var selectedId = classSelect.value;
  var name = nameInput.value.trim();
  var email = emailInput.value.trim();

  if (!selectedId) { alert('Please select a class.'); return; }
  if (name.length < 2) { alert('Please enter your name.'); return; }
  if (!validateEmail(email)) { alert('Please enter a valid email.'); return; }

  var idx = -1;
  for (var i=0;i<classes.length;i++) {
    if (classes[i].id === selectedId) { idx = i; break; }
  }
  if (idx === -1) { alert('Class not found.'); return; }

  var cls = classes[idx];
  if (cls.spots <= 0) { alert('This class is fully booked.'); return; }

  var safeName = escapeHtml(name);
  var safeEmail = escapeHtml(email);

  var booking = {
    id: 'b' + (new Date()).getTime(),
    classId: cls.id,
    name: safeName,
    email: safeEmail,
    created: new Date().toISOString()
  };

  var key = 'simple_bookings';
  var existing = localStorage.getItem(key);
  var arr = [];
  if (existing) {
    try { arr = JSON.parse(existing); } catch (err) { arr = []; }
  }
  arr.push(booking);
  localStorage.setItem(key, JSON.stringify(arr));

  classes[idx].spots = Math.max(0, classes[idx].spots - 1);
  try { localStorage.setItem('classes_data', JSON.stringify(classes)); } catch (err) { /* ignore */ }

  populateClassSelect();
  applyFilters();

  generateAndStoreToken(booking.id, function(){
    confirmText.innerText = 'Thanks ' + safeName + '. Your booking is confirmed for ' + cls.activity + ' at ' + cls.start + '.';
    confirmBox.style.display = 'block';
    bookingForm.reset();
  });
}

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function generateAndStoreToken(seed, cb) {
  try {
    if (window.crypto && window.crypto.getRandomValues) {
      var arr = new Uint8Array(24);
      window.crypto.getRandomValues(arr);
      var token = btoa(String.fromCharCode.apply(null, arr));
      if (window.crypto.subtle) {
        var salt = window.crypto.getRandomValues(new Uint8Array(12));
        var pw = window.crypto.getRandomValues(new Uint8Array(16));
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
          var iv = window.crypto.getRandomValues(new Uint8Array(12));
          var enc = new TextEncoder().encode(token);
          return window.crypto.subtle.encrypt({name:'AES-GCM', iv: iv}, aesKey, enc)
            .then(function(cipher){
              var payload = {
                cipher: arrayBufferToBase64(cipher),
                iv: arrayBufferToBase64(iv),
                salt: arrayBufferToBase64(salt),
                hint: btoa(seed).slice(0,12)
              };
              localStorage.setItem('booking_token_secure', JSON.stringify(payload));
              if (typeof cb === 'function') cb();
            });
        })
        .catch(function(){
          try { localStorage.setItem('booking_token', token); } catch(e){}
          if (typeof cb === 'function') cb();
        });
      } else {
        try { localStorage.setItem('booking_token', token); } catch(e){}
        if (typeof cb === 'function') cb();
      }
    } else {
      try { localStorage.setItem('booking_token', btoa(seed)); } catch(e){}
      if (typeof cb === 'function') cb();
    }
  } catch (err) {
    try { localStorage.setItem('booking_token', btoa(seed)); } catch(e){}
    if (typeof cb === 'function') cb();
  }
}

function arrayBufferToBase64(buf) {
  var bytes = new Uint8Array(buf);
  var binary = '';
  for (var i=0;i<bytes.byteLength;i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}