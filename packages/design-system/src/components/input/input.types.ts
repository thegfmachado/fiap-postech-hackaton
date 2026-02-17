import type React from "react"
import { FieldError } from "react-hook-form"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
  isPassword?: boolean;
  showPasswordToggle?: boolean;
}
