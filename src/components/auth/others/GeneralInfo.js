import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { updateProfile } from "../action";
import { getStaffDetails } from "../../staffs/action";
import { getLanguageCode } from "../../languages/action";

const GeneralInfo = ({
  loading,
  setLoading,
  update,
  setUpdate,
  notification,
  setNotification,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.profile);

  const [values, setValues] = useState({});
  const [languageCode, setLanguageCode] = useState([]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        setValues(await getStaffDetails(profile.id));
        const res = await getLanguageCode();
        setLanguageCode(res);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const previewImage = (data) => {
    if (data instanceof File) {
      return URL.createObjectURL(data);
    }
    return data;
  };
  const onSubmit = async () => {
    setUpdate(true);
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      nationalCode: values.nationalCode,
      address: values.address,
      gender: values.gender,
      image: values.image,
    };

    try {
      const response = await dispatch(updateProfile(data));
      if (response) {
        setUpdate(false);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Update profile successfully!",
          status: "success",
        });
      }
    } catch (e) {
      setUpdate(false);
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Update profile failed!",
        status: "error",
      });
    }
  };

  return (
    <>
      <Box flexGrow={1} style={{ display: "flex" }}>
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          padding={2}
          gap={2}
        >
          {loading ? (
            <Skeleton width={200} height={200} />
          ) : (
            <Avatar
              sx={{
                width: 200,
                height: 200,
                border: 5,
                borderRadius: 5,
                borderColor: theme.palette.background.secondary,
              }}
              src={previewImage(values.image)}
            />
          )}
          {loading ? (
            <Skeleton width={100} />
          ) : (
            <Button
              disabled={update}
              variant="outlined"
              color="error"
              component="label"
              sx={{ borderRadius: 2.5 }}
            >
              <input
                hidden
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setValues({
                    ...values,
                    [e.target.name]: e.target.files[0],
                  })
                }
              />
              Change Image
            </Button>
          )}
        </Box>
        <Grid flexGrow={2} container paddingX={4} spacing={2}>
          <Grid item xs={12} md={6}>
            {loading ? (
              <Skeleton width={200} />
            ) : (
              <>
                <Box marginLeft={1}>
                  <Typography
                    color={theme.palette.text.third}
                    fontWeight="medium"
                  >
                    Username
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                      backgroundColor: alpha(
                        theme.palette.background.secondary,
                        0.5
                      ),
                    },
                  }}
                  value={values.email?.slice(0, values.email?.indexOf("@"))}
                  disabled
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {loading ? (
              <Skeleton width={200} />
            ) : (
              <>
                <Box marginLeft={1}>
                  <Typography
                    color={theme.palette.text.third}
                    fontWeight="medium"
                  >
                    Email
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  InputProps={{
                    style: {
                      borderRadius: 10,
                      backgroundColor: alpha(
                        theme.palette.background.secondary,
                        0.5
                      ),
                    },
                  }}
                  value={values.email}
                  disabled
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {loading ? (
              <Skeleton width={200} />
            ) : (
              <>
                <Box marginLeft={1}>
                  <Typography
                    color={theme.palette.text.third}
                    fontWeight="medium"
                  >
                    First Name{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  name="firstName"
                  disabled={update}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  {...register("firstName", {
                    validate: (value, formValues) => value.trim() !== "",
                    required: "First Name is required!",
                  })}
                  value={values.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {loading ? (
              <Skeleton width={200} />
            ) : (
              <>
                <Box marginLeft={1}>
                  <Typography
                    color={theme.palette.text.third}
                    fontWeight="medium"
                  >
                    Last Name{" "}
                    <small style={{ color: theme.palette.text.active }}>
                      *
                    </small>
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  name="lastName"
                  disabled={update}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  {...register("lastName", {
                    validate: (value, formValues) => value.trim() !== "",
                    required: "Last Name is required!",
                  })}
                  value={values.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {loading ? (
              <Skeleton width={200} />
            ) : (
              <>
                <Box marginLeft={1}>
                  <Typography
                    color={theme.palette.text.third}
                    fontWeight="medium"
                  >
                    Nationality
                  </Typography>
                </Box>
                <FormControl fullWidth size="small" noValidate>
                  <Select
                    sx={{ borderRadius: 2.5 }}
                    name="nationalCode"
                    value={values.nationalCode}
                    disabled={update}
                    onChange={handleChange}
                  >
                    {languageCode.map((item, index) => (
                      <MenuItem key={index} value={item.nationalCode}>
                        <img
                          src={item.icon}
                          alt={item.nationalName}
                          style={{ width: 20, height: 12, marginRight: 10 }}
                        />
                        {item.nationalName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {loading ? (
              <Skeleton width={200} />
            ) : (
              <>
                <Box marginLeft={1}>
                  <Typography
                    color={theme.palette.text.third}
                    fontWeight="medium"
                  >
                    Gender
                  </Typography>
                </Box>
                <FormControl fullWidth size="small" noValidate>
                  <Select
                    sx={{ borderRadius: 2.5 }}
                    name="gender"
                    defaultValue=""
                    disabled={update}
                    onChange={handleChange}
                    value={values.gender}
                  >
                    <MenuItem value={"Male"}> Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                    <MenuItem value={"Other"}>Other</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <>
                <Box marginLeft={1}>
                  <Typography
                    color={theme.palette.text.third}
                    fontWeight="medium"
                  >
                    Phone
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  value={values.phone}
                  InputProps={{
                    style: {
                      borderRadius: 10,
                      backgroundColor: alpha(
                        theme.palette.background.secondary,
                        0.5
                      ),
                    },
                  }}
                  disabled
                />
              </>
            )}
          </Grid>
          <Grid item xs={12}>
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <>
                <Box marginLeft={1}>
                  <Typography
                    color={theme.palette.text.third}
                    fontWeight="medium"
                  >
                    Address
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  name="address"
                  disabled={update}
                  InputProps={{ style: { borderRadius: 10 } }}
                  value={values.address}
                  onChange={handleChange}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="center" marginTop={5}>
        {loading ? (
          <Skeleton width={100} />
        ) : (
          <Button
            variant="contained"
            disabled={update}
            color="error"
            sx={{ borderRadius: 2.5 }}
            onClick={handleSubmit(onSubmit)}
          >
            Save Change
          </Button>
        )}
      </Box>
    </>
  );
};

export default GeneralInfo;
