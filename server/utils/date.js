const dateObjectFromString = (dateString) => {
  dateString = dateString.replace(/-/g, "/").replace(/T.+/, "");
  return new Date(dateString);
};

const formatDateToString = (dateString) => {
  let date = dateObjectFromString(dateString);

  if (date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      day: "numeric",
    });
  }

  return "";
};

const getNewDate = () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}T00:00:00.000Z`;
};

const dateStringFromObject = (dateObject) => {
  let date = dateObject;
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}T00:00:00.000Z`;
};

const getTomorrowDate = () => {
  let date = new Date();
  date.setDate(date.getDate() + 1);

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}T00:00:00.000Z`;
};

const getStartAndEndDatesOfYearAndMonth = (year, month) => {
  let startDate = new Date(year, month - 1, 1);
  let endDate = new Date(year, month, 0);

  return {
    startDate: dateStringFromObject(startDate),
    endDate: dateStringFromObject(endDate),
  };
};

const isDate1BeforeDate2 = (date1, date2) => {
  let date1Object = dateObjectFromString(date1);
  let date2Object = dateObjectFromString(date2);

  return date1Object < date2Object;
};

module.exports = {
  dateObjectFromString,
  formatDateToString,
  getNewDate,
  getTomorrowDate,
  dateStringFromObject,
  getStartAndEndDatesOfYearAndMonth,
  isDate1BeforeDate2,
};
