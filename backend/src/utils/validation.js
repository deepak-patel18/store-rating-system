// ======================================================
// NAME VALIDATION
// Requirement: 20 to 60 characters
// ======================================================

const validateName = (name) => {
  if (!name || typeof name !== "string") {
    return "Name is required";
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 20) {
    return "Name must be at least 20 characters";
  }

  if (trimmedName.length > 60) {
    return "Name must not exceed 60 characters";
  }

  return null;
};


// ======================================================
// EMAIL VALIDATION
// ======================================================

const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return "Email is required";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email address";
  }

  return null;
};


// ======================================================
// ADDRESS VALIDATION
// Requirement: maximum 400 characters
// ======================================================

const validateAddress = (address) => {
  if (!address || typeof address !== "string") {
    return "Address is required";
  }

  const trimmedAddress = address.trim();

  if (trimmedAddress.length === 0) {
    return "Address is required";
  }

  if (trimmedAddress.length > 400) {
    return "Address must not exceed 400 characters";
  }

  return null;
};


// ======================================================
// PASSWORD VALIDATION
// Requirement:
// 8-16 characters
// At least one uppercase letter
// At least one special character
// ======================================================

const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }

  if (
    password.length < 8 ||
    password.length > 16
  ) {
    return "Password must be between 8 and 16 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return null;
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword
};