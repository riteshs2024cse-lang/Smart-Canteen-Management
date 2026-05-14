const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const getDateValue = (trend) => trend?.date ?? trend?._id;

const parseDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const buildChronologicalTrends = (trends = [], { limit = null } = {}) => {
  const normalized = (Array.isArray(trends) ? trends : [])
    .map((trend) => {
      const parsedDate = parseDate(getDateValue(trend));
      if (!parsedDate) return null;

      return {
        rawDate: parsedDate,
        date: parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        prepared: toNumber(trend?.totalPrepared),
        consumed: toNumber(trend?.totalConsumed),
        wasted: toNumber(trend?.totalWasted)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.rawDate - b.rawDate);

  const sliced = limit ? normalized.slice(-limit) : normalized;

  return sliced.map(({ rawDate, ...rest }) => rest);
};

export const normalizeFoodBreakdown = (items = []) => {
  return (Array.isArray(items) ? items : []).map((item) => ({
    name: item?.foodItem || 'Unknown',
    prepared: toNumber(item?.totalPrepared),
    consumed: toNumber(item?.totalConsumed),
    wasted: toNumber(item?.totalWasted),
    wastePercentage: toNumber(item?.wastePercentage)
  }));
};

export const getWastePercent = (prepared, wasted) => {
  const totalPrepared = toNumber(prepared);
  const totalWasted = toNumber(wasted);

  if (totalPrepared <= 0) return 0;
  return (totalWasted / totalPrepared) * 100;
};

export const toSafeNumber = toNumber;
