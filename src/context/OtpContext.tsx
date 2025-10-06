import { createContext, useContext } from "react"

interface OtpContextProps {
  length: number
  code?: string[]
  currentFocus: number
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  setNumber: (index: number, val: string) => void
  removeNumber: (index: number) => void
  setFocusIndex: (index: number) => void
}

export const OtpContext = createContext<OtpContextProps | null>(null)

export const useOtpContext = () => {
  const ctx = useContext(OtpContext)
  if (!ctx) throw new Error("useOtpContext must be used within OtpProvider")
  return ctx
}
