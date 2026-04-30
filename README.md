# Comp1004
HTML Code.

Sports Centre Schedule Booking System

Project overview.
client‑side web application for browsing a live class schedule and making simple bookings. It uses plain HTML, CSS, and JavaScript, stores data in the browser via localStorage, and supports filtering, booking with basic validation, and JSON import/export.

Key features:
Live schedule rendering with a current-time indicator and visual highlight for classes happening now.

Filtering by activity, instructor, date, and time range.

Booking flow that validates name and email, decrements available spots, stores bookings under simple_bookings in localStorage, and persists updated classes under classes_data.

Token generation using the Web Crypto API with fallbacks; stores an encrypted token when available.

Import / Export of the classes array as JSON for editing or backup.

The app is implemented with HTML for structure, CSS for styling, and plain JavaScript for all application logic. The test.js file defines the schedule data as a classes array and implements filtering, booking, import/export, and token generation.

/project-root
├─ index.html
├─ test.js
├─ 1004 Code.css
├─ README.md
├─ /assets
│  ├─ logo.svg
│  └─ icons/
├─ /data
│  └─ classes-export.json
├─ /docs
│  └─ design-notes.md
└─ /examples
   └─ sample-import.json

index.html - main page layout
style.css - custom styling
test.js - application logic

How to run the project:
Run locally by opening the page
Put the project folder on your machine.

Open index.html in your browser (double‑click or use File → Open).

The app runs immediately — no build step required

Add an Order / Booking tracking feature so users can view the status and details of their bookings (created via the booking form). The tracker will surface a unique booking reference, current status, timestamps, and an optional secure token link so users can check or cancel a booking from the client UI.

Functional requirements:
A booking tracking feature that lets users locate, view, and manage their bookings using a booking reference or email. It must display booking details, status, timestamps, and allow safe cancellation and receipt download while preserving the current client‑side architecture (localStorage).

Limitations:
Local only: Data is stored in localStorage, so bookings and class updates exist only in the user’s browser and device.

Future improvements:
Add a stable booking reference, tracking UI, and cancellation flow (client and server), Users can find and manage bookings reliably, essential for real use.
Send booking confirmations and receipts via email; allow users to download printable receipts, Professional touch and recovery if localStorage is cleared.  Requires backend email service (SMTP or transactional email provider). Keep a printable HTML template for receipts.

Academic context:
Software development lifecycle (SDLC)
Agile/sprint- based development
Frontend javascript programming

GitHub repository:
https://github.com/Oliver262007/Comp1004

Author:
Created by Oliver Heale
COMP1004 Computing Pratice Project.
