const validateMessage = (msgContent) => {
  const requiredFields = ["identifier", "type", "deviceId", "text"];
  const requiredFieldsValid = requiredFields.every((field) =>
    Object.keys(msgContent).includes(field)
  );
  const fieldsTypeValid = validateFieldType(msgContent);
  return requiredFieldsValid && fieldsTypeValid;
};

const validateFieldType = (msgContent) => {
  for (const key in msgContent) {
    if (typeof key !== "string") {
      return false;
    }
  }

  return true;
};

module.exports = { validateMessage };
