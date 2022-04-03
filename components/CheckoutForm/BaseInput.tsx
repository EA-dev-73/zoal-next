import React, { HTMLInputTypeAttribute } from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";

type Props = {
  register: UseFormRegister<any>;
  label: string;
  field: string;
  errors: FieldErrors<any>;
  type?: HTMLInputTypeAttribute;
};

export const BaseInput = ({
  register,
  label,
  field,
  errors,
  type = "text",
}: Props) => {
  return (
    <>
      <label htmlFor={field}>{label}</label>
      <input type={type} id={field} {...register(field, { required: true })} />
      {errors?.[field]?.type === "required" && (
        <p>Le champ &quot;{label}&quot; est requis</p>
      )}
    </>
  );
};
