/**
 * Simple client-side rate limiter for authentication attempts
 * Prevents brute force attacks by limiting login attempts
 */

const RATE_LIMIT_KEY = 'auth_rate_limit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export class RateLimiter {
  /**
   * Check if the user is currently rate limited
   * @returns {Object} { limited: boolean, remainingTime: number, attemptsLeft: number }
   */
  static checkLimit() {
    const data = this.getData();
    
    if (!data) {
      return { limited: false, remainingTime: 0, attemptsLeft: MAX_ATTEMPTS };
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - data.lastAttempt;

    // Reset if lockout period has passed
    if (data.locked && now > data.lockoutUntil) {
      this.reset();
      return { limited: false, remainingTime: 0, attemptsLeft: MAX_ATTEMPTS };
    }

    // Check if locked
    if (data.locked) {
      const remainingTime = Math.ceil((data.lockoutUntil - now) / 1000 / 60); // minutes
      return { limited: true, remainingTime, attemptsLeft: 0 };
    }

    // Reset attempts if more than 15 minutes since last attempt
    if (timeSinceLastAttempt > 15 * 60 * 1000) {
      this.reset();
      return { limited: false, remainingTime: 0, attemptsLeft: MAX_ATTEMPTS };
    }

    const attemptsLeft = MAX_ATTEMPTS - data.attempts;
    return { limited: false, remainingTime: 0, attemptsLeft };
  }

  /**
   * Record a failed login attempt
   * @returns {Object} { locked: boolean, remainingTime: number, attemptsLeft: number }
   */
  static recordAttempt() {
    const data = this.getData() || { attempts: 0, lastAttempt: 0, locked: false };
    
    data.attempts += 1;
    data.lastAttempt = Date.now();

    // Lock if max attempts reached
    if (data.attempts >= MAX_ATTEMPTS) {
      data.locked = true;
      data.lockoutUntil = Date.now() + LOCKOUT_DURATION;
      this.saveData(data);
      
      return {
        locked: true,
        remainingTime: Math.ceil(LOCKOUT_DURATION / 1000 / 60), // minutes
        attemptsLeft: 0,
      };
    }

    this.saveData(data);
    
    return {
      locked: false,
      remainingTime: 0,
      attemptsLeft: MAX_ATTEMPTS - data.attempts,
    };
  }

  /**
   * Reset the rate limiter (call on successful login)
   */
  static reset() {
    localStorage.removeItem(RATE_LIMIT_KEY);
  }

  /**
   * Get rate limit data from localStorage
   * @private
   */
  static getData() {
    try {
      const data = localStorage.getItem(RATE_LIMIT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Save rate limit data to localStorage
   * @private
   */
  static saveData(data) {
    try {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save rate limit data:', error);
    }
  }

  /**
   * Get a user-friendly message about the rate limit
   */
  static getMessage(limitInfo) {
    if (limitInfo.limited) {
      return `Too many failed attempts. Please try again in ${limitInfo.remainingTime} minute${limitInfo.remainingTime !== 1 ? 's' : ''}.`;
    }
    
    if (limitInfo.attemptsLeft <= 2 && limitInfo.attemptsLeft > 0) {
      return `Warning: ${limitInfo.attemptsLeft} attempt${limitInfo.attemptsLeft !== 1 ? 's' : ''} remaining before temporary lockout.`;
    }
    
    return null;
  }
}

export default RateLimiter;
