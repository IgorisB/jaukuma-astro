// Data formatting functions

// Text formatting
export function formatText(text: string, maxLength?: number): string {
  if (maxLength && text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}

export function formatTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

export function formatSnakeCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// Number formatting
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatFileSize(bytes: number): string {
  return formatBytes(bytes);
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

// Phone number formatting
export function formatPhoneNumber(phone: string, country: string = 'US'): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // US format: (XXX) XXX-XXXX
  if (country === 'US' && digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // International format: +X XXX XXX XXXX
  if (digits.length >= 10) {
    return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  }
  
  return phone;
}

// Credit card formatting
export function formatCreditCard(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cardNumber;
}

// Social security number formatting
export function formatSSN(ssn: string): string {
  const digits = ssn.replace(/\D/g, '');
  if (digits.length === 9) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }
  return ssn;
}

// Address formatting
export function formatAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): string {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country
  ].filter(Boolean);
  
  return parts.join(', ');
}

// List formatting
export function formatList(items: string[], conjunction: 'and' | 'or' = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items.pop();
  return `${items.join(', ')}, ${conjunction} ${lastItem}`;
}

// Price formatting
export function formatPrice(price: number, currency: string = 'USD', locale: string = 'en'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatPriceRange(min: number, max: number, currency: string = 'USD', locale: string = 'en'): string {
  if (min === max) {
    return formatPrice(min, currency, locale);
  }
  return `${formatPrice(min, currency, locale)} - ${formatPrice(max, currency, locale)}`;
} 