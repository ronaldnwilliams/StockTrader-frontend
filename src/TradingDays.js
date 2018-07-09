const tradingDays = [];
const daysOut = 365;
const startDay = 1527552000000; //05/029/2018
const oneDay = 86400000;
const holidays = [
  new Date(2018, 8, 3).toDateString(), //labor day
  new Date(2018, 10, 22).toDateString(), // thanksgiving
  new Date(2018, 11, 25).toDateString(), // christmans
  new Date(2019, 0, 1).toDateString(), // new years
  new Date(2019, 0, 21).toDateString(), // mlk
  new Date(2019, 1, 18).toDateString(), // washington bday
  new Date(2019, 3, 19).toDateString(), // good friday
  new Date(2019, 6, 4).toDateString(), // independence day
];

for (let i = 1; i < daysOut; i++) {
  let nextDay = new Date(startDay + oneDay * i);
  if (nextDay.getDay() !== 6 && nextDay.getDay() !== 0 && !holidays.includes(nextDay.toDateString())) {
    tradingDays.push(nextDay.toDateString());
  }
}

export default tradingDays;
