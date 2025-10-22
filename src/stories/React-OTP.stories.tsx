import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import ReactOtp from "../component/react-otp/ReactOtp"

const meta = {
  component: ReactOtp,
  title: "Components/ReactOtp",
  tags: ["autodocs"],
  argTypes: {
    inputType: {
      control: { type: "radio" },
      options: ["text", "password"]
    },
    length: { control: { type: "number" } }
  }
} satisfies Meta<typeof ReactOtp>

export default meta
type Story = StoryObj<typeof meta>

const OtpWrapper = (
  args: Omit<React.ComponentProps<typeof ReactOtp>, "onChange" | "value"> & {
    initialValue?: string
  }
) => {
  const [otp, setOtp] = useState(args.initialValue || "")
  return <ReactOtp {...args} value={otp} onChange={setOtp} />
}

// ✅ Define story with both `args` and `render`
export const Default: Story = {
  args: {
    value: "1234",
    length: 4,
    inputType: "text",
    onChange: () => console.log("On change")
  },
  render: (args) => <OtpWrapper {...args} />
}
