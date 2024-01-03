import React, { useEffect, useRef, useState } from "react";
import { Button, Typography } from "@mui/material";
const DescriptionItem = (props) => {
  const [more, setMore] = useState(false);
  const textRef = useRef(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const numberOfLines = textRef.current.clientHeight / 16;
      setIsButtonVisible(numberOfLines > 5);
    }
  }, [props.description]);

  return (
    <>
      <Typography
        ref={textRef}
        sx={
          more
            ? null
            : {
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 4,
              }
        }
        variant="span"
      >
        {props.description}
      </Typography>
      {isButtonVisible && (
        <Button onClick={() => setMore((more) => !more)}>
          {more ? "Read less" : "Read more"}
        </Button>
      )}
    </>
  );
};

export default DescriptionItem;
