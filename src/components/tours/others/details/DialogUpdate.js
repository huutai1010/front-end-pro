import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  FormHelperText,
  useTheme,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateTour } from "../../action";
import { CloudArrowUp } from "@styled-icons/fluentui-system-regular";
import { imageFileTypes } from "../../../../constants/fileType";
import PlacesList from "../PlacesList";
import { useDispatch } from "react-redux";
import { getPlaces } from "../../../places/action";

const DialogUpdate = ({
  dialog,
  setDialog,
  setValues,
  data,
  setData,
  getValues,
  update,
  setUpdate,
  notification,
  setNotification,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    totalCount: 0,
  });

  const [pageModelState, setPageModelState] = useState({
    page: 0,
    pageSize: 10,
  });

  const {
    handleSubmit,
    clearErrors,
    register,
    setError,
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    async function fetchData() {
      try {
        setPageState((old) => ({
          ...old,
          isLoading: true,
        }));
        const data = await dispatch(
          getPlaces({
            PageNumber: pageModelState.page,
            PageSize: pageModelState.pageSize,
            SearchBy: searchBy,
            Search: search,
          })
        );
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: data.places.data,
          totalCount: data.places.totalCount,
        }));
      } catch (error) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "There was a problem loading data!",
          status: "error",
        });
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchBy, pageModelState.page, pageModelState.pageSize]);

  const previewImage = (data) => {
    if (data instanceof File && imageFileTypes.includes(data.type)) {
      return URL.createObjectURL(data);
    }
    return data;
  };

  const onUpdate = async () => {
    let value = {
      name: data.name,
      image: data.image,
      total: data.total,
      tourDetails: [],
      tourDescriptions: data.tourDescriptions,
    };
    for (const place of data.tourDetails) {
      value.tourDetails.push({ id: place.id, price: place.price });
    }

    try {
      setUpdate(true);
      const res = await updateTour(data.id, value);
      if (res) {
        setValues(res.tour);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Updated itinerary successfully!",
          status: "success",
        });
        setUpdate(false);
        setDialog(false);
      }
    } catch (e) {
      console.log(e);

      setUpdate(false);
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Something went wrong with processing!",
        status: "error",
      });
    }
  };
  return (
    <Dialog
      open={dialog}
      fullWidth
      maxWidth="xl"
      onClose={() => setDialog(false)}
    >
      <DialogTitle>Update Itinerary Infomations</DialogTitle>

      <DialogContent sx={{ paddingX: 10 }}>
        <Typography
          fontSize={14}
          letterSpacing={0.5}
          fontWeight="medium"
          textTransform="uppercase"
          color={theme.palette.text.third}
        >
          Information
        </Typography>
        <Grid container padding={2} spacing={5}>
          <Grid item sm={12} lg={7}>
            <Box>
              <Box marginLeft={1}>
                <Typography width={200}>
                  Itinerary Name{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              </Box>
              <TextField
                fullWidth
                size="small"
                disabled={update}
                InputProps={{
                  style: {
                    borderRadius: 10,
                  },
                }}
                value={data.name}
                {...register("name", {
                  required: "Itinerary Name is required!",
                  validate: (value) => {
                    return (
                      value.trim() !== "" || "Itinerary name is not empty!"
                    );
                  },
                  onChange: (e) => setData({ ...data, name: e.target.value }),
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder={`Type itinerary name here`}
              />
            </Box>

            <Box marginTop={2}>
              <Box marginLeft={1}>
                <Typography width={200}>
                  Illustration Image{" "}
                  <small style={{ color: theme.palette.text.active }}>*</small>
                </Typography>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                border={1}
                borderRadius={2.5}
                borderColor={
                  errors.image
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
                  <Box
                    display="flex"
                    alignItems="center"
                    color={alpha(theme.palette.text.secondary, 0.4)}
                  >
                    <CloudArrowUp height={24} style={{ margin: 10 }} />
                    <Typography noWrap>
                      {data.image instanceof File
                        ? data.image.name
                        : "Click to change image..."}
                    </Typography>
                  </Box>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    disabled={update}
                    accept="image/jpeg, image/png"
                    style={{
                      opacity: 0,
                      position: "absolute",
                    }}
                    {...register("image", {
                      required: data.image ? false : "Image is required!",
                      validate: (value) => {
                        if (value.length === 1)
                          return (
                            imageFileTypes.includes(value[0].type) ||
                            "Images must be in PNG or JPG format!"
                          );
                      },
                      onChange: (e) => {
                        setData({ ...data, image: e.target.files[0] });
                      },
                    })}
                  />
                </label>
              </Box>
              <FormHelperText
                htmlFor="render-select"
                error
                sx={{ marginLeft: 2 }}
              >
                {errors.image?.message}
              </FormHelperText>
            </Box>
          </Grid>

          <Grid item sm={12} lg={5} display="flex" justifyContent="center">
            <img
              src={previewImage(data.image)}
              style={{
                borderRadius: 10,
                maxWidth: "100%",
                maxHeight: 300,
              }}
              alt=""
            />
          </Grid>
        </Grid>

        <Typography
          fontSize={14}
          letterSpacing={0.5}
          fontWeight="medium"
          textTransform="uppercase"
          color={theme.palette.text.third}
        >
          Place List
        </Typography>
        <Box>
          <PlacesList
            values={data}
            setValues={setData}
            errors={errors}
            setError={setError}
            clearErrors={clearErrors}
            setSearch={setSearch}
            setSearchBy={setSearchBy}
            pageState={pageState}
            setPageState={setPageState}
            pageModelState={pageModelState}
            setPageModelState={setPageModelState}
            notification={notification}
            setNotification={setNotification}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 3 }}>
        <Button
          variant="outlined"
          onClick={handleSubmit(onUpdate)}
          disabled={update}
          autoFocus
        >
          Update
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={update}
          onClick={() => setDialog(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogUpdate;
