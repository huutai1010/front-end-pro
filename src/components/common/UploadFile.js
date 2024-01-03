import { Box, alpha, Typography, useTheme } from "@mui/material";
import React from "react";

import { CloudUploadOutline } from "@styled-icons/evaicons-outline";
import { CloudCheckFill } from "@styled-icons/bootstrap";

const UploadFile = ({ file, setFile, disabled, clearErrors }) => {
  const theme = useTheme();
  const handleChangeFile = (event) => {
    clearErrors("fileType");
    setFile(event.target.files[0]);
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      position="relative"
      overflow="hidden"
      width="100%"
      border={1}
      borderRadius={2.5}
      borderColor={alpha(theme.palette.text.primary, 0.28)}
      height={40}
    >
      <label
        htmlFor="file"
        style={{
          display: "flex",
          color: theme.palette.text.third,
          cursor: "pointer",
        }}
      >
        {file ? (
          <Box display="flex" alignItems="center">
            <CloudCheckFill
              height={24}
              color={theme.palette.text.onStatus}
              style={{ margin: 10 }}
            />
            <Typography noWrap>{file.name}</Typography>
          </Box>
        ) : (
          <Box display="flex" alignItems="center">
            <CloudUploadOutline height={24} style={{ margin: 10 }} />
            <Typography noWrap>Click to import file...</Typography>
          </Box>
        )}

        <input
          id="file"
          name="fileLink"
          style={{
            opacity: 0,
            position: "absolute",
          }}
          disabled={disabled}
          onChange={handleChangeFile}
          type="file"
          accept=".json"
        />
      </label>
    </Box>
  );
};

export default UploadFile;
