import { Box, Typography } from "@mui/material";
import React from "react";

const PlaceInfo = ({ info }) => {
  return (
    <Box>
      <Box display="flex">
        <Typography fontSize={14} width={100} fontWeight="medium">
          Place Name
        </Typography>
        <Typography fontSize={14}>{info.name}</Typography>
      </Box>
      <Box display="flex">
        <Typography fontSize={14} width={100} fontWeight="medium">
          Address
        </Typography>
        <Typography fontSize={14} width={200}>
          {info.address}
        </Typography>
      </Box>
    </Box>
  );
};

export default PlaceInfo;
