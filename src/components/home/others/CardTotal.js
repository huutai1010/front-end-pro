import { Box, useTheme, Avatar, Typography, Skeleton } from "@mui/material";
import React from "react";

import ArrowData from "../../common/ArrowData";

import { Location } from "@styled-icons/ionicons-outline";
import {
  Directions,
  User,
  CategoryAlt,
  DollarCircle,
} from "@styled-icons/boxicons-regular";
import { FileEarmarkText, ClipboardCheck } from "@styled-icons/bootstrap";
import { Language } from "@styled-icons/ionicons-solid";

const CardTotalTO = ({ loading, loadingData, admin, data }) => {
  const theme = useTheme();

  const getIcon = (id) => {
    let icon = "";
    if (admin) {
      if (id === 1) {
        icon = <User width={22} />;
      } else if (id === 2) {
        icon = <CategoryAlt width={22} />;
      } else if (id === 3) {
        icon = <Language width={22} />;
      } else if (id === 4) {
        icon = <DollarCircle width={22} />;
      }
    } else {
      if (id === 1) {
        icon = <Location width={22} />;
      } else if (id === 2) {
        icon = <Directions width={22} />;
      } else if (id === 3) {
        icon = <FileEarmarkText width={22} />;
      } else if (id === 4) {
        icon = <ClipboardCheck width={22} />;
      }
    }

    return icon;
  };
  return (
    <Box display="flex" alignItems="center" gap={1.5}>
      {data?.map((item, index) => (
        <Box
          key={index}
          border={2}
          borderColor={theme.palette.background.secondary}
          padding={2}
          minWidth="23.5%"
          borderRadius={2.5}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {loading ? (
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
            ) : (
              <Avatar
                sx={{
                  bgcolor: theme.palette.background.secondary,
                  color: theme.palette.text.active,
                }}
              >
                {getIcon(item.id)}
              </Avatar>
            )}

            {loading ? (
              <Skeleton width={115} />
            ) : (
              <Typography noWrap color={theme.palette.text.third}>
                {item.name}
              </Typography>
            )}
          </Box>
          <ArrowData
            loading={loading}
            loadingData={loadingData}
            totalNum={item.total}
            price={item.name === "Revenue" ? true : false}
            numDirection={item.numberIncreased}
          />
        </Box>
      ))}
    </Box>
  );
};

export default CardTotalTO;
