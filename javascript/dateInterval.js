export const intervals = {
  interval1: {
    btnId: "btn-1y",
    name: "1 anio",
    interval: "1w",
    limit: 52,
  },
  interval2: {
    btnId: "btn-7d",
    name: "7 dias",
    interval: "1d",
    limit: 7,
  },
  interval3: {
    btnId: "btn-30d",
    name: "1 mes",
    interval: "1d",
    limit: 30,
  },
  interval4: {
    btnId: "btn-2y",
    name: "2 anios",
    interval: "1w",
    limit: 104,
  },
};


export const intervalsArr = Object.values(intervals).map((interval) => ({
    btnId: interval.btnId,
    interval: interval.interval,
    limit: interval.limit,
  }));
