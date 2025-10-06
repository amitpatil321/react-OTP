import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { OtpContext } from "../context/OtpContext"
import Input from "./Input"

interface OtpInputProps {
  length: number
  value?: string
  placeholder?: string | undefined
  readonly?: boolean
  disabled?: boolean
  onChange?: Dispatch<SetStateAction<string | string[]>>
}

const OtpInput = ({ length, value, placeholder, readonly, disabled, onChange }: OtpInputProps) => {
  const formatCode = value ? value.split("") : new Array(length).fill("")
  const [code, setCode] = useState<string[]>(formatCode)
  const [currentFocus, setFocusIndex] = useState<number>(1)
  const emptyArray = new Array(length).fill("")

  if (typeof placeholder !== "string") console.error("Placeholder must be a string")
  const charPlaceholder = placeholder ? placeholder[0] : ""

  useEffect(() => onChange && onChange(code), [code])

  const setNumber = (index: number, char: string) => {
    setCode((prev) => {
      const newCode = [...prev]
      newCode[index - 1] = char
      return newCode
    })
    setFocusIndex(index + 1)
  }

  const removeNumber = (index: number) => {
    const existingCode = [...code]
    existingCode[index - 1] = ""
    setCode(existingCode)
    if (index > 1) {
      setFocusIndex(index - 1)
    }
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
          <Input key={Date.now() + index} index={index + 1} value={code[index]} />
        ))}
      </div>
    </OtpContext.Provider>
  )
}

export default OtpInput
