// Declarations
const startYear = 2020;
const endYear = new Date().getFullYear();

// Exports
export const months = [
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

export const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => startYear + i
);

export const HOST = "http://localhost:8081"; //"https://glacial-ocean-96095.herokuapp.com";
