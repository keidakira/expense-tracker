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
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const getStartAndEndDatesOfYearAndMonth = (year, month) => {
  let startDate = new Date(year, month - 1, 1);
  let endDate = new Date(year, month, 0);

  return {
    startDate,
    endDate,
  };
};

module.exports = {
  dateObjectFromString,
  formatDateToString,
  getNewDate,
  getStartAndEndDatesOfYearAndMonth,
};
