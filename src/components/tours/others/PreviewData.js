import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ExpandMore } from "styled-icons/material";

import { getAllLanguages } from "../../languages/action";
import DescriptionItem from "../../common/DescriptionItem";

const PreviewData = ({ data, descriptionList }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [languagesList, setLanguagesList] = useState([]);

  useEffect(() => {
    async function fetchLanguage() {
      try {
        const response = await dispatch(getAllLanguages());
        setLanguagesList(response.languages);
      } catch (e) {
        console.log(e);
      }
    }
    fetchLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preview = (data) => {
    return languagesList.filter((language) => language.languageCode === data);
  };
  return (
    <Box width="100%" paddingX={3} marginTop={3} marginBottom={5}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Box>
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              textTransform="uppercase"
              fontWeight="medium"
              color={theme.palette.text.third}
            >
              General Informations
            </Typography>
          </Box>

          <Box marginLeft={2} marginTop={2}>
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Typography
                width={150}
                fontSize={14}
                color={theme.palette.text.third}
              >
                Itinerary Name:{" "}
              </Typography>
              <Typography marginLeft={1} fontWeight="medium">
                {data?.name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Typography
                width={150}
                fontSize={14}
                color={theme.palette.text.third}
              >
                Number of Places:{" "}
              </Typography>
              <Typography marginLeft={1} fontWeight="medium">
                {data?.tourDetails?.length}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Typography
                width={150}
                fontSize={14}
                color={theme.palette.text.third}
              >
                Price:{" "}
              </Typography>
              <Typography marginLeft={1} fontWeight="medium">
                ${" "}
                {data?.total
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
              </Typography>
            </Box>
            <Box marginBottom={1}>
              <Typography
                marginBottom={1}
                fontSize={14}
                color={theme.palette.text.third}
              >
                Illustration Image:{" "}
              </Typography>
              <Box display="flex" justifyContent="center">
                {data?.image ? (
                  <img
                    src={data.image && URL.createObjectURL(data.image)}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 300,
                      marginLeft: 2,
                      borderRadius: 10,
                    }}
                    alt={data?.name}
                  />
                ) : (
                  <Typography marginLeft={1} fontWeight="medium">
                    (No Image)
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box marginTop={2}>
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              textTransform="uppercase"
              fontWeight="medium"
              color={theme.palette.text.third}
            >
              Descriptions List
            </Typography>
          </Box>

          <Box marginTop={2}>
            {descriptionList?.map((item, index) => (
              <Accordion
                key={index}
                sx={{
                  boxShadow: " rgba(0, 0, 0, 0.04) 0px 3px 5px;",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore width={24} />}
                  sx={{
                    ".MuiAccordionSummary-content": {
                      alignItems: "center",
                    },
                  }}
                >
                  <img
                    src={preview(item.languageCode)[0]?.icon}
                    alt={preview(item.languageCode)[0]?.name}
                    style={{
                      width: 20,
                      border: "1px solid #ccc",
                      marginRight: 10,
                    }}
                  />
                  <Typography>{preview(item.languageCode)[0]?.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" gap={2} marginBottom={2}>
                    <Box minWidth={100}>
                      <Typography
                        width={100}
                        fontSize={14}
                        color={theme.palette.text.third}
                      >
                        Itinerary Name:
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
        </Grid>

        <Grid item xs={12} md={5}>
          <Box>
            <Typography
              fontSize={14}
              letterSpacing={0.5}
              textTransform="uppercase"
              fontWeight="medium"
              color={theme.palette.text.third}
            >
              Place list
            </Typography>
          </Box>

          <Box marginTop={2}>
            {data.tourDetails?.map((place) => (
              <Box
                key={place.id}
                border={1}
                bgcolor={alpha(theme.palette.background.secondary, 0.5)}
                paddingX={2}
                paddingY={1}
                borderRadius={2}
                borderColor={alpha(theme.palette.text.third, 0.2)}
                marginTop={2}
              >
                <Typography fontWeight="medium">{place.name}</Typography>
                <Grid container color={theme.palette.text.third} padding={1}>
                  <Grid item xs={4} textAlign="left">
                    <Typography fontSize={14} noWrap>
                      Price
                    </Typography>
                    <Typography fontSize={14} noWrap>
                      ${" "}
                      {place.price
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="center">
                    <Typography fontSize={14} noWrap>
                      Duration
                    </Typography>
                    <Typography fontSize={14} noWrap>
                      {place.duration
                        .toFixed(1)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                      hours
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography fontSize={14} noWrap>
                      Category
                    </Typography>
                    <Typography fontSize={14} noWrap textTransform="capitalize">
                      {place.category}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PreviewData;
