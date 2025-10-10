import { useCallback, useEffect, useRef } from "react"
import { useOtpContext } from "./context/OtpContext"

interface InputProps {
  index: number
  value: string
}

const Input = ({ index, value }: InputProps) => {
  const {
    length,
    placeholder,
    readonly,
    disabled,
    currentFocus,
    setNumber,
    removeNumber,
    setFocusIndex
  } = useOtpContext()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (index === currentFocus) {
      inputRef.current?.focus()
    }
  }, [index, currentFocus, disabled])

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()
      const pasted = event.clipboardData.getData("text")
      if (!pasted) return

      const chars = pasted.split("")
      new Array(length).fill("").forEach((_, idx) => {
        setNumber(index + idx, chars[idx])
      })
      setFocusIndex(index + chars.length)
    },
    [index, length, setNumber, setFocusIndex]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        removeNumber(index)
        e.preventDefault()
      }
    },
    [index, removeNumber]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const char = e.target.value
      if (char) setNumber(index, char[0]) // take only first char
    },
    [index, setNumber]
  )

  return (
    <input
      ref={inputRef}
      onFocus={(event) => {
        event.target.select()
        setFocusIndex(index)
      }}
      onPaste={handlePaste}
      aria-label="OTP input field"
      placeholder={placeholder || ""}
      value={value}
      className="input"
      type="text"
      id={`input-${index}`}
      tabIndex={index}
      maxLength={1}
      readOnly={readonly}
      disabled={disabled}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      // onChange={(e) => setNumber(index, e.target.value)}
      // onKeyDown={(e) => {
      //   if (e.key === "Backspace") {
      //     removeNumber(index)
      //     e.preventDefault()
      //   }
      // }}
    />
  )
}

export default Input
