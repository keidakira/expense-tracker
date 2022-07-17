export const dateObjectFromString = (dateString) => {
  dateString = dateString.replace(/-/g, "/").replace(/T.+/, "");
  return new Date(dateString);
};

export const formatDateToString = (dateString) => {
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

export const getNewDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
};
