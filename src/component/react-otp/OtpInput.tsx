import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react"
import { OtpContext } from "./context/OtpContext"
import Input from "./Input"

interface OtpInputProps {
  length: number
  value?: string
  placeholder?: string | undefined
  readonly?: boolean
  disabled?: boolean
  onChange?: Dispatch<SetStateAction<string | string[]>>
}

const OtpInput = ({
  length = 1,
  value,
  placeholder,
  readonly,
  disabled,
  onChange
}: OtpInputProps) => {
  const safeLength = length < 1 ? 1 : length
  const formatCode = value ? value.split("") : new Array(safeLength).fill("")
  const [code, setCode] = useState<string[]>(formatCode)
  const [currentFocus, setFocusIndex] = useState<number>(1)
  const emptyArray = useMemo(() => new Array(safeLength).fill(""), [safeLength])

  if (import.meta.env.DEV && typeof placeholder !== "string") {
    throw new Error("OtpInput: placeholder must be a string")
  }
  const charPlaceholder = placeholder ? placeholder[0] : ""

  useEffect(() => onChange && onChange(code), [code])

  const setNumber = (index: number, char: string) => {
    setCode((prev) => {
      if (prev[index - 1] === char) return prev
      const newCode = [...prev]
      newCode[index - 1] = char
      return newCode
    })
    if (index < safeLength) setFocusIndex(index + 1)
  }

  const removeNumber = (index: number) => {
    setCode((prev) => {
      if (!prev[index - 1]) return prev
      const newCode = [...prev]
      newCode[index - 1] = ""
      return newCode
    })
    if (index > 1) setFocusIndex(index - 1)
  }

  const ContextProps = {
    length,
    currentFocus,
    placeholder: charPlaceholder,
    readonly,
    disabled,
    setNumber,
    removeNumber,
    setFocusIndex
  }

  return (
    <OtpContext.Provider value={ContextProps}>
      <div className="otp-container">
        {emptyArray.map((_, index) => (
          <Input key={index} index={index + 1} value={code[index]} />
        ))}
      </div>
    </OtpContext.Provider>
  )
}

export default OtpInput
