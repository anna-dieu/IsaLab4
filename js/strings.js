// Strings.js contains all the text and definitions that is required to run the app

export const STR = {
  // Page titles
  storeTitle: "Store Definition",
  searchTitle: "Search Definition",
  
  // Labels
  wordLabel: "Word",
  definitionLabel: "Definition",
  
  // Buttons
  submitButton: "Save",
  searchButton: "Search",
  
  // Success messages
  successSave: "New entry recorded successfully!",
  
  // Error messages
  alreadyExists: "Warning! This word already exists in the dictionary.",
  notFound: "Word not found in the dictionary.",
  invalidWord: "Please enter a valid English word (letters, spaces, hyphens, apostrophes only).",
  invalidDef: "Please enter a non-empty definition (no numbers-only).",
  serverErr: "Server error. Please try again.",
  
  // Dynamic messages
  reqCount: (n) => `Request #${n}`,
  entryCount: (n) => `Total entries: ${n}`
};
