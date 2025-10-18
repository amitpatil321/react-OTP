import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import ReactOtp from "../component/react-otp/ReactOtp"

const CustomInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="border border-gray-400 rounded-lg w-10 h-10 text-center" />
)

const meta = {
  component: ReactOtp,
  title: "Components/ReactOtp",
  tags: ["autodocs"]
} satisfies Meta<typeof ReactOtp>

export default meta
type Story = StoryObj<typeof meta>

// Wrapper to handle OTP state
const OtpWrapper = (
  args: Omit<React.ComponentProps<typeof ReactOtp>, "onChange" | "value"> & {
    initialValue?: string
  }
) => {
  const [otp, setOtp] = useState(args.initialValue || "")
  return <ReactOtp {...args} value={otp} onChange={setOtp} />
}

// Stories

export const Default: Story = {
  render: () => (
    <OtpWrapper
      initialValue=""
      length={4}
      separator="-"
      placeholder="_"
      inputType="text"
      renderInput={(props) => <CustomInput {...props} />}
    />
  )
}

export const SixDigits: Story = {
  render: () => (
    <OtpWrapper
      initialValue=""
      length={6}
      separator="-"
      placeholder="_"
      inputType="text"
      renderInput={(props) => <CustomInput {...props} />}
    />
  )
}

export const TenDigits: Story = {
  render: () => (
    <OtpWrapper
      initialValue=""
      length={10}
      separator="-"
      placeholder="_"
      inputType="text"
      renderInput={(props) => <CustomInput {...props} />}
    />
  )
}

export const PasswordType: Story = {
  render: () => (
    <OtpWrapper
      initialValue=""
      length={4}
      separator="-"
      placeholder="_"
      inputType="password"
      renderInput={(props) => <CustomInput {...props} />}
    />
  )
}
