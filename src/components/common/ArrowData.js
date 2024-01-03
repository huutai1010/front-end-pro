import {
  Box,
  Tooltip,
  Typography,
  alpha,
  useTheme,
  Skeleton,
} from "@mui/material";
import React from "react";
import { TrendingUp } from "@styled-icons/boxicons-regular";

const ArrowData = ({ loading, loadingData, totalNum, price, numDirection }) => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="end"
      justifyContent="space-between"
      padding={1}
    >
      {loading ? (
        <Skeleton width={50} />
      ) : (
        <Tooltip title={totalNum}>
          <Typography variant="h5" fontWeight="semiBold" noWrap>
            {loadingData ? (
              <Skeleton width={30} />
            ) : price ? (
              `$ ${Number(totalNum)
                .toFixed(1)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`
            ) : (
              totalNum
            )}
          </Typography>
        </Tooltip>
      )}

      {loading ? (
        <Skeleton width={50} />
      ) : (
        <Tooltip title={`${numDirection} new in day`}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={0.5}
            height={25}
            bgcolor={
              numDirection > 0
                ? alpha(theme.palette.text.onStatus, 0.2)
                : alpha(theme.palette.text.third, 0.1)
            }
            paddingX={1}
            borderRadius={10}
          >
            {loadingData ? (
              <Skeleton width={30} />
            ) : numDirection !== 0 ? (
              <>
                <Typography
                  fontWeight="bold"
                  fontSize={12}
                  color={theme.palette.text.onStatus}
                >
                  {"+" + numDirection}
                </Typography>

                <TrendingUp width={18} color={theme.palette.text.onStatus} />
              </>
            ) : (
              "-"
            )}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export default ArrowData;
