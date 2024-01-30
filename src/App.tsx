import "./App.css";
import TextArray from "./components/text-array/TextArray";

function App() {
  return (
    <>
      <TextArray
        textList={[
          "Hello World 1",
          "Hi",
          "Hello World 3",
          "Hello World !!",
          "Hello",
          "Hello World 6",
          "Hello World 7",
        ]}
        displayState="ROTATING"
        baseColorMode="COMPLEMENTARY"
        textColor="#7c2d12"
      />
    </>
  );
}

export default App;
