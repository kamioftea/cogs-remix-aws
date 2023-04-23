import * as React from "react";
import type { InputHTMLAttributes } from "react";

export interface FormInputProps {
  label: string;
  name: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  error_message?: string;
  max?: string | number;
}

export default function FormInput({
  label,
  name,
  type = "text",
  required = false,
  autoFocus = false,
  autoComplete,
  defaultValue,
  error_message,
  max,
}: FormInputProps) {
  return (
    <label className={error_message ? "is-invalid-label" : undefined}>
      {label}
      <input
        id={name}
        aria-invalid={error_message ? true : undefined}
        aria-describedby={`${name}-error`}
        className={error_message ? "is-invalid-input" : undefined}
        {...{
          name,
          type,
          required,
          autoFocus,
          autoComplete,
          defaultValue,
          max,
        }}
      />
      {error_message && (
        <span className="form-error is-visible" id={`${name}-error`}>
          {error_message}
        </span>
      )}
    </label>
  );
}
