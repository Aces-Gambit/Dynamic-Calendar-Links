const icalButton = document.getElementById("ical-button");
const googleButton = document.getElementById("google-button");
const outlookButton = document.getElementById("outlook-button");
const dateRangeInput = document.getElementById("date-range");
const timeInput = document.getElementById("time-dropdown");

// set the default value to 2 months starting on the next day
const startDate = new Date();
startDate.setDate(startDate.getDate()); // set start date to tomorrow
const endDate = new Date(startDate);
endDate.setDate(endDate.getDate() + 60); // set end date to 60 days after start date
const startDateString = formatDate(startDate);
const endDateString = formatDate(endDate);
dateRangeInput.setAttribute("value", startDateString);
dateRangeInput.setAttribute("min", startDateString);
dateRangeInput.setAttribute("max", endDateString);

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatDateGoogle(date) {
  return date.toISOString().slice(0, 10).replace(/[-:]/g, "");
}

function formatTime(time) {
  return time.replace(/[-:]/g, "");
}

function generateICalUrl(startDate, endDate) {
  const startDateString = formatDate(startDate);
  const endDateString = formatDate(endDate);

  const url =
    `data:text/calendar;charset=utf-8,` +
    `BEGIN:VCALENDAR\n` +
    `VERSION:2.0\n` +
    `BEGIN:VEVENT\n` +
    `DTSTART;VALUE=DATE:${startDateString}\n` +
    `DTEND;VALUE=DATE:${endDateString}\n` +
    `recur=RRULE:FREQ=DAILY;UNTIL=${endDateString}\n` +
    `END:VEVENT\n` +
    `END:VCALENDAR\n`;

  return encodeURI(url);
}

function generateGoogleUrl(startDate, endDate) {
  const startDateString = formatDateGoogle(startDate);
  const endDateString = formatDateGoogle(endDate);
  const selectedTime = timeInput.value;
  const urlFormatTime = formatTime(selectedTime);
  console.log(
    `${startDateString}T${urlFormatTime} / ${endDateString}T${urlFormatTime}`
  );

  const url =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&dates=${startDateString}T${urlFormatTime}/${endDateString}T${urlFormatTime}` +
    `&recur=RRULE:FREQ=DAILY` +
    `&text=Lifetones%20Reminder` +
    `&details=Remember%20to%20take%20Lifetones%20every%20day%20for%20lasting%20relief!`;

  return url;
}

function generateOutlookUrl(startDate, endDate) {
  const startDateString = formatDate(startDate);
  const endDateString = formatDate(endDate);

  const url =
    `data:text/calendar;charset=utf-8,` +
    `BEGIN:VCALENDAR\n` +
    `VERSION:2.0\n` +
    `BEGIN:VEVENT\n` +
    `DTSTART:${startDateString}\n` +
    `DTEND:${endDateString}\n` +
    `RRULE:FREQ=DAILY;UNTIL=${endDateString}\n` +
    `SUMMARY:Recurring Event\n` +
    `END:VEVENT\n` +
    `END:VCALENDAR\n`;

  return encodeURI(url);
}

function generateCalendarUrls(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 60); // set end date to 60 days after start date

  return {
    icalUrl: generateICalUrl(startDate, endDate),
    googleUrl: generateGoogleUrl(startDate, endDate),
    outlookUrl: generateOutlookUrl(startDate, endDate),
  };
}

function handleICalButtonClick(event) {
  event.preventDefault();
  // add Google Analytics tracking code here
  // ga("send", "event", "Button", "click", "iCal");

  const startDate = new Date(dateRangeInput.value);
  const { icalUrl } = generateCalendarUrls(startDate);
  window.open(icalUrl, "_blank");
}

function handleGoogleButtonClick(event) {
  event.preventDefault();
  // add Google Analytics tracking code here
  // ga("send", "event", "Button", "click", "Google Calendar");

  const startDate = new Date(dateRangeInput.value);
  const { googleUrl } = generateCalendarUrls(startDate);
  window.open(googleUrl, "_blank");
}

function handleOutlookButtonClick(event) {
  event.preventDefault();
  // add Google Analytics tracking code here
  // ga("send", "event", "Button", "click", "Outlook");
  const startDate = new Date(dateRangeInput.value);
  const { outlookUrl } = generateCalendarUrls(startDate);
  window.open(outlookUrl, "_blank");
}

icalButton.addEventListener("click", handleICalButtonClick);
googleButton.addEventListener("click", handleGoogleButtonClick);
outlookButton.addEventListener("click", handleOutlookButtonClick);
