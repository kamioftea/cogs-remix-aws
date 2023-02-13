import type { InputHTMLAttributes } from "react";
import * as React from "react";

export interface FormCheckboxProps {
  label: string;
  name: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  defaultChecked?: boolean;
  error_message?: string;
}

export default function FormCheckbox({
  label,
  name,
  required = false,
  autoFocus = false,
  autoComplete,
  defaultChecked,
  error_message,
}: FormCheckboxProps) {
  return (
    <label className={error_message ? "is-invalid-label" : undefined}>
      <input
        id={name}
        type="checkbox"
        aria-invalid={error_message ? true : undefined}
        aria-describedby={`${name}-error`}
        className={error_message ? "is-invalid-input" : undefined}
        {...{ name, required, autoFocus, autoComplete, defaultChecked }}
      />
      {label}
      {error_message && (
        <span className="form-error is-visible" id={`${name}-error`}>
          {error_message}
        </span>
      )}
    </label>
  );
}
