// validate the signup form
export const validateForm: Function = (
  form: HTMLFormElement
): {
  valid: boolean;
  validationErrors: { [key: string]: { message: string } };
} => {
  let validationErrors: { [key: string]: { message: string } } = {};

  // if object ref instantiated
  if (form) {
    const formData: FormData = new FormData(form);

    for (const [key, value] of formData.entries())
      switch (key) {
        case "email":
          value.toString().length > 64 &&
            (validationErrors.email = {
              message: "*Email shouldn't be longer than 64 chars",
            });
          break;

        case "name":
          value.toString().length > 13 &&
            (validationErrors.name = {
              message: "*Name shouldn't be longer than 13 chars",
            });
          break;

        case "surname":
          value.toString().length > 20 &&
            (validationErrors.surname = {
              message: "*Surname shouldn't be longer than 20 chars",
            });
          break;

        case "username":
          value.toString().length < 4 &&
            (validationErrors.username = {
              message: "*Username should be longer than 4 chars",
            });

          value.toString().length > 20 &&
            (validationErrors.email = {
              message: "*Username shouldn't be longer than 20 chars",
            });
          break;

        case "passCurrent":
        case "pass":
          let message: string = "";
          value.toString().length < 8 &&
            (message = message + "*Password must be at least 8 chars long");

          value.toString().length > 32 &&
            (message =
              message + "\r\n *Password shouldn't be longer than 32 chars");

          !/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
            value.toString()
          ) &&
            (message =
              message +
              "\r\n *Password must contain small and, at least one, capital and special chars");

          // if there's an error
          message.length &&
            (key === "pass"
              ? (validationErrors.pass = {
                  message,
                })
              : (validationErrors.passCurrent = {
                  message,
                }));

          break;

        case "passConfirm":
          value !== formData.get("pass") &&
            (validationErrors.passConfirm = {
              message: "*Passwords must match",
            });
          break;

        case "avatar":
          value &&
            (value as File).size > 15000 &&
            (validationErrors.avatar = {
              message: "*File size exceeds 15000B",
            });
      }
  }
  // if no validation errors
  if (Object.keys(validationErrors).length === 0)
    return { valid: true, validationErrors: {} };

  return { valid: false, validationErrors };
};
