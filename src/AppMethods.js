function currencyFormat(value) {
  return '$'+Number(Math.round(value+'e2')+'e-2').toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function percentFormat(value) {
  value = value * 100
  if (value > 0) {
    return '+'+Number(Math.round(value+'e2')+'e-2').toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '%';
  }
  return Number(Math.round(value+'e2')+'e-2').toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '%';
}

function checkNull(value) {
  // if value null return empty string else return value
  if (value === null) {
    return '';
  } else {
    return value;
  }
}

export { currencyFormat };
export { percentFormat };
export { checkNull };
