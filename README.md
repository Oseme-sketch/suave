# Suave UI

A library of elegant React components.

## Installation

Please note that [react](https://www.npmjs.com/package/react) and [react-dom](https://www.npmjs.com/package/react-dom) are peer dependencies. Hence, you should install them before installing Suave UI.

Install the package in your project directory with:
```
npm install suave-ui
```

## Available components

- TextArray

## Usage

```
import { TextArray } from "suave-ui";

function App() {
  return (
    <TextArray
      baseColorMode="COMPLEMENTARY"
      displaySize="MEDIUM"
      displayState="STATIC"
      startAngle={0}
      textColor="#3b82f6"
      textList={[
        'Hello world',
        'Glad to have you onboard'
      ]}
    />
  );
}

export default App;
```

## License

This project is licensed under the terms of the MIT license.
