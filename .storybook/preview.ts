import "../src/index.css";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: {
        contentsSelector: ".sbdocs-content",
        headingSelector: "h1, h2, h3",
        title: "Table of Contents",
        disable: false,
      },
    },
  },
};

export default preview;
