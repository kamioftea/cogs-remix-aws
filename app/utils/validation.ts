import { ValidationError } from "yup";

export function getYupErrorMessage(
  path: string,
  error: ValidationError
): string | undefined {
  if (error.path === path) return error.errors.join("; ");
  const subErrors = error.inner.flatMap((subError) => {
    const subErrorMessage = getYupErrorMessage(path, subError);
    return subErrorMessage ? [subErrorMessage] : [];
  });
  return subErrors.length ? subErrors.join("; ") : undefined;
}
