export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parseJsonString(jsonString) {
  try {
    return JSON.parse(jsonString, (key, value) => {
      if (typeof key === 'string') {
        return value;
      }
      return String(value);
    });
  } catch (error) {
    console.error('Error parsing JSON string:', error);
    return null;
  }
}