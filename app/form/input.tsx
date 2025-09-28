import * as React from "react";
import type { ForwardedRef, InputHTMLAttributes } from "react";
import type { FormInput } from "aws-sdk/clients/datazone";

export interface FormInputProps {
  label: string;
  name: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  value?: string | number;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  error_message?: string;
  max?: string | number;
  ref?: ForwardedRef<HTMLInputElement>;
}

export default function FormInput({
  label,
  name,
  type = "text",
  required = false,
  autoFocus = false,
  autoComplete,
  defaultValue,
  value,
  onChange,
  error_message,
  max,
  ref,
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
          value,
          onChange,
          max,
          ref,
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
