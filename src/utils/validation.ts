// Email validasyonu
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Telefon numarası validasyonu (Türkiye)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Şifre validasyonu
export const isValidPassword = (password: string): boolean => {
  // En az 8 karakter, en az 1 büyük harf, 1 küçük harf, 1 rakam
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// TC Kimlik No validasyonu
export const isValidTCKN = (tckn: string): boolean => {
  if (!/^\d{11}$/.test(tckn)) return false;
  
  const digits = tckn.split('').map(Number);
  const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
  
  const check1 = (sum1 * 7 - sum2) % 10;
  const check2 = (sum1 + sum2 + digits[9]) % 10;
  
  return check1 === digits[9] && check2 === digits[10];
};

// Posta kodu validasyonu
export const isValidPostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(postalCode);
};

// Form validasyon hataları
export interface ValidationErrors {
  [key: string]: string;
}

// Genel form validasyon fonksiyonu
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => string | null>
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  Object.keys(rules).forEach((field) => {
    const error = rules[field](data[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};