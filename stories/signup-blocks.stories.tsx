import type { Meta, StoryObj } from "@storybook/react-vite"

import { SignupForm } from "@/components/blocks/signup-form"
import { SignupSteps } from "@/components/blocks/signup-steps"
import { SignupTrial } from "@/components/blocks/signup-trial"

const meta = {
  title: "Blocks/Signup",
  component: SignupForm,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SignupForm>

export default meta

type Story = StoryObj<typeof meta>

export const Form: Story = {}

export const Steps: Story = { render: () => <SignupSteps /> }

export const Trial: Story = { render: () => <SignupTrial /> }
