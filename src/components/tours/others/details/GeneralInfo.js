import {
  Avatar,
  Box,
  Grid,
  Rating,
  Skeleton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React from "react";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import { labels } from "../../../../constants/rating";
import location from "../../../../constants/tables/location";
import CustomNoRowsOverlay from "../../../common/CustomNoRowsOverlay";

const GeneralInfo = ({ values, loading }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const onNavigate = (params) => {
    navigate("/places/details", { state: { placeId: params.row.id } });
  };

  return (
    <Box>
      <Grid container columnSpacing={5}>
        {/* Image */}
        <Grid item xs={12} lg={5}>
          {loading ? (
            <Skeleton width={150} />
          ) : (
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              Illustration Image
            </Typography>
          )}
          <Box padding={1} display="flex" justifyContent="center">
            {loading ? (
              <Skeleton variant="rounded" width="100%" height={200}>
                <Avatar />
              </Skeleton>
            ) : values?.image ? (
              <img
                src={values?.image}
                style={{ maxWidth: "100%", maxHeight: 350, borderRadius: 2.5 }}
                alt=""
              />
            ) : (
              <Box display="flex" justifyContent="center">
                <Typography fontSize={14} color={theme.palette.text.third}>
                  (No image)
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Informations */}
        <Grid item xs={12} lg={7}>
          {loading ? (
            <Skeleton width={150} />
          ) : (
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              General Information
            </Typography>
          )}
          <Box padding={2}>
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={200}
                  color={theme.palette.text.third}
                >
                  Itinerary Name{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Typography>{values?.name}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={200}
                  color={theme.palette.text.third}
                >
                  Price{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
                <Typography>
                  $
                  {values?.total
                    ?.toFixed(2)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                </Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={200}
                  color={theme.palette.text.third}
                >
                  Number of Places
                </Typography>
                <Typography>{values?.tourDetails?.length}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={200}
                  color={theme.palette.text.third}
                >
                  Number of Descriptions
                </Typography>
                <Typography>{values?.tourDescriptions?.length}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={200}
                  color={theme.palette.text.third}
                >
                  Number of Feedbacks
                </Typography>
                <Typography>{values?.feedBacks?.length}</Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={200}
                  color={theme.palette.text.third}
                >
                  Rating
                </Typography>
                <Rating
                  readOnly
                  size="small"
                  value={values?.rate || 0}
                  precision={0.5}
                  sx={{
                    ".MuiRating-icon": {
                      borderColor: theme.palette.text.active,
                    },
                    "& .MuiRating-iconFilled": {
                      color: theme.palette.text.active,
                    },
                  }}
                />
                <Typography marginLeft={1} fontSize={14}>
                  ({labels[values?.rate || 0]})
                </Typography>
              </Box>
            )}
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={200}
                  color={theme.palette.text.third}
                >
                  Status
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  paddingX={1}
                  bgcolor={alpha(
                    values.status
                      ? theme.palette.text.onStatus
                      : theme.palette.text.active,
                    0.2
                  )}
                  borderRadius={2.5}
                >
                  <Typography
                    fontWeight="medium"
                    fontSize={14}
                    textTransform="capitalize"
                    color={
                      values.status
                        ? theme.palette.text.onStatus
                        : theme.palette.text.active
                    }
                  >
                    {values.statusType}
                  </Typography>
                </Box>
              </Box>
            )}
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={200}
                  color={theme.palette.text.third}
                >
                  Create Time
                </Typography>
                <Typography fontSize={14}>
                  {dayjs(values?.createTime).format("MMMM DD, YYYY")}
                </Typography>
              </Box>
            )}

            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <Box display="flex" alignItems="center" marginBottom={1.5}>
                <Typography
                  fontSize={14}
                  fontWeight="medium"
                  width={200}
                  color={theme.palette.text.third}
                >
                  Update Time
                </Typography>
                <Typography fontSize={14}>
                  {values?.updateTime
                    ? dayjs(values?.updateTime).format("MMMM DD, YYYY")
                    : "--/--/--"}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Place */}
        <Grid item xs={12}>
          <Box marginTop={2}>
            {loading ? (
              <Skeleton width={150} />
            ) : (
              <Typography
                fontSize={14}
                letterSpacing={0.5}
                fontWeight="medium"
                textTransform="uppercase"
                color={theme.palette.text.third}
              >
                Place List
              </Typography>
            )}
            <Box padding={1} width="99.5%">
              {loading ? (
                <Skeleton width="100%" variant="rounded" height={100} />
              ) : (
                <DataGrid
                  disableColumnMenu
                  disableRowSelectionOnClick
                  columns={location}
                  rows={values?.tourDetails}
                  autoPageSize
                  pagination
                  slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                  onRowClick={(params) => {
                    window.scrollTo({ top: 0, left: 0 });
                    onNavigate(params);
                  }}
                  sx={{
                    border: 0,
                    minHeight: "54vh",
                    "& .MuiDataGrid-row:hover": {
                      cursor: "pointer",
                    },
                    "& .MuiDataGrid-cell:focus": {
                      outline: "none",
                    },
                    "--DataGrid-overlayHeight": "300px",
                  }}
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralInfo;
