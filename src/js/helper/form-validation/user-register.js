export const validationUserRegister = (user) => {
  const errors = {};

  // First Name
  if (!user.first_name) {
    errors.first_name = "First Name is required.";
  }

  // Last Name
  if (!user.last_name) {
    errors.last_name = "Last Name is required.";
  }

  // Email
  if (!user.email) {
    errors.email = "Email is required.";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      errors.email = "Email is invalid.";
    }
  }

  // Password
  if (!user.password) {
    errors.password = "Password is required.";
  } else if (user.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
};

export default validationUserRegister;
