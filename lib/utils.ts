/**
 * Simple utility function to combine class names
 */
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Gets the public URL base depending on the environment
 */
export function getPublicUrlBase() {
  return process.env.NODE_ENV === 'production' 
    ? 'https://bigswingenergy-6630a.web.app' 
    : '';
} 