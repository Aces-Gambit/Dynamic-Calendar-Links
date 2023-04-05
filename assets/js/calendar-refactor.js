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

const now = new Date();
console.log("Raw Date Data:", now);

// Get the time zone offset in minutes
const timeZoneOffset = now.getTimezoneOffset();
console.log("Time Zone Offset (minutes):", timeZoneOffset);

// Get the time zone name
const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log("Time Zone Name:", timeZoneName);

// Set default values for date input fields
setDefaultDateValues();

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatTime(time) {
  return time.replace(/[-:]/g, "");
}

function setDefaultDateValues() {
  const startDate = new Date();

  const startDateString = formatDate(startDate);

  dateRangeInput.setAttribute("value", startDateString);
  dateRangeInput.setAttribute("min", startDateString);
}

function buildCalendarOptions(startDate, endDate) {
  return {
    title: "Lifetones Reminder",
    description: "Remember to take Lifetones every day for lasting relief!",
    location: "Anywhere",
    start: startDate,
    end: endDate,
    recurrence: {
      frequency: "DAILY",
      interval: 1,
      count: 60,
    },
  };
}

function updateDateTime(dateString) {
  const startDate = new Date(dateString);
  const selectedTime = timeInput.value;
  const [hours, minutes] = selectedTime.split(":");

  const timezoneOffset = startDate.getTimezoneOffset() * 60000;
  startDate.setTime(startDate.getTime() + timezoneOffset);

  startDate.setHours(hours, minutes);
  return startDate;
}

function calculateEndDate(startDate) {
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 10);
  return endDate;
}

function isMobileOrTablet() {
  return /Mobi|Tablet|iPad|iPhone|Android/i.test(window.navigator.userAgent);
}

function handleCalendarButtonClick(event, calendarType) {
  event.preventDefault();

  const startDate = updateDateTime(new Date(dateRangeInput.value));
  const endDate = calculateEndDate(startDate);
  const options = buildCalendarOptions(startDate, endDate);

  let calendar;
  let url;

  switch (calendarType) {
    case "iCal":
      calendar = new ICalendar(options);
      const blob = new Blob([calendar.render()], {
        type: "text/calendar;charset=utf-8",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Lifetones-Reminder.ics";
      link.click();
      return;
    case "Google":
      calendar = new GoogleCalendar(options);
      break;
    case "Outlook":
      calendar = new OutlookCalendar(options);
      break;
    default:
      return;
  }

  url = calendar.render();
  window.open(url, "_blank");
}

icalButton.addEventListener("click", (event) =>
  handleCalendarButtonClick(event, "iCal")
);
googleButton.addEventListener("click", (event) =>
  handleCalendarButtonClick(event, "Google")
);
outlookButton.addEventListener("click", (event) =>
  handleCalendarButtonClick(event, "Outlook")
);
