import Copy from "../locales/en_us";

export const formatInt = (num, full) => {
  if (!num) {
    return 0;
  }

  if (!full) {
    if (num >= 1000000) {
      return Math.floor(num / 100000) + "." + Math.floor((num / 10000) % 10) + "M";
    } else if (num >= 10000) {
      return Math.floor(num / 1000) + "." + Math.floor((num / 100) % 10) + "K";
    }
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatMoney = cents => {
  var dollars = cents / 100;
  return dollars.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

export const getPercentage = (left, right) => {
  return (left / right) * 100;
};

export const getHoursFromSeconds = seconds => {
  seconds = Number(seconds);
  return Math.floor(seconds / 3600);
};

export const getMinutesFromSeconds = seconds => {
  seconds = Number(seconds);
  return Math.floor((seconds % 3600) / 60);
};

export const isTouchScreen = () => {
  return "ontouchstart" in window || navigator.msMaxTouchPoints;
};

export const airTimeString = live => {
  return live ? Copy.started : Copy.aired;
};

export const debounce = (func, wait, immediate) => {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};
