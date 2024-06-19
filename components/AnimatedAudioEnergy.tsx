import { useEffect, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import styled from "styled-components";
import { HighlightTheme } from "../styles/HighlightTheme";

interface AnimatedAudioEnergyProps {
    maxHeight?: number;
    micActivity: number;
}

const AnimatedAudioEnergy = ({ maxHeight = 20, micActivity }: AnimatedAudioEnergyProps) => {
    const [inputLevel, setInputLevel] = useState<number>(0);
    
    useEffect(() => {
        setInputLevel(Math.max(micActivity, 0));
    }, [micActivity]);
    
    const controlsLeft = useAnimation()
    const controlsCenter = useAnimation()
    const controlsRight = useAnimation()
    
    const heightScalars = [1, 1.5, 2, 2.5, 3]
    const heights = heightScalars.map((scalar) => scalar * maxHeight)

    useEffect(() => {
      const duration = heights[inputLevel] / 100
  
      controlsLeft.start({
        height: heights[inputLevel] * (inputLevel === 0 ? 1 : 0.6),
        backgroundColor: inputLevel === 0 ? '#ccc' : HighlightTheme.brand.primary["0"],
        transition: { duration }
      })
      controlsCenter.start({
        height: heights[inputLevel],
        backgroundColor: inputLevel === 0 ? '#ccc' : HighlightTheme.brand.primary["0"],
        transition: { duration }
      })
      controlsRight.start({
        height: heights[inputLevel] * (inputLevel === 0 ? 1 : 0.6),
        backgroundColor: inputLevel === 0 ? '#ccc' : HighlightTheme.brand.primary["0"],
        transition: { duration }
      })
    }, [inputLevel, controlsLeft, controlsCenter, controlsRight])
    
    return (
        <Container maxHeight={maxHeight}>
        <Shape
        animate={controlsLeft}
        initial={{ height: heights[0], backgroundColor: HighlightTheme.brand.primary["0"] }}
        maxHeight={maxHeight}
        />
        <Shape
        animate={controlsCenter}
        initial={{ height: heights[0], backgroundColor: HighlightTheme.brand.primary["0"] }}
        maxHeight={maxHeight}
        />
        <Shape
        animate={controlsRight}
        initial={{ height: heights[0], backgroundColor: HighlightTheme.brand.primary["0"] }}
        maxHeight={maxHeight}
        />
        </Container>
    );
};

// Container and Shape styled components remain unchanged

interface ContainerProps {
    maxHeight: number;
}

const Container = styled.div<ContainerProps>`
display: flex;

gap: ${({ maxHeight }) =>
    Math.max(maxHeight / 5, 5)}px; /* Adjust the gap relative to maxHeight */

justify-content: center;

align-items: center;

height: ${({ maxHeight }) => maxHeight * 3 + 8}px;

width: ${({ maxHeight }) => maxHeight * 3 + 8}px;

padding: 4px;

border-radius: 50%;
`;

interface ShapeProps {
    maxHeight: number;
}

const Shape = styled(motion.div)<ShapeProps>`
background-color: ${(props) => props.color};

border-radius: 25px;

width: ${({ maxHeight }) =>
    maxHeight / 2.5}px; /* Adjust the shape width relative to maxHeight */
`;

export default AnimatedAudioEnergy;
