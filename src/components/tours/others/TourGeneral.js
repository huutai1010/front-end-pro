import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Controller, useFieldArray } from "react-hook-form";

import UploadImage from "../../common/UploadImage";

import { getLanguages } from "../../languages/action";

import { Add } from "@styled-icons/ionicons-outline";
import { Trash3 } from "@styled-icons/bootstrap";

const TourGeneral = ({
  values,
  setValues,
  loading,
  register,
  control,
  errors,
  getValues,
  notification,
  setNotification,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [languagesList, setLanguagesList] = useState([]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tourDescriptions",
  });

  useEffect(() => {
    async function fetchLanguage() {
      try {
        const response = await dispatch(getLanguages());
        setLanguagesList(response.languages.data);
      } catch (e) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Can't loading languages for selection!",
          status: "error",
        });
      }
    }
    fetchLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasDuplicate = () => {
    const formData = getValues();
    const languageCodes = new Set();
    for (const data of formData.tourDescriptions) {
      if (languageCodes.has(data.languageCode)) {
        return false;
      }
      languageCodes.add(data.languageCode);
    }

    return true;
  };

  return (
    <Box padding={5} marginX={10}>
      <Box>
        {loading ? (
          <Skeleton width={200} />
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
      </Box>

      <Grid container rowGap={2} padding={2}>
        {/* Tour Name */}
        <Grid item sm={12} lg={3}>
          {loading ? (
            <Skeleton width={100} />
          ) : (
            <Typography color={theme.palette.text.third}>
              Itinerary name default{" "}
              <small style={{ color: theme.palette.text.active }}>*</small>
            </Typography>
          )}
        </Grid>
        <Grid item sm={12} lg={9}>
          {loading ? (
            <Skeleton width="100%" />
          ) : (
            <TextField
              fullWidth
              size="small"
              value={values.name}
              {...register("name", {
                required: "Itinerary name is required!",
                validate: (value) => {
                  return value.trim() !== "" || "Itinerary name is not empty!";
                },
                onChange: (e) => setValues({ ...values, name: e.target.value }),
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                style: {
                  borderRadius: 10,
                },
              }}
              placeholder="Type itinerary name here"
            />
          )}
        </Grid>

        {/* Tour Image */}
        <Grid item sm={12} lg={3}>
          {loading ? (
            <Skeleton width={100} />
          ) : (
            <Typography color={theme.palette.text.third}>
              Illustration image{" "}
              <small style={{ color: theme.palette.text.active }}>*</small>
            </Typography>
          )}
        </Grid>
        <Grid item sm={12} lg={9}>
          {loading ? (
            <Skeleton width="100%" />
          ) : (
            <UploadImage
              values={values}
              setValues={setValues}
              errors={errors}
              register={register}
            />
          )}
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        {loading ? (
          <Skeleton width={300} />
        ) : (
          <Typography
            fontSize={14}
            letterSpacing={0.5}
            fontWeight="medium"
            textTransform="uppercase"
            color={theme.palette.text.third}
          >
            information with multiple languages
          </Typography>
        )}

        {fields.length < 4 ? (
          loading ? (
            <Skeleton width={100} />
          ) : (
            <Button
              onClick={() => {
                if (fields.length < languagesList.length) {
                  append({ languageCode: "en-us", name: "", description: "" });
                }
              }}
            >
              <Add width={20} />
              <Typography fontWeight="medium" fontSize={14}>
                Add More
              </Typography>
            </Button>
          )
        ) : null}
      </Box>

      {fields.map((item, index) => (
        <Box
          key={item.id}
          display="flex"
          justifyContent="center"
          width="100%"
          paddingX={2}
        >
          <Box>
            <Grid container rowGap={2} marginY={2}>
              <Grid item sm={12} lg={3}>
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  <Typography color={theme.palette.text.third}>
                    Choose Language{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                )}
              </Grid>
              <Grid item sm={12} lg={9}>
                {loading ? (
                  <Skeleton width={500} />
                ) : (
                  <Controller
                    control={control}
                    name={`tourDescriptions[${index}].languageCode`}
                    rules={{
                      validate: () => {
                        return (
                          hasDuplicate() ||
                          "There are duplicate language. Please check again!"
                        );
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Select
                          {...field}
                          defaultValue={""}
                          fullWidth
                          size="small"
                          sx={{
                            borderRadius: 2.5,
                          }}
                          error={!!error}
                        >
                          {languagesList.map((item) => (
                            <MenuItem key={item.id} value={item.languageCode}>
                              <img
                                src={item.icon}
                                alt={item.name}
                                style={{
                                  width: 16,
                                  border: "1px solid #ccc",
                                  marginRight: 10,
                                }}
                              />
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText
                          htmlFor="render-select"
                          error
                          sx={{ marginLeft: 2 }}
                        >
                          {error?.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                )}
              </Grid>

              <Grid item sm={12} lg={3}>
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  <Typography color={theme.palette.text.third}>
                    Itinerary Name{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                )}
              </Grid>
              <Grid item sm={12} lg={9}>
                {loading ? (
                  <Skeleton width={500} />
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    InputProps={{
                      style: {
                        borderRadius: 10,
                      },
                    }}
                    {...register(`tourDescriptions.${index}.name`, {
                      validate: (value) => {
                        return value.trim() !== "" || "Itinerary name is not empty!";
                      },
                      required: "Itinerary Name is required!",
                    })}
                    error={!!errors.tourDescriptions?.[index]?.name}
                    helperText={errors.tourDescriptions?.[index]?.name?.message}
                    placeholder="Type itinerary name here"
                  />
                )}
              </Grid>

              {/* Tour Decription */}
              <Grid item sm={12} lg={3}>
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  <>
                    <Typography color={theme.palette.text.third}>
                      Description{" "}
                      <small style={{ color: theme.palette.text.active }}>
                        *
                      </small>
                    </Typography>
                    <Typography color={theme.palette.text.third}>
                      <small>Write a short decription</small>
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item sm={12} lg={9}>
                {loading ? (
                  <Skeleton width={500} />
                ) : (
                  <TextField
                    fullWidth
                    rows={7}
                    multiline
                    size="small"
                    InputProps={{
                      style: {
                        borderRadius: 10,
                      },
                    }}
                    {...register(`tourDescriptions.${index}.description`, {
                      validate: (value) => {
                        return (
                          value.trim() !== "" || "Description is not empty!"
                        );
                      },
                      required: "Description is required!",
                    })}
                    error={!!errors.tourDescriptions?.[index]?.description}
                    helperText={
                      errors.tourDescriptions?.[index]?.description?.message
                    }
                    placeholder="Type description here"
                  />
                )}
              </Grid>
            </Grid>
            <Divider />
          </Box>
          {fields.length === 1 ? null : (
            <Button
              color="error"
              onClick={() => remove(index)}
              sx={{ marginLeft: 2 }}
            >
              <Trash3 width={20} />
            </Button>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default TourGeneral;
