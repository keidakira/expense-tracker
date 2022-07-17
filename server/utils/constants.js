// Declarations
const startYear = 2020;
const endYear = new Date().getFullYear();

// Exports
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => startYear + i
);

module.exports = {
  months,
  years,
};
