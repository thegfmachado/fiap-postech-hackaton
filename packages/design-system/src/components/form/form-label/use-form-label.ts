import type { FormLabelProps } from "./form-label.types";
import { useFormField } from "../form-field/use-form-field";

export function useFormLabel(props: FormLabelProps) {
  const { error, formItemId } = useFormField();

  return {
    ...props,
    error,
    formItemId,
  }
}
