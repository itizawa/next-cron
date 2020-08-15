function getYesterday() {
  const now = new Date();
  var yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  );
  return yesterday;
}

module.exports = getYesterday;
