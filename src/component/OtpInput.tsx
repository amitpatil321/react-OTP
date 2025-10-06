import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import Input from "./Input"

interface OtpInputProps {
  length: number
  value: string
  onChange: Dispatch<SetStateAction<string | string[]>>
}

const OtpInput = ({ length, value, onChange }: OtpInputProps) => {
  const emptyArray = new Array(length).fill("")
  const [code, setCode] = useState<string[] | string>(value)
  const [currentFocus, setFocusIndex] = useState<number>(1)

  useEffect(() => onChange(code), [code])

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

  return (
    <div className="otp-container">
      {emptyArray.map((each, index) => (
        <Input
          key={each}
          value={code[index]}
          currentFocus={currentFocus}
          index={index + 1}
          setNumber={setNumber}
          removeNumber={removeNumber}
          setFocusIndex={setFocusIndex}
        />
      ))}
    </div>
  )
}

export default OtpInput
