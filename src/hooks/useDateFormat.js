import {useCallback} from 'react';

export const useDateFormat = () => {
  const formatDate = useCallback((date, options = {}) => {
    const defaultOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    return new Date(date).toLocaleDateString('fr-FR', defaultOptions);
  }, []);

  const formatDateRange = useCallback(
    (startDate, endDate, options = {}) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${formatDate(start, options)} - ${formatDate(end, options)}`;
    },
    [formatDate],
  );

  const isSameDay = useCallback((date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }, []);

  return {formatDate, formatDateRange, isSameDay};
};
