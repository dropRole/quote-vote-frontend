export const triggerValidationErrors: Function = (
  form: HTMLFormElement,
  validationErrors: { field: string; message: string }[]
) => {
  validationErrors.forEach((validationError) => {
    // if object ref is instantiated
    if (form.current) {
      const field = form.current.querySelector(
        `input[name="${validationError.field}"]`
      ) as HTMLInputElement;

      // if field has parent element
      if (field.parentElement) {
        field.parentElement.className = "validation-error";
        field.parentElement.dataset.error = `* ${validationError.message}`;
      }
    }
  });
};

// validate the signup form
export const validateForm: Function = (form: HTMLFormElement): boolean => {
  let validationErrors: { field: string; message: string }[] = [];

  // if object ref instantiated
  if (form.current) {
    const fields = form.current.querySelectorAll("input");
    fields.forEach((field: HTMLInputElement) => {
      switch (field.name) {
        case "email":
          field.value.length > 64 &&
            validationErrors.push({
              field: "email",
              message: "Email shouldn't be longer than 64 chars",
            });
          break;

        case "name":
          field.value.length > 13 &&
            validationErrors.push({
              field: "name",
              message: "Name shouldn't be longer than 13 chars",
            });
          break;

        case "surname":
          field.value.length > 20 &&
            validationErrors.push({
              field: "surname",
              message: "Surname shouldn't be longer than 20 chars",
            });
          break;

        case "username":
          field.value.length < 4 &&
            validationErrors.push({
              field: "username",
              message: "Username must be at least 4 chars long",
            });

          field.value.length > 20 &&
            validationErrors.push({
              field: "username",
              message: "Username shouldn't be longer than 20 chars",
            });
          break;

        case "passCurrent":
        case "pass":
          let message: string = "";
          field.value.length < 8 &&
            (message = message + "Password must be at least 8 chars long");

          field.value.length > 32 &&
            (message =
              message + "\r\n Password shouldn't be longer than 32 chars");

          !/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
            field.value
          ) &&
            (message =
              message +
              "\r\n Password must contain small and, at least one, capital and special chars");

          // if there's an error
          message.length &&
            validationErrors.push({
              field: field.name === "pass" ? "pass" : "passCurrent",
              message: message,
            });

          break;

        case "passConfirm":
          field.value !==
            (
              form.current?.querySelector(
                "input[name='pass']"
              ) as HTMLInputElement
            ).value &&
            validationErrors.push({
              field: "passConfirm",
              message: "Passwords must match",
            });
          break;

        case "avatar":
          field.files &&
            field.files[0].size > 15000 &&
            validationErrors.push({
              field: "avatar",
              message: "File size exceeds 15000B",
            });
      }
    });
  }

  form.current?.querySelectorAll("input").forEach((input: HTMLInputElement) => {
    // if input has parent element
    if (input.parentElement) {
      input.parentElement?.classList.remove("validation-error");
      input.parentElement.dataset.error = "";
    }
  });

  // if no validation errors
  if (!validationErrors.length) return true;

  triggerValidationErrors(form, validationErrors);

  return false;
};
