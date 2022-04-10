import React, { HTMLInputTypeAttribute } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<any>;
  label: string;
  field: string;
  errors: FieldErrors<any>;
  type?: HTMLInputTypeAttribute;
  customValidator?: () => boolean;
};

export const BaseInput = ({
  register,
  label,
  field,
  errors,
  type = "text",
  customValidator = () => false,
}: Props) => {
  const defaultErrorStyle = {
    color: "red",
  };
  const handleFormErrors = () => {
    if (errors?.[field]?.type === "required") {
      return (
        <p style={defaultErrorStyle}>Le champ &quot;{label}&quot; est requis</p>
      );
    }
    if (field === "postalCode") {
      const isValidFrenchPostalCode = customValidator();
      if (!isValidFrenchPostalCode) {
        return (
          <p style={defaultErrorStyle}>
            Veuillez vérifier le format du code postal
          </p>
        );
      }
    }

    if (field === "email") {
      const isValidEmail = customValidator();
      if (!isValidEmail) {
        return (
          <p style={defaultErrorStyle}>
            Veuillez vérifier le format de l&quot;adresse email
          </p>
        );
      }
    }
  };
  return (
    <>
      <label htmlFor={field}>{label}</label>
      <input type={type} id={field} {...register(field, { required: true })} />
      {handleFormErrors()}
    </>
  );
};
