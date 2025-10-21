import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ReactOtp from "../component/react-otp/ReactOtp"

describe("ReactOtp Component", () => {
  const setup = (props = {}) => {
    const handleChange = vi.fn()
    render(<ReactOtp value="" defaultFocus length={4} onChange={handleChange} {...props} />)
    return { handleChange }
  }

  it("renders default inputs when no slots are passed", () => {
    setup()
    const inputs = screen.getAllByRole("textbox")
    expect(inputs).toHaveLength(4)
  })

  it("renders custom slot components when provided", () => {
    type CustomContainerProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
    type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement>
    type CustomSeparatorProps = React.HTMLAttributes<HTMLSpanElement>
    const CustomContainer: React.FC<CustomContainerProps> = ({
      children,
      ...rest
    }: CustomContainerProps) => (
      <div data-testid="custom-container" {...rest}>
        {children}
      </div>
    )
    const CustomInput: React.FC<CustomInputProps> = ({ id, ...rest }: CustomInputProps) => (
      <input id={id} {...rest} />
    )
    const CustomSeparator: React.FC<CustomSeparatorProps> = (props) => (
      <span data-testid="custom-separator" {...props}>
        -
      </span>
    )
    setup({
      slots: {
        Container: CustomContainer,
        Input: CustomInput,
        Separator: CustomSeparator
      }
    })

    expect(screen.getByTestId("custom-container")).toBeInTheDocument()
    expect(screen.getAllByTestId(/otp-input-/)).toHaveLength(4)
    expect(screen.getAllByTestId("custom-separator")).toHaveLength(3)
  })

  it("calls onChange when typing in input", () => {
    const { handleChange } = setup()
    const input = screen.getByTestId("otp-input-0")
    fireEvent.change(input, { target: { value: "1" } })
    expect(handleChange).toHaveBeenCalledWith("1")
  })

  it("moves focus to next input when a character is entered", () => {
    setup()
    const inputs = screen.getAllByRole("textbox")
    fireEvent.change(inputs[0], { target: { value: "1" } })
    const input = screen.getByTestId("otp-input-1")
    expect(input).toHaveFocus()
  })

  it("moves focus to previous input on backspace", () => {
    setup({ value: "1234" })
    const inputs = screen.getAllByRole("textbox")
    inputs[3].focus()
    fireEvent.keyDown(inputs[3], { key: "Backspace" })
    expect(screen.getByTestId("otp-input-2")).toHaveFocus()
  })

  it("handles paste correctly", () => {
    const { handleChange } = setup()
    const inputs = screen.getAllByRole("textbox")
    const event = {
      preventDefault: vi.fn(),
      clipboardData: { getData: vi.fn(() => "1234") }
    } as unknown as React.ClipboardEvent<HTMLInputElement>

    fireEvent.paste(inputs[0], event)
    expect(handleChange).toHaveBeenCalledWith("1234")
  })

  it("focuses first input automatically when defaultFocus=true", () => {
    setup({ defaultFocus: true })
    expect(screen.getByTestId("otp-input-0")).toHaveFocus()
  })

  it("updates internal state when parent value changes", async () => {
    const { rerender } = render(<ReactOtp value="1234" length={4} onChange={vi.fn()} />)

    const inputs = screen.getAllByRole("textbox")
    expect(inputs[0]).toHaveValue("1")
    expect(inputs[1]).toHaveValue("2")
    expect(inputs[2]).toHaveValue("3")
    expect(inputs[3]).toHaveValue("4")

    // ✅ rerender with new props
    rerender(<ReactOtp value="5678" length={4} onChange={vi.fn()} />)

    await waitFor(() => {
      const updatedInputs = screen.getAllByRole("textbox")
      expect(updatedInputs[0]).toHaveValue("5")
      expect(updatedInputs[1]).toHaveValue("6")
      expect(updatedInputs[2]).toHaveValue("7")
      expect(updatedInputs[3]).toHaveValue("8")
    })
  })
})
