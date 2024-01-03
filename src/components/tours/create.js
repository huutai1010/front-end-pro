import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Step,
  StepLabel,
  Stepper,
  useTheme,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import PlacesList from "./others/PlacesList";
import TourGeneral from "./others/TourGeneral";
import PreviewData from "./others/PreviewData";
import ErrorModal from "../common/ErrorModal";
import Header from "../common/Header";

import { getPlaces } from "../places/action";
import { processTour } from "./action";
import { useForm } from "react-hook-form";

const steps = ["Informations", "Place List", "Confirmation"];

const initialState = {
  name: "",
  image: "",
  total: 0,
  tourDescriptions: [{ languageCode: "en-us", name: "", description: "" }],
  tourDetails: [],
};

const CreateNewTour = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [values, setValues] = useState(initialState);
  const [search, setSearch] = useState("");
  const [SearchBy, setSearchBy] = useState("name");

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    totalCount: 0,
  });

  const [pageModelState, setPageModelState] = useState({
    page: 0,
    pageSize: 10,
  });

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const {
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      image: "",
      tourDescriptions: [{ languageCode: "en-us", name: "", description: "" }],
    },
  });

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
            SearchBy: SearchBy,
            Search: search,
          })
        );
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: data.places.data,
          totalCount: data.places.totalCount,
        }));
        await setLoading(false);
      } catch (error) {
        await setLoading(false);
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
  }, [search, SearchBy, pageModelState.page, pageModelState.pageSize]);

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
    clearErrors("minimumPlace");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TourGeneral
            values={values}
            setValues={setValues}
            loading={loading}
            register={register}
            control={control}
            errors={errors}
            getValues={getValues}
            notification={notification}
            setNotification={setNotification}
          />
        );
      case 1:
        return (
          <PlacesList
            values={values}
            setValues={setValues}
            setSearch={setSearch}
            setSearchBy={setSearchBy}
            errors={errors}
            setError={setError}
            clearErrors={clearErrors}
            pageState={pageState}
            setPageState={setPageState}
            pageModelState={pageModelState}
            setPageModelState={setPageModelState}
            notification={notification}
            setNotification={setNotification}
          />
        );
      case 2:
        return (
          <PreviewData
            data={values}
            descriptionList={getValues("tourDescriptions")}
          />
        );
      default:
        return;
    }
  };

  const onSubmit = async () => {
    setCreate(true);
    let arr = [];
    for (const place of values.tourDetails) {
      arr.push({ id: place.id, price: place.price });
    }
    const data = {
      ...values,
      tourDescriptions: getValues("tourDescriptions"),
      tourDetails: arr,
    };

    try {
      await dispatch(processTour(data));
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Create itinerary successfully!",
        status: "success",
      });
      reset(initialState);
      setValues(initialState);
      setCreate(false);
      setActiveStep(0);
    } catch (e) {
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: e.response?.data?.message || "Create itinerary Failed!",
        status: "error",
      });
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
        title={"Create New Itinerary"}
        subTitle={"New Itineraries - New Experiences"}
        loading={loading}
      />
      <Box marginTop={2} padding={1} marginX={2}>
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
                  activeStep === 2
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

export default CreateNewTour;
