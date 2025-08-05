/**
 * Utility functions for formatting data in the screensaver app
 */

/**
 * Format temperature value with degree symbol
 */
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  return `${Math.round(temp)}°${unit}`;
};

/**
 * Format time with leading zeros
 */
export const formatTimeComponent = (value: number): string => {
  return value.toString().padStart(2, '0');
};

/**
 * Format date according to specified format
 */
export const formatDate = (date: Date, format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'): string => {
  const day = formatTimeComponent(date.getDate());
  const month = formatTimeComponent(date.getMonth() + 1);
  const year = date.getFullYear();
  
  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Get day name
 */
export const getDayName = (date: Date, short: boolean = false): string => {
  const days = short 
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

/**
 * Get month name
 */
export const getMonthName = (date: Date, short: boolean = false): string => {
  const months = short
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December'];
  return months[date.getMonth()];
};

/**
 * Format time with AM/PM or 24h format
 */
export const formatTime = (
  date: Date, 
  format: '12h' | '24h', 
  showSeconds: boolean = true
): string => {
  const hours = format === '12h' 
    ? date.getHours() % 12 || 12 
    : date.getHours();
  
  const minutes = formatTimeComponent(date.getMinutes());
  const seconds = formatTimeComponent(date.getSeconds());
  
  let timeString = `${formatTimeComponent(hours)}:${minutes}`;
  
  if (showSeconds) {
    timeString += `:${seconds}`;
  }
  
  if (format === '12h') {
    timeString += ` ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
  }
  
  return timeString;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};
