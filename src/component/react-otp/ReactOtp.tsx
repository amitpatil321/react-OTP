import {
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type JSX,
  type ReactNode,
  type Ref
} from "react"

import "./ReactOtp.css"

interface ReactOtpProps {
  value: string
  inputType?: "text" | "password"
  length: number
  inputColor?: string
  onChange: (val: string) => void
  placeholder?: string
  readOnly?: boolean
  disabled?: boolean
  defaultFocus?: boolean
  separator?: string | ReactNode
  renderInput?: (
    props: InputHTMLAttributes<HTMLInputElement> & {
      ref?: Ref<HTMLInputElement> | undefined
    }
  ) => JSX.Element
}

const ReactOtp = ({
  value,
  inputColor,
  inputType,
  separator,
  length,
  onChange,
  renderInput,
  placeholder,
  readOnly,
  disabled,
  defaultFocus = false
}: ReactOtpProps) => {
  const [code, setCode] = useState<string>(value)
  const [currentFocus, setFocusIndex] = useState<number>(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const emptyArray = Array.from({ length: length }, (_, i) => code?.[i] || "")

  useEffect(() => {
    if (defaultFocus) {
      inputRefs.current[0]?.focus()
      setFocusIndex(0)
    }
  }, [defaultFocus])

  useEffect(() => {
    if (!defaultFocus) return
    if (currentFocus < length) {
      inputRefs.current[currentFocus]?.focus()
    }
  }, [currentFocus, length, defaultFocus])

  // Keep parent `value` in sync
  useEffect(() => {
    setCode(value)
  }, [value])

  const handleChange = (value: string, index: number) => {
    const arr = code?.split("") || []
    arr[index] = value
    const joined = arr.join("")
    setCode(joined)
    onChange(joined)
    setFocusIndex(index + 1)
  }

  const handleBackSpace = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace") {
      event.preventDefault()
      const arr = code?.split("") || []
      arr[index] = ""
      const joined = arr.join("")
      setCode(joined)
      onChange(joined)
      if (index > 0) setFocusIndex(index - 1)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text")
    if (!pasted) return
    const chars = pasted.split("")
    setCode(chars.join(""))
    onChange(chars.join(""))
    setFocusIndex(pasted.length)
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>, index: number) => {
    event.target.select()
    setFocusIndex(index)
  }

  return (
    <div className="otp-container">
      {emptyArray.map((_, index) => {
        const props = {
          ref: (el: HTMLInputElement) => {
            inputRefs.current[index] = el
          },
          className: "otp-input",
          "data-testid": "otp-input",
          id: `otpinput-${index}`,
          autoComplete: "off",
          type: inputType,
          maxLength: 1,
          value: emptyArray[index],
          placeholder,
          readOnly,
          disabled,
          // autoFocus: defaultFocus && index === 0,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(event.target.value, index),
          onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) =>
            handleBackSpace(event, index),
          onPaste: handlePaste,
          onFocus: (event: React.FocusEvent<HTMLInputElement>) => handleFocus(event, index)
        }
        const input = renderInput ? (
          renderInput(props)
        ) : (
          <input style={{ "--otp-color": inputColor } as React.CSSProperties} {...props} />
        )

        return (
          <div className="otp-cell" key={index}>
            {input}
            {separator && index < length - 1 && (
              <span className="otp-sep" data-testid="otp-sep">
                {separator}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ReactOtp
