import { Button, CircularProgress, Typography } from "@mui/material";
import React from "react";

const SubmitBtn = ({ update, onSubmit }) => {
  return (
    <Button
      disabled={update}
      variant="contained"
      color="error"
      sx={{
        width: "142px",
        height: "36px",
        borderRadius: 2.5,
      }}
      onClick={onSubmit}
    >
      {update ? (
        <CircularProgress color="error" size={25} />
      ) : (
        <Typography fontWeight="medium">Save Change</Typography>
      )}
    </Button>
  );
};

export default SubmitBtn;
