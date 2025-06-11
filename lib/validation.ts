import { FormikErrors } from "formik";
import { ILogininInputValues, ISiginInputValues, IForgetInputValues } from "./types";

export const LoginInValidation = (values: ILogininInputValues): any => {
  const errors: FormikErrors<ILogininInputValues> = {};
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
  // email validation
  if (!values.email) {
    errors.email = "This field is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email";
  }

  if (!values.password) {
    errors.password = "This field is required";
  } else if (!strongRegex.test(values.password)) {
    errors.password = "Invalid password";
  }
  return errors;
};

export const SignUpValidation = (values: ISiginInputValues): any => {
  const errors: FormikErrors<ISiginInputValues> = {};
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

  if (!values.first_name) {
    errors.first_name = "This field is required";
  }
  if (!values.last_name) {
    errors.last_name = "This field is required";
  }
  // email validation
  if (!values.email) {
    errors.email = "This field is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email";
  }
  if (!values.password) {
    errors.password = "This field is required";
  } else if (!strongRegex.test(values.password)) {
    errors.password =
      "Password must have at-least 8 characters with uppercase, lowercase, number & special characters included";
  }
  if (!values.confirm_password) {
    errors.confirm_password = "This field is required";
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = "Confirm password does not match with password";
  }
  return errors;
};

export const ForgetPassValidation = (values: IForgetInputValues): any => {
  const errors: FormikErrors<IForgetInputValues> = {};

  // email validation
  if (!values.email) {
    errors.email = "This field is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email";
  }

  return errors;
};

export const ChangePassValidation = (values: any): any => {
  const errors: FormikErrors<any> = {};
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
  // name validation
  if (!values.old_password) {
    errors.old_password = "This field is required";
  }
  if (!values.new_password) {
    errors.new_password = "This field is required";
  } else if (!strongRegex.test(values.new_password)) {
    errors.new_password =
      "Password must have at-least 8 characters with uppercase, lowercase, number & special characters included";
  }
  if (!values.confirm_password) {
    errors.confirm_password = "This field is required";
  } else if (values.new_password !== values.confirm_password) {
    errors.confirm_password = "Password does not match with new password";
  }

  return errors;
};

export const ResetPassValidation = (values: any): any => {
  const errors: FormikErrors<any> = {};
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

  if (!values.new_password) {
    errors.new_password = "This field is required";
  } else if (!strongRegex.test(values.new_password)) {
    errors.new_password =
      "Password must have at-least 8 characters with uppercase, lowercase, number & special characters included";
  }
  if (!values.confirm_password) {
    errors.confirm_password = "This field is required";
  } else if (values.new_password !== values.confirm_password) {
    errors.confirm_password = "Confirm password does not match with password";
  }

  return errors;
};

export const SettingsPageValidation = (values: any): any => {
  const errors: FormikErrors<any> = {};

  if (!values.contact_number) {
    errors.contact_number = "This field is required";
  }
  // if (!values.company) {
  //   errors.company = "This field is required";
  // }
  // if (!values.role) {
  //   errors.company = "This field is required";
  // }
  // if (!values.industry) {
  //   errors.company = "This field is required";
  // }
  // if (!values.role) {
  //   errors.company = "";
  // }
  // if (!values.industry) {
  //   errors.company = "This field is required";
  // }

  return errors;
};
