import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  alpha,
  useTheme,
  Autocomplete,
  FormHelperText,
  ImageList,
  ImageListItem,
  IconButton,
  Skeleton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller } from "react-hook-form";

import { getCategoriesAll } from "../../categories/action";
import { NumericFormatCustom } from "../../common/NumericFormatCustom";
import { imageFileTypes } from "../../../constants/fileType";

import { CloudArrowUp } from "@styled-icons/fluentui-system-regular";
import { ImageAdd } from "@styled-icons/remix-line";
import { CloseOutline } from "@styled-icons/evaicons-outline";
import {
  CloudCheckmark,
  CloudDismiss,
} from "@styled-icons/fluentui-system-filled";
import dayjs from "dayjs";

const PlaceGeneral = ({
  values,
  setValues,
  loading,
  setLoading,
  control,
  getValues,
  errors,
  register,
  setError,
  clearErrors,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [imagesList, setImagesList] = useState(values?.placeImages);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    async function fetchLanguage() {
      try {
        const response = await dispatch(getCategoriesAll());
        setCategoriesList(response.categories);
        await setLoading(false);
      } catch (error) {}
    }
    fetchLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (imagesList.length !== 0) {
      imagesList.forEach((item) => {
        if (item.image instanceof File) {
          if (item.image && !imageFileTypes.includes(item.image.type)) {
            setError("placeImages", {
              message: "Please choose image file!",
            });
          } else {
            setValues({ ...values, placeImages: imagesList });
          }
        } else if (item.image.trim() === "") {
          setError("placeImages", {
            message: "Please choose image file!",
          });
        }
      });
    } else {
      setError("placeImages", {
        message: "Image is required!",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesList]);

  const handleChangeOtherImages = (event) => {
    const selectedImageFiles = Array.from(event.target.files);
    const newImagesList = selectedImageFiles.map((file) => {
      return { image: file, isPrimary: false };
    });
    setImagesList((preImagesList) => preImagesList.concat(newImagesList));
  };

  const handleChangePrimaryImage = (e) => {
    clearErrors("placeImages");
    const primaryIndex = imagesList.findIndex(
      (placeImage) => placeImage.isPrimary === true
    );

    if (primaryIndex === -1) {
      setImagesList([
        ...imagesList,
        {
          image: e.target.files[0],
          isPrimary: true,
        },
      ]);
    } else {
      const data = [...imagesList];
      data[primaryIndex].image = e.target.files[0];
      setImagesList(data);
    }
  };

  const removeImage = (index) => {
    const newImagesList = imagesList.filter(
      (image) => image.isPrimary === false
    );
    newImagesList.splice(index, 1);
    const mergeList = imagesList
      .filter((image) => image.isPrimary === true)
      .concat(newImagesList);

    setImagesList(mergeList);
  };

  const previewImage = (image) => {
    if (image instanceof File && imageFileTypes.includes(image.type)) {
      return URL.createObjectURL(image);
    }

    return image;
  };

  const isPrimaryImage = () => {
    const data = imagesList.filter((item) => item.isPrimary === true);
    return data;
  };

  return (
    <Box padding={5} marginX={10}>
      <Grid container rowGap={2}>
        {/* Place Name */}
        {loading ? (
          <Skeleton width="100%" />
        ) : (
          <>
            <Grid item xs={12} lg={4}>
              <Typography color={theme.palette.text.third}>
                Place Name{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <TextField
                fullWidth
                size="small"
                InputProps={{
                  style: {
                    borderRadius: 10,
                  },
                }}
                value={values.name}
                {...register("name", {
                  required: "Place Name is required!",
                  validate: (value) => {
                    return value.trim() !== "" || "Place name is not empty!";
                  },
                  onChange: (e) =>
                    setValues({ ...values, name: e.target.value }),
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder={`Type place name here`}
              />
            </Grid>
          </>
        )}

        {/* Category */}
        {loading ? (
          <Skeleton width="100%" />
        ) : (
          <>
            <Grid item xs={12} lg={4}>
              <Typography color={theme.palette.text.third}>
                Category{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Controller
                name="placeCategories"
                control={control}
                rules={{ required: "Please select an option!" }}
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    multiple
                    size="small"
                    sx={{
                      ".MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                      },
                    }}
                    {...field}
                    filterSelectedOptions
                    options={categoriesList}
                    isOptionEqualToValue={(option, value) =>
                      option.name === value.name
                    }
                    getOptionLabel={(option) => option.name}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={
                          getValues("placeCategories").length === 0
                            ? "Select one or more categories"
                            : ""
                        }
                        error={!!errors.placeCategories}
                        helperText={
                          errors.placeCategories
                            ? errors.placeCategories.message
                            : null
                        }
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </>
        )}

        {/* Price */}
        {loading ? (
          <Skeleton width="100%" />
        ) : (
          <>
            <Grid item xs={12} lg={4}>
              <Typography color={theme.palette.text.third}>
                Price{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <TextField
                fullWidth
                size="small"
                value={values.price}
                {...register("price", {
                  required: "Price is required!",
                  validate: (value) => {
                    return Number(value) !== 0 || "Price greater than 0!";
                  },
                  onChange: (e) =>
                    setValues({ ...values, price: Number(e.target.value) }),
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
                InputProps={{
                  style: {
                    borderRadius: 10,
                  },
                  inputComponent: NumericFormatCustom,
                }}
                placeholder="Price of place"
              />
            </Grid>
          </>
        )}

        {/* Entry Ticket */}
        {loading ? (
          <Skeleton width="100%" />
        ) : (
          <>
            <Grid item xs={12} lg={4}>
              <Typography color={theme.palette.text.third}>
                Entry Ticket{" "}
                <small
                  style={{ fontSize: 12, color: theme.palette.text.active }}
                >
                  (if have)
                </small>
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <TextField
                fullWidth
                size="small"
                value={values.entryTicket}
                onChange={(e) =>
                  setValues({ ...values, entryTicket: Number(e.target.value) })
                }
                InputProps={{
                  style: {
                    borderRadius: 10,
                  },
                  inputComponent: NumericFormatCustom,
                }}
                placeholder="Entry ticket of place"
              />
            </Grid>
          </>
        )}

        {/* Duration */}
        {loading ? (
          <Skeleton width="100%" />
        ) : (
          <>
            <Grid item xs={12} lg={4}>
              <Typography color={theme.palette.text.third}>
                Duration{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
              <Typography fontSize={12} color={theme.palette.text.third}>
                Estimated place completion time.
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Controller
                control={control}
                name="hour"
                rules={{
                  validate: (value) => {
                    return (
                      (!dayjs(value).isSame(dayjs("2022-04-17T00:00")) &&
                        dayjs(value).isValid() &&
                        value !== null) ||
                      "Duration is required!"
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
                      onChange={(newValue) => {
                        field.onChange(newValue);
                        setValues({ ...values, hour: newValue });
                      }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
          </>
        )}

        {/* Primary Image */}
        {loading ? (
          <Skeleton width="100%" />
        ) : (
          <>
            <Grid item xs={12} lg={4}>
              <Typography color={theme.palette.text.third}>
                Primary Image{" "}
                <small style={{ color: theme.palette.text.active }}>*</small>
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Box
                display="flex"
                alignItems="center"
                border={1}
                borderRadius={2.5}
                borderColor={
                  errors.placeImages
                    ? theme.palette.text.active
                    : alpha(theme.palette.text.primary, 0.28)
                }
                height={40}
              >
                <label
                  htmlFor="image"
                  style={{
                    display: "flex",
                    width: "100%",
                    color: theme.palette.text.third,
                    cursor: "pointer",
                  }}
                >
                  {isPrimaryImage().length !== 0 &&
                  isPrimaryImage()[0]?.image !== undefined ? (
                    <Box display="flex" alignItems="center">
                      {errors.placeImages ? (
                        <CloudDismiss
                          height={24}
                          color={theme.palette.text.active}
                          style={{ margin: 10 }}
                        />
                      ) : (
                        <CloudCheckmark
                          height={24}
                          color={theme.palette.text.onStatus}
                          style={{ margin: 10 }}
                        />
                      )}
                      <Typography noWrap>
                        {
                          imagesList.filter(
                            (item) => item.isPrimary === true
                          )[0]?.image?.name || "Primary image is uploading..."
                        }
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      color={alpha(theme.palette.text.secondary, 0.4)}
                    >
                      <CloudArrowUp height={24} style={{ margin: 10 }} />
                      <Typography noWrap>Import primary image here</Typography>
                    </Box>
                  )}

                  <input
                    id="image"
                    style={{
                      opacity: 0,
                      position: "absolute",
                    }}
                    onChange={handleChangePrimaryImage}
                    type="file"
                    accept="image/jpeg, image/png"
                  />
                </label>
              </Box>
              <FormHelperText
                htmlFor="render-select"
                error
                sx={{ marginLeft: 2 }}
              >
                {errors.placeImages?.message}
              </FormHelperText>

              {isPrimaryImage().length !== 0 &&
              isPrimaryImage()[0]?.image !== undefined ? (
                <Box marginTop={2}>
                  <img
                    src={previewImage(isPrimaryImage()[0]?.image)}
                    style={{
                      borderRadius: 10,
                      maxWidth: "100%",
                      maxHeight: 300,
                    }}
                    alt=""
                  />
                </Box>
              ) : null}
            </Grid>
          </>
        )}

        {/* Other Images */}
        {loading ? (
          <Skeleton width="100%" />
        ) : (
          <>
            <Grid item xs={12} lg={4}>
              <Typography color={theme.palette.text.third}>
                Other Images
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Box
                display="flex"
                alignItems="center"
                border={1}
                borderRadius={2.5}
                borderColor={alpha(theme.palette.text.primary, 0.28)}
                height={40}
              >
                <label
                  htmlFor="imageList"
                  style={{
                    display: "flex",
                    width: "100%",
                    color: theme.palette.text.third,
                    cursor: "pointer",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    color={alpha(theme.palette.text.secondary, 0.4)}
                  >
                    <ImageAdd width={20} style={{ margin: 10 }} />
                    <Typography noWrap>
                      {imagesList.filter((image) => image.isPrimary === false)
                        .length !== 0
                        ? `Have ${
                            imagesList.filter(
                              (image) => image.isPrimary === false
                            ).length
                          } image files`
                        : "Import more images here..."}
                    </Typography>
                  </Box>

                  <input
                    id="imageList"
                    style={{
                      opacity: 0,
                      position: "absolute",
                    }}
                    multiple
                    onChange={handleChangeOtherImages}
                    type="file"
                    accept="image/*"
                  />
                </label>
              </Box>

              <ImageList
                variant="standard"
                cols={3}
                gap={2}
                sx={{ maxHeight: 500, marginTop: 2 }}
              >
                {imagesList &&
                  imagesList
                    .filter((image) => image.isPrimary === false)
                    .map((item, index) => (
                      <ImageListItem key={index}>
                        <IconButton
                          style={{
                            position: "absolute",
                            right: 2,
                            top: 2,
                            color: theme.palette.text.active,
                          }}
                          onClick={(e) => removeImage(index)}
                        >
                          <CloseOutline width={24} />
                        </IconButton>
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
          </>
        )}
      </Grid>
    </Box>
  );
};

export default PlaceGeneral;
