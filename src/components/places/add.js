import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  Skeleton,
  useTheme,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

import ErrorModal from "../common/ErrorModal";
import Header from "../common/Header";
import PlaceGeneral from "./others/PlaceGeneral";
import MultiLanguages from "./others/MultiLanguages";
import Coordinates from "./others/Coordinates";
import PreviewData from "./others/PreviewData";
import Beacon from "./others/Beacon";

import { processPlace } from "./action";
import { getLanguages } from "../languages/action";

import date from "../../constants/date";

const steps = [
  "General Information",
  "Multi-Language",
  "Positions",
  "Coordinate",
  "Confirmation",
];

const initialState = {
  name: "",
  address: "",
  longitude: undefined,
  latitude: undefined,
  googlePlaceId: "",
  entryTicket: undefined,
  hour: dayjs("2022-04-17T00:00"),
  price: undefined,
  placeCategories: [],
  placeImages: [],
  placeDescriptions: [],
  placeTimes: date,
  placeItems: [],
};

const AddPlace = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [values, setValues] = useState(initialState);
  const [languagesList, setLanguagesList] = useState([]);

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    register,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      hour: dayjs("2022-04-17T00:00"),
      address: "",
      longitude: undefined,
      latitude: undefined,
      price: undefined,
      placeCategories: [],
      placeDescriptions: [
        { languageCode: "en-us", name: "", description: "", voiceFile: null },
      ],
      placeImages: [],
      placeItems: [],
    },
  });

  useEffect(() => {
    async function fetchLanguage() {
      setLoading(true);
      try {
        const response = await dispatch(getLanguages());
        setLanguagesList(response.languages.data);
        await setLoading(false);
      } catch (e) {
        await setLoading(false);
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

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PlaceGeneral
            values={values}
            setValues={setValues}
            loading={loading}
            setLoading={setLoading}
            control={control}
            getValues={getValues}
            errors={errors}
            register={register}
            setError={setError}
            clearErrors={clearErrors}
          />
        );
      case 1:
        return (
          <MultiLanguages
            language={languagesList}
            loading={loading}
            register={register}
            control={control}
            getValues={getValues}
            errors={errors}
          />
        );
      case 2:
        return (
          <Beacon
            language={languagesList}
            loading={loading}
            register={register}
            control={control}
            errors={errors}
            getValues={getValues}
          />
        );
      case 3:
        return (
          <Coordinates
            values={values}
            setValues={setValues}
            setValue={setValue}
            errors={errors}
            register={register}
          />
        );

      case 4:
        return (
          <PreviewData
            data={values}
            getValues={getValues}
            language={languagesList}
          />
        );
      default:
        return;
    }
  };

  const onSubmit = async () => {
    let dataCreate = {
      name: values.name,
      longitude: values.longitude,
      latitude: values.latitude,
      address: values.address,
      hour: dayjs(values.hour).format("HH:mm:ss"),
      googlePlaceId: values.googlePlaceId,
      price: values.price,
      entryTicket: values.entryTicket ? values.entryTicket : 0,
      placeImages: values.placeImages,
      placeCategories: [],
      placeDescriptions: [],
      placeTimes: [],
      placeItems: [],
    };

    for (const cate of getValues("placeCategories")) {
      dataCreate.placeCategories.push({ id: cate.id });
    }
    for (const desc of getValues("placeDescriptions")) {
      dataCreate.placeDescriptions.push({
        languageCode: desc.languageCode,
        voiceFile: desc.voiceFile.name,
        name: desc.name,
        description: desc.description,
      });
    }

    for (const beacon of getValues("placeItems")) {
      dataCreate.placeItems.push({
        name: beacon.name,
        beaconId: beacon.beaconId,
        image: beacon.image,
        startTime: dayjs(beacon.startTime).format("HH:mm:ss"),
        endTime: dayjs(beacon.endTime).format("HH:mm:ss"),
        beaconMajorNumber: beacon.beaconMajorNumber,
        beaconMinorNumber: beacon.beaconMinorNumber,
        itemDescriptions: beacon.itemDescriptions,
      });
    }

    for (const time of values.placeTimes) {
      dataCreate.placeTimes.push({
        daysOfWeek: time.id,
        openTime: time.openTime,
        endTime: time.endTime,
      });
    }

    try {
      setCreate(true);
      await dispatch(processPlace(dataCreate, getValues("placeDescriptions")));
      setCreate(false);

      navigate("/places", {
        state: {
          errorState: true,
          errorMessage: "Created Place Successfully!",
          status: "success",
        },
      });
    } catch (e) {
      console.log(e);
      if (e?.response?.status === 500) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage:
            "The system encountered a problem while creating a new place!",
          status: "error",
        });
      } else {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: e?.response?.data?.message || "Create place failed!",
          status: "error",
        });
      }

      setCreate(false);
    }
  };
  return (
    <Box
      minHeight="94vh"
      margin="1.25em"
      padding={2}
      bgcolor={theme.palette.background.primary}
      borderRadius={5}
    >
      <ErrorModal
        open={notification.errorState}
        setOpen={setNotification}
        message={notification.errorMessage}
        status={notification.status}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={create}
      >
        <CircularProgress color="error" />
      </Backdrop>

      <Header
        title={"Create New Place"}
        subTitle={"New Place - New Discovery - New Insight"}
        loading={loading}
      />

      <Box marginTop={5} padding={1} marginX={2}>
        {loading ? (
          <Skeleton width="100%" />
        ) : (
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                borderColor: theme.palette.background.hovered,
              },
              "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                borderColor: theme.palette.background.hovered,
              },
            }}
          >
            {steps.map((label, index) => {
              const stepProps = {};

              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step
                  key={label}
                  sx={{
                    "& .MuiStepLabel-root .Mui-completed": {
                      color: theme.palette.background.hovered,
                    },
                    "& .MuiStepLabel-root .Mui-active": {
                      color: theme.palette.background.hovered,
                      bgColor: theme.palette.background.hovered,
                    },
                    "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
                      fontSize: "1rem",
                      fontWeight: "regular",
                    },
                    "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                      {
                        fontWeight: "medium",
                      },
                    "& .MuiSvgIcon-root": {
                      fontSize: 30,
                    },
                  }}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        )}

        <Fragment>
          <form>{getStepContent(activeStep)}</form>

          <Box sx={{ display: "flex", flexDirection: "row" }}>
            {loading ? (
              <Skeleton width={100} />
            ) : (
              <Button
                disabled={activeStep === 0 || create}
                onClick={handleBack}
                variant="contained"
                color="error"
                sx={{
                  borderRadius: 10,
                  width: 100,
                  height: 36,
                }}
              >
                Back
              </Button>
            )}

            <Box sx={{ flex: "1 1 auto" }} />

            {loading ? (
              <Skeleton width={100} />
            ) : (
              <Button
                onClick={
                  activeStep === 4
                    ? handleSubmit(onSubmit)
                    : handleSubmit(handleNext)
                }
                disabled={create}
                variant="contained"
                color="error"
                sx={{
                  borderRadius: 10,
                  width: 100,
                  height: 36,
                }}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            )}
          </Box>
        </Fragment>
      </Box>
    </Box>
  );
};

export default AddPlace;
