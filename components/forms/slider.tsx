// Blog post and origin:
//https://webanimation.blog/blog/react-dual-range-slider-framer-motion/

import React from "react";
import { css } from "@emotion/core";
import { motion } from "framer-motion";
import styled from "@emotion/styled";

interface Props {
  max: number;
  defaultMinBudget?: number;
  defaultMaxBudget?: number;
  label?: string;
  onChange: any;
  // setSliderMin?: (value: number) => void;
  // setSliderMax?: (value: number) => void;
}

const Knob = styled.div`
  ${({ knobSize }: any) => css`
width: ${knobSize / 2}rem;
height: ${knobSize / 2}rem;
border-radius: 50%;
background-color: white;
top: calc(-50%);
position: absolute;
box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.15);
cursor: pointer;

&:nth-of-type(2) {
  // left: -2rem;
`}
`;

const AnimatedKnob = Knob.withComponent(motion.div);

// const AmountLabels = styled.div`
//   font-size: 0.875rem;
//   background-color: #fafafa;
//   border-radius: 0.5rem;
//   padding: 0.5rem;
//   display: inline-block;
//   // margin-bottom: 0.5rem;
// `;

const Holder = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const Track = styled(motion.div)`
  ${({ trackWidth, knobX, knobXSecond, trackWidthInPx }: any) => css`
    width: ${trackWidth}rem;
    height: 0.5rem;
    background-color: #3d5ef8;
    /* This gradient contains a calculation for the slider track. */
    background: linear-gradient(
      to right,
      #dae3f4 0%,
      #dae3f4 ${Number((100 * (knobX / trackWidthInPx)).toFixed(2))}%,
      #3d5ef8 ${Number(100 * (knobX / trackWidthInPx)).toFixed(2)}%,
      #3d5ef8 ${Number((100 * (knobXSecond / trackWidthInPx)).toFixed(2))}%,
      #dae3f4 ${Number(100 * (knobXSecond / trackWidthInPx)).toFixed(2)}%
    );
    border-radius: 0.25rem;
    position: relative;
    // margin: 1rem 0 2rem;
  `}
`;

const Slider: React.FC<Props> = (props) => {
  const { max, defaultMinBudget, defaultMaxBudget, onChange } = props;

  const trackLength = 10;
  const trackWidth = 1.5 * trackLength;
  const trackWidthInPx = trackWidth * 16; //192
  const knobSize = 2;
  const knobSizeInPx = knobSize * 16;
  const knobSeparatorLength = knobSizeInPx;

  function getPixelValue(knob: number) {
    return (knob / max) * trackWidthInPx;
  }

  function getValue(knob: number) {
    const value: number = parseInt((max / (trackWidthInPx / knob)).toFixed(0), 10);
    return Math.ceil(value / 5) * 5;
  }

  const [knobX, updateKnobX] = React.useState(
    defaultMinBudget ? getPixelValue(defaultMinBudget) : 0
  );
  const [knobXSecond, updateKnobXSecond] = React.useState(
    defaultMaxBudget ? getPixelValue(defaultMaxBudget) : trackWidthInPx
  );
  const constraintsRef = React.useRef(null);

  return (
    <Holder>
      <input type="hidden" name={"price-min"} value={(max / (trackWidthInPx / knobX)).toFixed(0)} />
      <input
        type="hidden"
        name={"price-max"}
        value={(max / (trackWidthInPx / knobXSecond)).toFixed(0)}
      />
      {/* <p
        css={css`
          text-align: left;
          font-weight: bold;
          margin: 0.5rem 0;
        `}
      >
        {label}
      </p> */}
      {/* <AmountLabels>
        <small
          css={css`
            margin-bottom: 0.25rem;
            margin-right: 0.25rem;
          `}
        >
          {knobX > 0
            ? Math.ceil(parseInt((max / (trackWidthInPx / knobX)).toFixed(0), 10) / 5) * 5
            : "No min."}
        </small>
        {"-"}
        <small
          css={css`
            margin-bottom: 0.25rem;
            margin-left: 0.25rem;
          `}
        >
          {Math.ceil(parseInt((max / (trackWidthInPx / knobXSecond)).toFixed(0), 10) / 5) * 5}
        </small>
      </AmountLabels> */}

      <Track
        ref={constraintsRef}
        trackWidth={trackWidth}
        knobX={knobX}
        knobXSecond={knobXSecond}
        trackWidthInPx={trackWidthInPx}
      >
        <AnimatedKnob
          knobSize={knobSize}
          drag="x"
          initial={{
            x: knobX,
          }}
          dragMomentum={false}
          onDragEnd={() => {
            const minPrice = Number(getValue(knobX));
            onChange([minPrice, defaultMaxBudget]);
          }}
          onDrag={(event, info) => {
            // Check if the point where you slide is bigger than second knob...
            // knobSeparatorLength is a magic value for 2rem size of the knobs. This will influence the bounds of the knobs
            const newValue =
              info.point.x > knobXSecond - knobSeparatorLength
                ? knobXSecond - knobSeparatorLength
                : info.point.x;
            //Math.ceil(N / 5) * 5; rounds to nearest 5
            updateKnobX(newValue < 0 ? 0 : Math.ceil(newValue / 5) * 5);
          }}
          // Cant be dragged further than...
          dragConstraints={{
            left: 0,
            right: knobXSecond - knobSeparatorLength,
          }}
        />
        <AnimatedKnob
          knobSize={knobSize}
          drag="x"
          initial={{
            x: knobXSecond,
          }}
          dragMomentum={false}
          onDragEnd={() => {
            const maxPrice = Number(getValue(knobXSecond));
            // console.log(maxPrice);
            // setSliderMax(maxPrice);
            onChange([defaultMinBudget, maxPrice]);
          }}
          onDrag={(event, info) => {
            // Check if the point where you slide isn't smaller than first knob and not bigger than bounds...
            const newValue =
              info.point.x > trackWidthInPx
                ? trackWidthInPx
                : info.point.x < knobX + knobSeparatorLength
                ? knobX + knobSeparatorLength
                : info.point.x;
            updateKnobXSecond(Math.ceil(newValue / 5) * 5);
          }}
          dragConstraints={{
            left: knobX + knobSeparatorLength,
            right: trackWidthInPx,
          }}
        />
      </Track>
    </Holder>
  );
};
export default Slider;
