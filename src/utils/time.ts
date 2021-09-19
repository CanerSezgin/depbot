// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/prefer-default-export */

export const getDayTime = (date: string | Date, unit: 'hr' | 'min' | 'sec') => {
  const hrs = new Date(date).getUTCHours();
  const mins = new Date(date).getUTCMinutes();
  const secs = new Date(date).getUTCSeconds();

  const hrsByMin = 60 * hrs;
  const minsByMin = 1 * mins;
  const byMin = hrsByMin + minsByMin;

  const minBySecs = 60 * byMin;
  const bySec = minBySecs + secs;

  switch (unit) {
    case 'hr':
      return hrs;
    case 'min':
      return byMin;
    case 'sec':
      return bySec;

    default:
      return hrs;
  }
};
