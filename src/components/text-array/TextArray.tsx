import { useEffect, useRef } from "react";
import getComplementaryColor from "./color";

export interface TextArrayProps {
  /**
   *  Array of texts to be displayed.
   *  
   *  numOfChars <= (63 - 2 * numOfTexts)
   */
  textList?: string[];
  /**
   *  Color of texts to be displayed.
   * 
   *  Currently, only "RGB Hexadecimal" is supported.
   */
  textColor?: string;
  /**
   *  Color scheme for the base.
   * 
   *  @todo Implement "CUSTOM" color mode
   */
  baseColorMode?: "COMPLEMENTARY" | "IDENTICAL";
  /**
   *  Size of component to be displayed.
   */
  displaySize?: "SMALL" | "MEDIUM" | "LARGE";
  /**
   *  Angular position of the first character.
   */
  startAngle?: number;
  /**
   *  State of the component.
   */
  displayState?: "STATIC" | "ROTATING";
}

/**
 * This component displays a number of texts around a base
 */
function TextArray({
  textList = ["This is the default text!"],
  textColor = "#3b82f6",
  baseColorMode = "IDENTICAL",
  displaySize = "MEDIUM",
  startAngle = 0,
  displayState = "STATIC",
}: TextArrayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  try {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(textColor);
    if (!result) {
      throw new SyntaxError("Text color must be in hex format");
    }
  } catch (error) {
    console.log(error);
    textColor = "#3b82f6";
    console.log("Text color set to #3b82f6 instead");
  }

  try {
    if (startAngle < 0 || startAngle > 360) {
      throw new RangeError("Start angle must be between 0 and 360");
    }
  } catch (error) {
    console.log(error);
    startAngle = 0;
    console.log("Start angle set to 0 instead");
  }

  const maxNumChars = 63;

  let numOfCharacters = 0;
  let numOfTexts = 0;
  let isExceeded = false;

  const texts = textList
    .filter((item) => {
      numOfTexts += 1;
      numOfCharacters += item.trim().length;
      if (numOfCharacters + 2 * numOfTexts > maxNumChars) {
        isExceeded = true;
      }
      if (isExceeded) {
        numOfCharacters -= item.trim().length;
        console.log(`textList[${numOfTexts - 1}] skipped!`); // index starts at 0
        return false;
      }
      return true;
    })
    .map((item) => {
      return item.trim();
    });

  const effectiveNumOfTexts = texts.length;
  const evenSpaceBetweenTexts = Math.floor(
    (maxNumChars - numOfCharacters) / effectiveNumOfTexts
  );
  const remainingSpace =
    maxNumChars -
    (evenSpaceBetweenTexts * effectiveNumOfTexts + numOfCharacters);

  console.log("Effective texts:", texts);
  console.log("Number of characters from texts:", numOfCharacters);
  console.log("Maximum number of characters allowed:", maxNumChars);

  let canvasWidth = "0";
  let canvasHeight = canvasWidth;
  let textFont = "";
  let baseColor = "#000000";

  switch (displaySize) {
    case "SMALL":
      canvasWidth = "240";
      canvasHeight = canvasWidth;
      textFont = "16px monospace";
      break;

    case "LARGE":
      canvasWidth = "360";
      canvasHeight = canvasWidth;
      textFont = "24px monospace";
      break;

    default:
      canvasWidth = "300";
      canvasHeight = canvasWidth;
      textFont = "20px monospace";
      break;
  }

  switch (baseColorMode) {
    case "COMPLEMENTARY":
      baseColor = getComplementaryColor(textColor);
      break;

    default:
      baseColor = textColor;
      break;
  }

  console.log("Canvas width:", canvasWidth);
  console.log("Canvas height:", canvasHeight);
  console.log("Color of texts:", textColor);
  console.log("Color of base:", baseColor);

  const centerX = Number(canvasWidth) / 2;
  const centerY = centerX;
  const radius = Number(canvasWidth) / 3;

  // the texts sits 10% of radius above the circumference
  const textSeatRadius = 1.1 * radius;

  // angleInRadians = arcLength / radius = arcLength * curvature
  const curvature = 1 / textSeatRadius;

  console.log("Radius of base:", radius);
  console.log("Radius of text seat:", textSeatRadius);

  const draw = (
    context: CanvasRenderingContext2D,
    isRotate: boolean = false,
    degree: number = 0
  ) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();

    if (isRotate) {
      context.translate(centerX, centerY);
      context.rotate((Math.PI / 180) * degree);
      context.translate(-centerX, -centerY);
    }

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fillStyle = baseColor;
    context.fill();

    context.font = textFont;
    context.fillStyle = textColor;
    context.textAlign = "center";
    context.textBaseline = "middle";

    let charAngularPosition = (startAngle * Math.PI) / 180;
    let operativeRemainingSpace = remainingSpace;
    let remainingSpaceSlice = operativeRemainingSpace > 0 ? 1 : 0;

    texts.map((item) => {
      for (let i = 0; i < item.length; i++) {
        context.save();

        const char = item[i];

        context.translate(centerX, centerY);
        context.rotate(charAngularPosition);
        context.fillText(char, 0, -textSeatRadius);
        context.translate(-centerX, -centerY);

        const charWidth = context.measureText(char).width;
        charAngularPosition += charWidth * curvature;

        context.restore();
      }

      charAngularPosition +=
        (evenSpaceBetweenTexts + remainingSpaceSlice) *
        context.measureText(item[0]).width *
        curvature;

      if (operativeRemainingSpace > 0) {
        operativeRemainingSpace -= 1;
      }

      remainingSpaceSlice = operativeRemainingSpace > 0 ? 1 : 0;
    });

    context.restore();
    context.save();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let isRotate = false;
    switch (displayState) {
      case "ROTATING":
        isRotate = true;
        break;

      default:
        isRotate = false;
        break;
    }

    if (isRotate) {
      const angularFrequency = 0.2;
      let degree = 0;
      let animationFrameId: number;

      const render = () => {
        degree += angularFrequency;
        if (degree >= 360) {
          degree = 0;
        }

        draw(ctx, isRotate, degree);
        animationFrameId = window.requestAnimationFrame(render);
      };

      render();

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    } else {
      draw(ctx);
    }
  });

  return (
    <>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </>
  );
}

export default TextArray;
