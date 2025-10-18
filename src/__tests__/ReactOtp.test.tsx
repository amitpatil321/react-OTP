/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React, { act } from "react"
import { vi } from "vitest"
import ReactOtp from "../component/react-otp/ReactOtp"

describe("ReactOtp component", () => {
  test("renders correct number of inputs based on length prop", () => {
    const onChange = vi.fn()
    render(<ReactOtp value={""} length={4} onChange={onChange} />)
    const inputs = screen.getAllByRole("textbox")
    expect(inputs).toHaveLength(4)
  })

  test("typing in inputs updates value and focuses next input", async () => {
    const onChange = vi.fn()
    render(<ReactOtp value={""} length={4} onChange={onChange} />)
    const user = userEvent.setup()
    const inputs = screen.getAllByRole("textbox")

    await user.type(inputs[0], "1")
    expect(onChange).toHaveBeenCalled()
    expect(inputs[1]).toHaveFocus()

    await user.type(inputs[1], "2")
    expect(onChange).toHaveBeenCalled()
    expect(inputs[2]).toHaveFocus()
  })

  test("backspace clears current input and focuses previous input", async () => {
    const onChange = vi.fn()
    render(<ReactOtp value={"12"} length={4} onChange={onChange} />)
    const user = userEvent.setup()
    const inputs = screen.getAllByRole("textbox")

    // focus on second input and press backspace
    inputs[1].focus()
    await user.keyboard("{Backspace}")
    expect(onChange).toHaveBeenCalled()
    expect(inputs[0]).toHaveFocus()
  })

  test("paste fills inputs accordingly", async () => {
    const onChange = vi.fn()
    render(<ReactOtp value={""} length={4} onChange={onChange} />)
    const inputs = screen.getAllByRole("textbox")

    // simulate paste event on first input
    act(() => {
      fireEvent.paste(inputs[0], {
        clipboardData: {
          getData: () => "1234"
        }
      })
    })

    expect(onChange).toHaveBeenCalledWith("1234")
  })

  test("renders custom input via renderInput prop", () => {
    const onChange = vi.fn()
    const CustomInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
      <input {...props} data-testid="custom-input" />
    )

    render(
      <ReactOtp
        value={""}
        length={4}
        onChange={onChange}
        renderInput={(p) => <CustomInput {...p} />}
      />
    )

    expect(screen.getAllByTestId("custom-input")).toHaveLength(4)
  })

  it("uses passed placeholder prop as placeholder", () => {
    const onChange = vi.fn()

    render(<ReactOtp value={""} length={4} onChange={onChange} placeholder="_" />)
    const inputs = screen.getAllByRole("textbox")
    expect(inputs[0]).toHaveAttribute("placeholder", "_")
    expect(inputs[1]).toHaveAttribute("placeholder", "_")
    expect(inputs[2]).toHaveAttribute("placeholder", "_")
    expect(inputs[3]).toHaveAttribute("placeholder", "_")
  })

  it("renders string separator correctly", () => {
    const onChange = vi.fn()
    render(<ReactOtp value="" length={4} onChange={onChange} separator="-" />)
    const separators = screen.getAllByTestId("otp-sep")
    expect(separators).toHaveLength(3)
    separators.forEach((sep) => {
      expect(sep).toHaveTextContent("-")
    })
  })

  it("renders html separator correctly", () => {
    const onChange = vi.fn()
    render(
      <ReactOtp
        value=""
        length={4}
        onChange={onChange}
        separator={<span style={{ color: "red" }}>*</span>}
      />
    )
    const separators = screen.getAllByTestId("otp-sep")
    expect(separators).toHaveLength(3)
    separators.forEach((sep) => {
      const inner = sep.querySelector("span")
      expect(inner).toHaveStyle("color: rgb(255, 0, 0)")
      expect(inner).toHaveTextContent("*")
      expect(sep).toHaveTextContent("*")
    })
  })

  it("renders input type text correctly", () => {
    const onChange = vi.fn()
    render(<ReactOtp value="" length={4} onChange={onChange} inputType="text" />)
    const textInputs = screen.getAllByRole("textbox")

    textInputs.forEach((each) => {
      expect(each).toHaveAttribute("type", "text")
    })
  })

  it("renders input type password correctly", () => {
    const onChange = vi.fn()
    render(<ReactOtp value="" length={4} onChange={onChange} inputType="password" />)
    const passInputs = screen.getAllByTestId("otp-input")

    passInputs.forEach((each) => {
      expect(each).toHaveAttribute("type", "password")
    })
  })
})
