import type { ForwardedRef, InputHTMLAttributes } from "react";
import * as React from "react";
import { purgeUndefined } from "~/utils/purgeUndefined";
import * as yup from "yup";

export interface FormCheckboxProps {
  label: string;
  name: string;
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  defaultChecked?: boolean;
  error_message?: string;
  checkedValue?: string | number;
  uncheckedValue?: string | number;
  ref?: ForwardedRef<HTMLInputElement>;
}

export default function FormCheckbox({
  label,
  name,
  required = false,
  autoFocus = false,
  autoComplete,
  defaultChecked,
  error_message,
  checkedValue,
  uncheckedValue,
  ref,
}: FormCheckboxProps) {
  return (
    <label className={error_message ? "is-invalid-label" : undefined}>
      {uncheckedValue != null && (
        <input type="hidden" value={uncheckedValue} name={name} />
      )}
      <input
        id={name}
        type="checkbox"
        aria-invalid={error_message ? true : undefined}
        aria-describedby={`${name}-error`}
        className={error_message ? "is-invalid-input" : undefined}
        {...purgeUndefined({
          name,
          required,
          autoFocus,
          autoComplete,
          defaultChecked,
          value: checkedValue ?? undefined,
          ref,
        })}
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

export function checkboxSchema() {
  return yup
    .mixed<boolean>()
    .transform((s) => s === "on")
    .default(false);
}
