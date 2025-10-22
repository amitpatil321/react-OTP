import React, { useEffect, useRef, useState } from "react"
import "./ReactOtp.css"

export interface ReactOtpProps {
  value: string
  inputType?: "text" | "password"
  length: number
  onChange: (val: string) => void
  defaultFocus?: boolean
  slots?: {
    Container?: React.ElementType<React.HTMLAttributes<HTMLElement>>
    Input?: React.ElementType<React.InputHTMLAttributes<HTMLInputElement>>
    Separator?: React.ElementType<React.HTMLAttributes<HTMLElement>>
  }
}

const ReactOtp = ({
  value,
  slots = {},
  inputType = "text",
  length,
  onChange,
  defaultFocus = false
}: ReactOtpProps) => {
  const [code, setCode] = useState<string>(value)
  const [currentFocus, setFocusIndex] = useState<number>(defaultFocus ? 0 : -1)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if (value === undefined) {
        console.warn("ReactOtp: Missing `value` prop — component will not be controlled properly.")
      }
    }
  }, [])

  const {
    Container = (props: React.HTMLAttributes<HTMLElement>) => (
      <div className="otp-container" {...props} />
    ),
    Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
      <input {...props} className={`otp-input ${props.className ?? ""}`} />
    ),
    Separator = (props: React.HTMLAttributes<HTMLElement>) => <span {...props}></span>
  } = slots

  // Sync internal state with parent value
  useEffect(() => {
    if (value !== code) {
      setCode(value)
    }
  }, [value])

  // Focus on first input if defaultFocus is true
  useEffect(() => {
    if (defaultFocus) {
      inputRefs.current[0]?.focus()
      setFocusIndex(0)
    }
  }, [defaultFocus])

  useEffect(() => {
    if (currentFocus < length) {
      inputRefs.current[currentFocus]?.focus()
    }
  }, [currentFocus, length])

  const handleChange = (val: string, index: number) => {
    setCode((prev) => {
      const arr = prev.split("")
      arr[index] = val.slice(-1)
      const joined = arr.join("")
      onChange(joined)
      if (val && index < length - 1) setFocusIndex(index + 1)
      return joined
    })
  }

  const handleBackSpace = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace") {
      event.preventDefault()
      const arr = code.split("")
      arr[index] = ""
      const joined = arr.join("")
      setCode(joined)
      onChange(joined)
      if (index > 0) setFocusIndex(index - 1)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").slice(0, length)
    if (!pasted) return
    setCode(pasted)
    onChange(pasted)
    setFocusIndex(pasted.length - 1)
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>, index: number) => {
    event.target.select()
    setFocusIndex(index)
  }

  const otpArray = Array.from({ length }, (_, i) => code[i] || "")

  return (
    <Container>
      {otpArray.map((val, index) => {
        const inputProps = {
          ref: (el: HTMLInputElement) => {
            inputRefs.current[index] = el
          },
          "data-testid": `otp-input-${index}`,
          "aria-label": `OTP input ${index + 1} of ${length}`,
          className: "otp-input",
          id: `otpinput-${index}`,
          autoComplete: "off",
          type: inputType,
          maxLength: 1,
          value: val,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value, index),
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleBackSpace(e, index),
          onPaste: handlePaste,
          onFocus: (e: React.FocusEvent<HTMLInputElement>) => handleFocus(e, index)
        }

        return (
          <React.Fragment key={index}>
            <Input {...inputProps} />
            {index < length - 1 && <Separator />}
          </React.Fragment>
        )
      })}
    </Container>
  )
}

export default ReactOtp
