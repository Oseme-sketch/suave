import type { Meta, StoryObj } from "@storybook/react";
import TextArray from "./TextArray";

const meta = {
  title: "Components/TextArray",
  component: TextArray,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextArray>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    textList: ["This is the default text!"],
    textColor: "#3b82f6",
    baseColorMode: "IDENTICAL",
    displaySize: "MEDIUM",
    startAngle: 0,
    displayState: "STATIC",
  },
};

export const Multiple: Story = {
  args: {
    ...Default.args,
    textList: ["Hello world", "Glad to have you onboard"],
  },
};

export const Colored: Story = {
  args: {
    ...Default.args,
    textColor: "#22c55e",
  },
};

export const Complementary: Story = {
  args: {
    ...Default.args,
    baseColorMode: "COMPLEMENTARY",
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    displaySize: "SMALL",
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    displaySize: "LARGE",
  },
};

export const Static: Story = {
  args: {
    ...Default.args,
    startAngle: 180,
  },
};

export const Rotating: Story = {
  args: {
    ...Default.args,
    displayState: "ROTATING",
  },
};
