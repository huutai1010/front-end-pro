import React from "react";
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  // MenuItem,
  // Select,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Controller, useFieldArray } from "react-hook-form";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { Add } from "@styled-icons/ionicons-outline";
import { Trash3 } from "@styled-icons/bootstrap";
import { CloudUpload } from "@styled-icons/material-outlined";
import BeaconLanguage from "./BeaconLanguage";
import { imageFileTypes } from "../../../constants/fileType";

const Beacon = ({
  language,
  loading,
  control,
  register,
  errors,
  getValues,
}) => {
  const theme = useTheme();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "placeItems",
  });

  const previewImage = (image) => {
    if (image instanceof File && imageFileTypes.includes(image.type)) {
      return URL.createObjectURL(image);
    }

    return image;
  };

  const addNewBeacon = () => {
    var arrLang = [];

    for (const desc of getValues("placeDescriptions")) {
      arrLang.push({
        languageCode: desc.languageCode,
        nameItem: "",
      });
    }
    append({
      name: "",
      beaconId: "",
      image: "",
      startTime: dayjs("2022-04-17T00:00"),
      endTime: dayjs("2022-04-17T00:00"),
      beaconMajorNumber: 1,
      beaconMinorNumber: 1,
      itemDescriptions: arrLang,
    });
  };

  return (
    <Box padding={5} marginX={10}>
      {loading ? (
        <Skeleton width="100%" />
      ) : (
        <Box
          marginTop={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {loading ? (
            <Skeleton width={200} />
          ) : (
            <Typography
              fontSize={14}
              fontWeight="medium"
              textTransform="uppercase"
              color={theme.palette.text.third}
            >
              Position Details of Place
            </Typography>
          )}

          {loading ? (
            <Skeleton width={200} />
          ) : (
            <Button onClick={addNewBeacon} sx={{ borderRadius: 2.5 }}>
              <Add width={20} />
              <Typography fontWeight="medium" fontSize={14}>
                Add New
              </Typography>
            </Button>
          )}
        </Box>
      )}
      {fields.map((item, index) => (
        <Box key={item.id} padding={1}>
          <Box display="flex" justifyContent="space-between">
            Position {index + 1}
            {loading ? (
              <Skeleton width={100} />
            ) : (
              <Button
                color="error"
                onClick={() => remove(index)}
                sx={{ marginLeft: 2 }}
              >
                <Trash3 width={20} />
              </Button>
            )}
          </Box>

          <Grid container spacing={2} marginBottom={2}>
            <Grid item sm={12} lg={6}>
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <>
                  <Typography marginLeft={1} color={theme.palette.text.third}>
                    Position Name{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    InputProps={{
                      style: {
                        borderRadius: 10,
                      },
                    }}
                    {...register(`placeItems.${index}.name`, {
                      validate: (value) => {
                        return (
                          value.trim() !== "" || "Position name is not empty!"
                        );
                      },
                      required: "Position name is required!",
                    })}
                    error={!!errors.placeItems?.[index]?.name}
                    helperText={errors.placeItems?.[index]?.name?.message}
                    placeholder="Type position name here"
                  />
                </>
              )}

              <Box display="flex" gap={2} marginTop={1}>
                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <Box width="100%">
                    <Typography marginLeft={1} color={theme.palette.text.third}>
                      Start Time{" "}
                      <small style={{ color: theme.palette.text.active }}>
                        *
                      </small>
                    </Typography>

                    <Controller
                      control={control}
                      name={`placeItems.${index}.startTime`}
                      rules={{
                        validate: (value) => {
                          return (
                            !dayjs(value).isSame(dayjs("2022-04-17T00:00")) ||
                            "Start time must be different from 00:00:00!"
                          );
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimeField
                            {...field}
                            fullWidth
                            size="small"
                            InputProps={{
                              style: {
                                borderRadius: 10,
                              },
                            }}
                            format="HH:mm:ss"
                            onChange={(newValue) => field.onChange(newValue)}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Box>
                )}

                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <Box width="100%">
                    <Typography marginLeft={1} color={theme.palette.text.third}>
                      End Time{" "}
                      <small style={{ color: theme.palette.text.active }}>
                        *
                      </small>
                    </Typography>

                    <Controller
                      control={control}
                      name={`placeItems.${index}.endTime`}
                      rules={{
                        validate: (value) => {
                          return (
                            (!dayjs(value).isSame(dayjs("2022-04-17T00:00")) &&
                              dayjs(value).isAfter(
                                dayjs(
                                  getValues(`placeItems.${index}.startTime`)
                                )
                              )) ||
                            "End time must be different from 00:00:00 and must be greater than start time!"
                          );
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimeField
                            {...field}
                            fullWidth
                            size="small"
                            InputProps={{
                              style: {
                                borderRadius: 10,
                              },
                            }}
                            format="HH:mm:ss"
                            onChange={(newValue) => field.onChange(newValue)}
                            error={!!error}
                            helperText={error?.message}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Box>
                )}
              </Box>

              {/* <Box display="flex" gap={2} marginTop={1}>
                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <Box width="100%">
                    <Typography marginLeft={1} color={theme.palette.text.third}>
                      Beacon Major
                    </Typography>

                    <Controller
                      control={control}
                      name={`placeItems.${index}.beaconMajorNumber`}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Select
                            {...field}
                            defaultValue={0}
                            fullWidth
                            size="small"
                            sx={{
                              borderRadius: 2.5,
                            }}
                            error={!!error}
                          >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
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
                  </Box>
                )}

                {loading ? (
                  <Skeleton width="100%" />
                ) : (
                  <Box width="100%">
                    <Typography marginLeft={1} color={theme.palette.text.third}>
                      Beacon Minor
                    </Typography>

                    <Controller
                      control={control}
                      name={`placeItems.${index}.beaconMinorNumber`}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Select
                            {...field}
                            defaultValue={0}
                            fullWidth
                            size="small"
                            sx={{
                              borderRadius: 2.5,
                            }}
                            error={!!error}
                          >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
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
                  </Box>
                )}
              </Box> */}

              <BeaconLanguage
                languageSelect={getValues("placeDescriptions")}
                languageList={language}
                beaconIndex={index}
                control={control}
                register={register}
                errors={errors}
              />
            </Grid>

            <Grid item sm={12} lg={6}>
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <>
                  <Typography marginLeft={1} color={theme.palette.text.third}>
                    Beacon Code{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    InputProps={{
                      style: {
                        borderRadius: 10,
                      },
                    }}
                    {...register(`placeItems.${index}.beaconId`, {
                      validate: (value) => {
                        return (
                          value.trim() !== "" || "Beacon Code is not empty!"
                        );
                      },
                      required: "Beacon Code is required!",
                    })}
                    error={!!errors.placeItems?.[index]?.beaconId}
                    helperText={errors.placeItems?.[index]?.beaconId?.message}
                    placeholder="Beacon code"
                  />
                </>
              )}
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                <Box marginTop={4}>
                  <Controller
                    name={`placeItems.${index}.image`}
                    control={control}
                    rules={{
                      required: "Image file is required!",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Button
                          fullWidth
                          color="gray"
                          variant="outlined"
                          component="label"
                          sx={{
                            borderRadius: 2.5,
                            height: 40,
                          }}
                          startIcon={<CloudUpload width={24} />}
                        >
                          {field.value ? field.value.name : "Upload Image"}
                          <input
                            type="file"
                            hidden
                            accept="image/jpeg, image/png"
                            onChange={(e) => field.onChange(e.target.files[0])}
                          />
                        </Button>
                        <FormHelperText error sx={{ marginLeft: 2 }}>
                          {error?.message}
                        </FormHelperText>
                        <Box
                          display="flex"
                          justifyContent="center"
                          marginTop={1}
                        >
                          <img
                            src={previewImage(field.value)}
                            alt={field.value.name}
                            style={{ height: 250, borderRadius: 2.5 }}
                          />
                        </Box>
                      </>
                    )}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          <Divider />
        </Box>
      ))}
    </Box>
  );
};

export default Beacon;
