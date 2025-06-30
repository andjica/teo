export const validateUserSettings = (user) => {
  const errors = {};

  // First name
  if (!user.first_name || user.first_name.trim() === "") {
    errors.first_name = "First name is required";
  }

  // Last name
  if (!user.last_name || user.last_name.trim() === "") {
    errors.last_name = "Last name is required";
  }

  // Email
  if (!user.email || user.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
    errors.email = "Invalid email format";
  }

  // Phone
  if (!user.phone || user.phone.trim() === "") {
    errors.phone = "Phone number is required";
  } else if (!/^[\d+\s-]{6,}$/.test(user.phone)) {
    errors.phone = "Invalid phone number";
  }

  // Country
  if (!user.country) {
    errors.country = "Country is required";
  }

  // City
  if (!user.city) {
    errors.city = "City is required";
  }

  // Address
  if (!user.address || user.address.trim() === "") {
    errors.address = "Address is required";
  }

  // ZIP
  if (!user.zip || user.zip.trim() === "") {
    errors.zip = "ZIP code is required";
  }

  return errors;
};
