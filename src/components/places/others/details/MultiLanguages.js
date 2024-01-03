import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Skeleton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";
import dayjs from "dayjs";

import DescriptionItem from "../../../common/DescriptionItem";

const MultiLanguages = ({ values, loading }) => {
  const theme = useTheme();

  const color = (status) => {
    let color = theme.palette.text.active;
    if (status === 0) {
      color = theme.palette.text.active;
    } else if (status === 1) {
      color = theme.palette.text.pending;
    } else if (status === 2) {
      color = theme.palette.text.onStatus;
    } else if (status === 3) {
      color = theme.palette.text.active;
    }

    return color;
  };

  return (
    <Box>
      {values?.placeDescriptions?.map((item, index) => (
        <Box key={index}>
          {index === 0 ? null : <Divider />}
          <Grid container spacing={2} paddingY={2}>
            <Grid item xs={12}>
              {loading ? (
                <Skeleton width={200} />
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src={item?.languageIcon}
                      alt={item?.languageName}
                      style={{
                        width: 20,
                        border: "1px solid #ccc",
                        marginRight: 10,
                      }}
                    />
                    <Typography fontWeight="medium" textTransform="uppercase">
                      {item?.languageName}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    paddingX={1}
                    paddingY={0.25}
                    bgcolor={alpha(color(item.status), 0.2)}
                    borderRadius={2.5}
                    width={90}
                  >
                    <Typography
                      fontWeight="medium"
                      fontSize={14}
                      textTransform="capitalize"
                      color={color(item.status)}
                    >
                      {item.statusType}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>

            {/* Tour Name */}
            <Grid item xs={12} md={3} lg={2}>
              {loading ? (
                <Skeleton width={100} />
              ) : (
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color={theme.palette.text.third}
                >
                  Place Name{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={9} lg={10}>
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Typography>{item.name}</Typography>
              )}
            </Grid>

            {/* Tour Decription */}
            <Grid item xs={12} md={3} lg={2}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : (
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color={theme.palette.text.third}
                >
                  Decription{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={9} lg={10}>
              {loading ? (
                <Skeleton width="100%" height={30} />
              ) : (
                <DescriptionItem {...item} />
              )}
            </Grid>

            {/* Voice File */}
            <Grid item xs={12} md={3} lg={2}>
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  color={theme.palette.text.third}
                >
                  Voice File{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={9} lg={10}>
              {loading ? (
                <Skeleton width="100%" />
              ) : item.status === 1 ? (
                <Box>
                  <Typography fontSize={14} color={theme.palette.text.third}>
                    The voice file is converting...
                  </Typography>
                  <LinearProgress color="error" sx={{ borderRadius: 2.5 }} />
                </Box>
              ) : (
                <ReactPlayer
                  url={item.voiceFile}
                  controls={true}
                  height={40}
                  width="100%"
                />
              )}
            </Grid>

            {/* Create Time */}
            <Grid item xs={12} md={3} lg={2}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : (
                <>
                  <Typography
                    fontSize={14}
                    fontWeight="medium"
                    color={theme.palette.text.third}
                  >
                    Create Time
                  </Typography>
                </>
              )}
            </Grid>
            <Grid item xs={12} md={9} lg={10}>
              {loading ? (
                <Skeleton width="100%" height={30} />
              ) : (
                <Typography fontSize={14} color={theme.palette.text.third}>
                  {dayjs(item.createTime).format("LL")}
                </Typography>
              )}
            </Grid>

            {/* CreateTime */}
            <Grid item xs={12} md={3} lg={2}>
              {loading ? (
                <Skeleton width={100} height={30} />
              ) : (
                <>
                  <Typography
                    fontSize={14}
                    fontWeight="medium"
                    color={theme.palette.text.third}
                  >
                    Update Time
                  </Typography>
                </>
              )}
            </Grid>
            <Grid item xs={12} md={9} lg={10}>
              {loading ? (
                <Skeleton width="100%" height={30} />
              ) : (
                <Typography fontSize={14} color={theme.palette.text.third}>
                  {item.updateTime === null
                    ? "(No update)"
                    : dayjs(item.updateTime).format("LL")}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Divider />
        </Box>
      ))}
    </Box>
  );
};

export default MultiLanguages;
