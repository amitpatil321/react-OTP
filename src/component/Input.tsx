import { useEffect, useRef } from "react"

interface InputProps {
  value: string
  index: number
  currentFocus: number
  setNumber: (index: number, val: string) => void
  removeNumber: (index: number) => void
  setFocusIndex: (index: number) => void
}

const Input = ({
  index,
  value,
  currentFocus,
  setFocusIndex,
  removeNumber,
  setNumber
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (index === currentFocus) {
      inputRef.current?.focus()
    }
  }, [index, currentFocus])

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text")
    if (!pasted) return

    const chars = pasted.split("")
    chars.forEach((char, idx) => {
      setNumber(index + idx, char)
    })
    setFocusIndex(index + chars.length)
  }

  return (
    <input
      ref={inputRef}
      onFocus={(event) => {
        event.target.select()
        setFocusIndex(index)
      }}
      onPaste={handlePaste}
      aria-label="OTP input field"
      value={value}
      className="input"
      type="text"
      id={`input-${index}`}
      tabIndex={index}
      maxLength={1}
      onChange={(e) => setNumber(index, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          removeNumber(index)
          e.preventDefault()
        }
      }}
    />
  )
}

export default Input
