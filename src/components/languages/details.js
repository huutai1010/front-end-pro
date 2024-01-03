import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import ErrorModal from "../common/ErrorModal";
import Header from "../common/Header";

import { getLanguageDetails, updateLanguage } from "./action";
import { PreviewLink } from "@styled-icons/fluentui-system-filled";
import { useForm } from "react-hook-form";
import { CloudCheckFill } from "@styled-icons/bootstrap";
import { CloudUploadOutline } from "@styled-icons/evaicons-outline";
import dayjs from "dayjs";

const LanguageDetails = () => {
  const theme = useTheme();
  const { state } = useLocation();
  const { languageId, languageCode } = state;
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [file, setFile] = useState();
  const [values, setValues] = useState({
    name: "",
    icon: "",
    languageCode: "",
  });
  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const form = useForm({
    defaultValues: { name: "", icon: "", languageCode: "" },
  });
  const { handleSubmit, setError, clearErrors, formState } = form;
  const { errors } = formState;

  useEffect(() => {
    async function getInfoDetails() {
      setLoading(true);
      try {
        const data = await getLanguageDetails(languageId);
        setValues(data);
        setLoading(false);
      } catch (error) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Can't get data details for language!",
          status: "error",
        });
        setLoading(false);
      }
    }
    getInfoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageId]);

  const handleChange = (event) => {
    const data = languageCode.filter(
      (language) => language.languageName === event.target.value
    );
    setValues({
      ...values,
      name: data[0].languageName,
      icon: data[0].icon,
      languageCode: data[0].nationalCode,
    });
  };

  const handleChangeFile = (event) => {
    clearErrors("fileType");
    setFile(event.target.files[0]);
  };

  const onSubmit = async () => {
    if (file instanceof File) {
      if (file.type !== "application/json") {
        return setError("fileType", {
          message: "Only JSON file are allowed!",
        });
      } else if (file.name?.split(".")[0] !== values.languageCode) {
        return setError("fileType", {
          message: "File name must same language code!",
        });
      }
    }

    const data = {
      name: values.name,
      icon: values.icon,
      languageCode: values.languageCode,
      fileLink: file || values.fileLink,
    };

    try {
      setUpdate(true);
      const res = await updateLanguage(languageId, data);
      if (res) {
        setUpdate(false);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Updated successfully!",
          status: "success",
        });
      }
    } catch (e) {
      setUpdate(false);
      console.log(e.response.data);

      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Something went wrong!",
        status: "error",
      });
    }
  };

  return (
    <Box
      margin="1.25em"
      padding={2}
      paddingBottom={10}
      bgcolor={theme.palette.background.primary}
      borderRadius={5}
      minHeight="94vh"
    >
      <ErrorModal
        open={notification.errorState}
        setOpen={setNotification}
        message={notification.errorMessage}
        status={notification.status}
      />
      <Header
        title={"Language Details"}
        subTitle={"Manage all information of language  or update them."}
        showBack={true}
        loading={loading}
      />

      <Box marginX={20} marginTop={5} padding={1}>
        <Grid container spacing={2}>
          {loading ? (
            <Skeleton width="100%" />
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <Typography fontWeight="medium">Language Name</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <FormControl fullWidth size="small">
                  <Select
                    sx={{ borderRadius: 2.5 }}
                    name="name"
                    fullWidth
                    disabled
                    value={values.name}
                    onChange={handleChange}
                  >
                    {languageCode.map((item, index) => (
                      <MenuItem key={index} value={item.languageName}>
                        <img
                          src={item.icon}
                          alt={item.nationalName}
                          style={{ width: 20, marginRight: 10 }}
                        />
                        {item.nationalName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {loading ? (
            <Skeleton width="100%" />
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <Typography fontWeight="medium">Language Code</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  size="small"
                  name="languageCode"
                  disabled
                  InputProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                  value={values && values.languageCode}
                />
              </Grid>
            </>
          )}

          {loading ? (
            <Skeleton width="100%" />
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <Typography fontWeight="medium">File Data</Typography>
              </Grid>
              <Grid item xs={11} md={7}>
                <Box
                  display="flex"
                  alignItems="center"
                  position="relative"
                  overflow="hidden"
                  width="100%"
                  border={1}
                  borderRadius={2.5}
                  borderColor={alpha(theme.palette.text.primary, 0.28)}
                  height={40}
                >
                  <label
                    htmlFor="file"
                    style={{
                      display: "flex",
                      color: theme.palette.text.third,
                      cursor: "pointer",
                    }}
                  >
                    {file ? (
                      <Box display="flex" alignItems="center">
                        <CloudCheckFill
                          height={24}
                          color={theme.palette.text.onStatus}
                          style={{ margin: 10 }}
                        />
                        <Typography noWrap>{file.name}</Typography>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center">
                        <CloudUploadOutline
                          height={24}
                          style={{ margin: 10 }}
                        />
                        <Typography noWrap>Click to import file...</Typography>
                      </Box>
                    )}

                    <input
                      id="file"
                      name="fileLink"
                      style={{
                        opacity: 0,
                        position: "absolute",
                      }}
                      disabled={update}
                      onChange={handleChangeFile}
                      type="file"
                      accept=".json"
                    />
                  </label>
                </Box>
                <FormHelperText
                  htmlFor="render-select"
                  error
                  style={{ marginLeft: 10 }}
                >
                  {errors.fileType?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={1} md={1}>
                <IconButton href={values.fileLink} target="_blank">
                  <Tooltip title="Preview Link">
                    <PreviewLink width={24} />
                  </Tooltip>
                </IconButton>
              </Grid>
            </>
          )}

          {/* Time */}
          {loading ? (
            <Skeleton width="100%" />
          ) : (
            <>
              <Grid item xs={12} md={4}>
                <Typography fontWeight="medium">Create/Update Time</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography fontWeight="regular">
                  {dayjs(values && values.createTime).format("lll")} /{" "}
                  {values && values.updateTime
                    ? dayjs(values && values.updateTime).format("lll")
                    : "(no data)"}
                </Typography>
              </Grid>
            </>
          )}

          {/* Status */}
          {loading ? (
            <Skeleton width="100%" />
          ) : (
            <>
              <Grid item xs={4}>
                <Typography fontWeight="medium">Status</Typography>
              </Grid>
              <Grid item xs={8}>
                {values.status === 0 ? (
                  <Typography
                    fontWeight="semiBold"
                    color={theme.palette.text.active}
                  >
                    Inactice
                  </Typography>
                ) : values.status === 1 ? (
                  <Typography
                    fontWeight="semiBold"
                    color={theme.palette.text.pending}
                  >
                    Preparing
                  </Typography>
                ) : values.status === 2 ? (
                  <Typography
                    fontWeight="semiBold"
                    color={theme.palette.text.onStatus}
                  >
                    Active
                  </Typography>
                ) : null}
              </Grid>
            </>
          )}
        </Grid>

        <Box display="flex" justifyContent="center">
          {loading ? (
            <Skeleton width={200} />
          ) : (
            <Button
              disabled={update}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              color="error"
              sx={{
                marginTop: 5,
                borderRadius: 2.5,
                height: 40,
                maxWidth: "fit-content",
              }}
            >
              Save Changes
            </Button>
          )}
        </Box>

        {loading ? (
          <Skeleton width={200} />
        ) : (
          <Box marginTop={2} color={theme.palette.text.third}>
            <Typography fontWeight="semiBold">Note</Typography>
            <ul style={{ marginLeft: 20 }}>
              <li style={{ fontSize: 14 }}>The file must be a json file.</li>
              <li style={{ fontSize: 14 }}>
                The file name must same language code.
              </li>
              <li style={{ fontSize: 14 }}>
                Get data template file{" "}
                <a href="/template.json" target="_blank" download>
                  here
                </a>
                .
              </li>
            </ul>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LanguageDetails;
