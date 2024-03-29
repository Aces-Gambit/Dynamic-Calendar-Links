import {
  ICalendar,
  GoogleCalendar,
  OutlookCalendar,
} from "https://cdn.jsdelivr.net/npm/datebook@8.0.0/+esm";

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

function generateICal(startDate, endDate) {
  const startDateString = formatDate(startDate);
  const endDateString = formatDate(endDate);
  const selectedTime = timeInput.value;
  const urlFormatTime = formatTime(selectedTime);

  const options = {
    title: "Lifetones Reminder",
    description: "Remember to take Lifetones every day for lasting relief!",
    location: "Anywhere",
    start: startDate,
    end: endDate,
    recurrence: {
      freq: "DAILY",
      interval: 1,
      count: 60,
    },
  };

  const calendar = new ICalendar(options);
  return calendar.render();
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
    `&dates=${startDateString}T${urlFormatTime}` +
    `&recur=RRULE:FREQ=DAILY;COUNT=30` +
    `&text=Lifetones%20Reminder` +
    `&details=Remember%20to%20take%20Lifetones%20every%20day%20for%20lasting%20relief!`;

  return url;
}

function generateOutlook(startDate, endDate) {
  const selectedTime = timeInput.value;
  const urlFormatTime = formatTime(selectedTime);
  startDate.setDate(startDate.getDate() + 1);
  startDate.setHours(urlFormatTime.slice(0, 2));

  const options = {
    title: "Lifetones Reminder",
    description: "Remember to take Lifetones every day for lasting relief!",
    start: startDate,
    end: startDate,
    recurrence: {
      freq: "DAILY",
      interval: 1,
      count: 30,
    },
  };

  const calendar = new OutlookCalendar(options);
  return calendar.render();
}

function generateCalendars(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30); // set end date to 30 days after start date

  return {
    icalUrl: generateICal(startDate, endDate),
    googleUrl: generateGoogleUrl(startDate, endDate),
    outlookUrl: generateOutlook(startDate, endDate),
  };
}

function handleICalButtonClick(event) {
  event.preventDefault();
  // add Google Analytics tracking code here
  // ga("send", "event", "Button", "click", "iCal");

  const startDate = new Date(dateRangeInput.value);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);
  const { icalUrl } = generateCalendars(startDate);

  window.open(icalUrl, "_blank");
}

function handleGoogleButtonClick(event) {
  event.preventDefault();
  // add Google Analytics tracking code here
  // ga("send", "event", "Button", "click", "Google Calendar");

  const startDate = new Date(dateRangeInput.value);
  const { googleUrl } = generateCalendars(startDate);
  window.open(googleUrl, "_blank");
}

function handleOutlookButtonClick(event) {
  event.preventDefault();
  // add Google Analytics tracking code here
  // ga("send", "event", "Button", "click", "Outlook");
  const startDate = new Date(dateRangeInput.value);
  const { outlookUrl } = generateCalendars(startDate);
  window.open(outlookUrl, "_blank");
}

icalButton.addEventListener("click", handleICalButtonClick);
googleButton.addEventListener("click", handleGoogleButtonClick);
outlookButton.addEventListener("click", handleOutlookButtonClick);
