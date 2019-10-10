import * as React from "react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";


const menuitemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 }
        }
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: {
            y: { stiffness: 1000 }
        }
    }
};


export const MenuItem = ({ i }) => {
    const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"];
    const style = { border: `2px solid ${colors[i]}` };

    return (
        <motion.li
            variants={menuitemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="icon-placeholder" style={style} />
            <div className="text-placeholder" style={style} />
        </motion.li>
    );
};

/* NAVIGATION */
const navigationVariants = {
    open: {
        transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
        transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
};
const itemIds = [0, 1, 2, 3, 4];

export const Navigation = () => (
  <motion.ul variants={navigationVariants}>
    {itemIds.map(i => (
      <MenuItem i={i} key={i} />
    ))}
  </motion.ul>
);



export const useDimensions = ref => {
    const dimensions = useRef({ width: 0, height: 0 });

    useEffect(() => {
        dimensions.current.width = ref.current.offsetWidth;
        dimensions.current.height = ref.current.offsetHeight;
    }, []);

    return dimensions.current;
};
