import type React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isPassword?: boolean
  showPasswordToggle?: boolean
}
