import moment from "moment";

export const formatDateTime = (dateTime) => {
  const now = moment();
  const formattedDateTime = moment(dateTime);

  if (now.isSame(formattedDateTime, "day")) {
    // Display time if it's the same day
    return formattedDateTime.format("hh:mm A");
  } else if (now.isSame(formattedDateTime, "year")) {
    // Display month and day if it's the same year
    return formattedDateTime.format("MMM DD");
  } else {
    // Display month, day, and year
    return formattedDateTime.format("MMM DD YYYY");
  }
};
