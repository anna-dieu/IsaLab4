class Validator {
  // Accept letters, spaces, hyphens, apostrophes; must start with a letter
  isValidWord(s) {
    return typeof s === "string" && /^[A-Za-z][A-Za-z\s\-']*$/.test(s.trim());
  }

  isValidDefinition(s) {
    if (typeof s !== "string") return false;
    const t = s.trim();
    if (!t) return false;
    // disallow numbers-only
    return !/^\d+$/.test(t);
  }
}

// Create a singleton instance
export const validator = new Validator();

// Export convenience functions for backward compatibility
export const isValidWord = (s) => validator.isValidWord(s);
export const isValidDefinition = (s) => validator.isValidDefinition(s);
