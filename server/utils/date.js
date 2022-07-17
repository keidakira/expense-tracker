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

module.exports = {
  dateObjectFromString,
  formatDateToString,
  getNewDate,
};
