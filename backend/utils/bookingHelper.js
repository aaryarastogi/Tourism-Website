export const requiredFieldsMap = {
  flight: ['email', 'category', 'fromCity', 'destination', 'flight', 'departureDate'],
  cab: ['email', 'category' , 'fromCity', 'destination', 'departureDate'],
  train: ['email','category' , 'fromCity', 'destination', 'travelDate', 'trainNumber', 'seatingClass'],
  hotel: ['email','category','location','checkinDate','checkoutDate','rooms','price']
};

export function hasAllRequiredFields(type, fields) {
  const required = requiredFieldsMap[type];
  return required.every(field => fields[field]);
}

export function getMissingFields(type, fields) {
  const required = requiredFieldsMap[type];
  return required.filter(field => !fields[field]);
}

export function extractFields(prompt, email) {
  return {
    //for all booking types
    email,
    category: prompt.match(/category\s+([a-zA-Z]+)/i)?.[1]?.trim(), 
    fromCity: prompt.match(/from\s+([a-zA-Z]+)/i)?.[1]?.trim(),
    destination: prompt.match(/to\s+([a-zA-Z]+)/i)?.[1]?.trim(),
    departureDate: prompt.match(/on\s+([0-9]{1,2}(?:st|nd|rd|th)?\s+\w+\s+[0-9]{4})/i)?.[1]?.trim(),

    //flight fields
    flight: prompt.match(/flight\s+([a-zA-Z]+)/i)?.[1]?.trim(),
    
    // train fields
    travelDate: prompt.match(/on\s+([0-9]{1,2}(?:st|nd|rd|th)?\s+\w+\s+[0-9]{4})/i)?.[1]?.trim(),
    trainNumber:  prompt.match(/train\s+([a-zA-Z]+)/i)?.[1]?.trim(),
    seatingClass: prompt.match(/class\s+([a-zA-Z0-9\s]+)/i)?.[1]?.trim(),

    // hotel fields
    location: prompt.match(/in\s+([a-zA-Z]+)/i)?.[1]?.trim(),
    // checkinDate: prompt.match(/checkin\s+([0-9]{1,2}(?:st|nd|rd|th)?\s+\w+\s+[0-9]{4})/i)?.[1]?.trim(),
    // checkoutDate: prompt.match(/checkout\s+([0-9]{1,2}(?:st|nd|rd|th)?\s+\w+\s+[0-9]{4})/i)?.[1]?.trim(),
    checkinDate: prompt.match(/check\s*in\s*(?:date\s*)?:?\s*([^\n,]+)/i)?.[1]?.trim(),
    checkoutDate: prompt.match(/check\s*out\s*(?:date\s*)?:?\s*([^\n,]+)/i)?.[1]?.trim(),
    rooms: parseInt(prompt.match(/rooms?\s*(\d+)/i)?.[1] || prompt.match(/upto\s*(\d+)\s*rooms?/i)?.[1] || '1'),
    price: parseFloat(prompt.match(/price\s*(?:rs\.?|₹)?\s*([0-9]+)/i)?.[1] || '0'),
  };
}

export function detectBookingType(prompt) {
  if (!prompt || typeof prompt !== "string") {
    return null; 
  }
  const p = prompt.toLowerCase();
  if (p.includes('flight')) return 'flight';
  if (p.includes('train')) return 'train';
  if (p.includes('cab')) return 'cab';
  if (p.includes('hotel')) return 'hotel';
  return null;
}