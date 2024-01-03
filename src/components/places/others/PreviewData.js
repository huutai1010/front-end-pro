import { useTheme } from "@emotion/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  ImageList,
  ImageListItem,
  Divider,
  Typography,
  Tooltip,
  alpha,
} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { ExpandMore } from "styled-icons/material";
import { imageFileTypes } from "../../../constants/fileType";

import { StarFill } from "@styled-icons/bootstrap";
import DescriptionItem from "../../common/DescriptionItem";

const PreviewData = ({ data, getValues, language }) => {
  const theme = useTheme();

  const previewImage = (image) => {
    if (image instanceof File && imageFileTypes.includes(image.type)) {
      return URL.createObjectURL(image);
    }

    return image;
  };

  const getLanguage = (languagecode) => {
    const value = language.filter(
      (field) => field.languageCode === languagecode
    );
    return value;
  };

  return (
    <Box padding={5}>
      <Typography
        fontSize={14}
        fontWeight="medium"
        textTransform="uppercase"
        color={theme.palette.text.third}
      >
        General Infomation
      </Typography>
      <Box
        bgcolor={theme.palette.background.secondary}
        padding={2}
        marginTop={1}
        borderRadius={2.5}
      >
        <Grid container columnSpacing={1}>
          <Grid item sm={6} lg={2}>
            <Typography fontWeight="medium" color={theme.palette.text.third}>
              Place Name
            </Typography>
            <Tooltip title={data.name}>
              <Typography noWrap>{data.name}</Typography>
            </Tooltip>
          </Grid>

          <Grid item sm={6} lg={2}>
            <Typography fontWeight="medium" color={theme.palette.text.third}>
              Google Place IDs
            </Typography>
            <Tooltip title={data.googlePlaceId}>
              <Typography noWrap>
                {data.googlePlaceId ? data.googlePlaceId : "(No data)"}
              </Typography>
            </Tooltip>
          </Grid>

          <Grid item sm={6} lg={2}>
            <Typography fontWeight="medium" color={theme.palette.text.third}>
              Latitude
            </Typography>
            <Tooltip title={data.latitude}>
              <Typography noWrap>{data.latitude}</Typography>
            </Tooltip>
          </Grid>

          <Grid item sm={6} lg={2}>
            <Typography fontWeight="medium" color={theme.palette.text.third}>
              Longitude
            </Typography>
            <Tooltip title={data.longitude}>
              <Typography noWrap>{data.longitude}</Typography>
            </Tooltip>
          </Grid>

          <Grid item sm={10} lg={4}>
            <Typography fontWeight="medium" color={theme.palette.text.third}>
              Place Address
            </Typography>
            <Tooltip title={data.address}>
              <Typography noWrap>{data.address}</Typography>
            </Tooltip>
          </Grid>

          <Grid item sm={4} lg={2}>
            <Typography fontWeight="medium" color={theme.palette.text.third}>
              Duration
            </Typography>
            <Tooltip title={dayjs(data.hour).format("HH:mm:ss")}>
              <Typography>{dayjs(data.hour).format("HH:mm:ss")}</Typography>
            </Tooltip>
          </Grid>

          <Grid item sm={4} lg={2}>
            <Typography fontWeight="medium" color={theme.palette.text.third}>
              Price
            </Typography>
            <Tooltip
              title={data.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            >
              <Typography noWrap>
                {data.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Typography>
            </Tooltip>
          </Grid>

          <Grid item sm={4} lg={2}>
            <Typography fontWeight="medium" color={theme.palette.text.third}>
              Entry Ticket
            </Typography>
            <Tooltip
              title={data.entryTicket?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            >
              <Typography noWrap>
                {data.entryTicket?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item sm={12} lg={6}>
            <Typography fontWeight="medium" color={theme.palette.text.third}>
              Category
            </Typography>
            <Box display="flex" flexWrap="wrap" maxWidth={500}>
              {getValues("placeCategories").map((category) => (
                <Box
                  key={category.id}
                  borderRadius={10}
                  border={1}
                  borderColor={theme.palette.background.primary}
                  paddingX={0.85}
                  bgcolor={theme.palette.background.hovered}
                >
                  <Typography
                    color={theme.palette.text.second}
                    fontSize={14}
                    fontWeight="regular"
                  >
                    {category.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box marginTop={7}>
        <Typography
          fontSize={14}
          fontWeight="medium"
          textTransform="uppercase"
          color={theme.palette.text.third}
        >
          Place Descriptions ({getValues("placeDescriptions").length})
        </Typography>
        {getValues("placeDescriptions").map((item, index) => (
          <Accordion
            key={index}
            sx={{
              marginTop: 1,
              boxShadow: " rgba(0, 0, 0, 0.04) 0px 3px 5px;",
              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore width={24} />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                },
                bgcolor: theme.palette.background.primary,
              }}
            >
              <img
                src={getLanguage(item.languageCode)[0]?.icon}
                alt={item.languageCode}
                style={{
                  width: 25,
                  height: 17,
                  border: "1px solid #ccc",
                  marginRight: 5,
                }}
              />
              <Typography>{getLanguage(item.languageCode)[0]?.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" gap={2} marginBottom={2}>
                <Box minWidth={100}>
                  <Typography
                    width={100}
                    fontSize={14}
                    color={theme.palette.text.third}
                  >
                    Place Name:
                  </Typography>
                </Box>
                <Box>
                  <Typography>{item.name}</Typography>
                </Box>
              </Box>

              <Box display="flex" gap={2}>
                <Box minWidth={100}>
                  <Typography
                    width={100}
                    fontSize={14}
                    color={theme.palette.text.third}
                  >
                    Description:
                  </Typography>
                </Box>
                <Box>
                  <DescriptionItem {...item} />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Grid container spacing={5} marginTop={4}>
        <Grid item sm={12} lg={6}>
          <Typography
            fontSize={14}
            fontWeight="medium"
            textTransform="uppercase"
            color={theme.palette.text.third}
          >
            Images List
          </Typography>
          <ImageList
            variant="standard"
            cols={3}
            gap={2}
            sx={{ maxHeight: 500, marginTop: 1 }}
          >
            {data.placeImages.map((item, index) => (
              <ImageListItem key={index}>
                {item.isPrimary ? (
                  <Tooltip title={"Primary Image"}>
                    <Box
                      style={{
                        position: "absolute",
                        width: 25,
                        height: 25,
                        borderRadius: "10px 0 5px 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        left: 0,
                        top: 0,
                        backgroundColor: theme.palette.background.secondary,
                        color: theme.palette.text.pending,
                      }}
                    >
                      <StarFill width={18} />
                    </Box>
                  </Tooltip>
                ) : null}

                <img
                  src={previewImage(item.image)}
                  alt={index}
                  loading="lazy"
                  style={{
                    borderRadius: 10,
                    maxWidth: 300,
                    maxHeight: 200,
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
        <Grid item sm={12} lg={6}>
          <Typography
            fontSize={14}
            fontWeight="medium"
            textTransform="uppercase"
            color={theme.palette.text.third}
          >
            Position List
          </Typography>
          {getValues("placeItems").map((item, index) => (
            <Accordion
              key={index}
              sx={{
                marginTop: 1,
                boxShadow: " rgba(0, 0, 0, 0.04) 0px 3px 5px;",
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore width={24} />}
                sx={{
                  alignItems: "center",
                  bgcolor: theme.palette.background.primary,
                }}
              >
                <Typography textTransform="capitalize">{item.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box display="flex" alignItems="center">
                    <Box>
                      <Typography
                        width={120}
                        color={alpha(theme.palette.text.third, 0.75)}
                      >
                        Beacon Code:
                      </Typography>
                    </Box>
                    <Typography noWrap>{item.beaconId}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Box>
                      <Typography
                        width={120}
                        color={alpha(theme.palette.text.third, 0.75)}
                      >
                        Major Number:
                      </Typography>
                    </Box>
                    <Typography>{item.beaconMajorNumber}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Box>
                      <Typography
                        width={120}
                        color={alpha(theme.palette.text.third, 0.75)}
                      >
                        MinorNumber:
                      </Typography>
                    </Box>
                    <Typography>{item.beaconMinorNumber}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Box>
                      <Typography
                        width={120}
                        color={alpha(theme.palette.text.third, 0.75)}
                      >
                        Start Time:
                      </Typography>
                    </Box>
                    <Typography>
                      {dayjs(item.startTime).format("HH:mm:ss")}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Box>
                      <Typography
                        width={120}
                        color={alpha(theme.palette.text.third, 0.75)}
                      >
                        End Time:
                      </Typography>
                    </Box>
                    <Typography>
                      {dayjs(item.endTime).format("HH:mm:ss")}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ marginY: 2 }} />
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography color={alpha(theme.palette.text.third, 0.75)}>
                      Position Name By Language
                    </Typography>
                    {item.itemDescriptions.map((desc, id) => (
                      <Box key={id} display="flex" alignItems="center" gap={1}>
                        <img
                          src={getLanguage(desc.languageCode)[0]?.icon}
                          alt={desc.languageCode}
                          style={{
                            width: 20,
                            height: 12,
                            border: "1px solid #ccc",
                            marginRight: 5,
                          }}
                        />
                        <Typography
                          color={alpha(theme.palette.text.third, 0.75)}
                        >
                          :
                        </Typography>
                        <Typography
                          color={alpha(theme.palette.text.third, 0.75)}
                        >
                          {desc.nameItem}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box>
                    {item.image ? (
                      <img
                        src={previewImage(item.image)}
                        style={{ width: 120, height: 120, borderRadius: 10 }}
                        alt={item.name}
                      />
                    ) : (
                      <Box />
                    )}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

          <Box marginTop={5}>
            <Typography
              fontSize={14}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              Date Of Week
            </Typography>
            <Box padding={3}>
              {data.placeTimes.map((date, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  marginBottom={1.5}
                >
                  <Typography
                    width={150}
                    fontSize={16}
                    color={theme.palette.text.third}
                  >
                    {date.day}
                  </Typography>

                  <Typography>
                    {dayjs("2022-04-17T" + date.openTime).format("LT")}
                  </Typography>
                  <Typography>~</Typography>
                  <Typography>
                    {dayjs("2022-04-17T" + date.endTime).format("LT")}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PreviewData;
