import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Backdrop,
  CircularProgress,
  Skeleton,
  Tab,
  Typography,
  useTheme,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";

import Header from "../common/Header";
import ErrorModal from "../common/ErrorModal";
import SubsLanguage from "./others/details/SubsLanguage";
import GeneralInfo from "./others/details/GeneralInfo";
import Feedback from "./others/details/Feedback";
import DialogUpdate from "./others/details/DialogUpdate";
import DialogUpdateLangs from "./others/details/DialogUpdateLangs";
import DialogNewLangs from "./others/details/DialogNewLangs";

import { getTourDetails } from "./action";
import { getAllLanguages } from "../languages/action";

import { Update } from "@styled-icons/material-rounded";
import { Add } from "@styled-icons/ionicons-solid";

const TourDetails = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { tourId } = state;

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupLang, setShowPopupLang] = useState(false);
  const [showPopupNewLang, setShowPopupNewLang] = useState(false);

  const [values, setValues] = useState({});
  const [data, setData] = useState({});
  const [number, setNumber] = useState("1");
  const [languagesList, setLanguagesList] = useState([]);

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const {
    getValues,
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { fields } = useFieldArray({
    control,
    name: "tourDescriptions",
  });

  useEffect(() => {
    async function getInfoDetails() {
      setLoading(true);
      try {
        const data = await getTourDetails(tourId);
        setValues(data);
        reset(data);
        const response = await dispatch(getAllLanguages());
        setLanguagesList(response.languages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Can't get data!",
          status: "error",
        });
      }
    }
    getInfoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  useEffect(() => {
    reset(values);
    setData(values);
  }, [reset, values, showPopupLang, showPopup]);

  const handleChange = (event, newValue) => {
    setNumber(newValue);
  };

  const filterLanguage = languagesList.filter(
    (desc) =>
      !values.tourDescriptions.some(
        (lang) => lang.languageCode === desc.languageCode
      )
  );

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
        sx={{
          color: "#fff",
          zIndex: (theme) =>
            Math.max.apply(Math, Object.values(theme.zIndex)) + 1,
        }}
        open={update}
      >
        <CircularProgress color="error" />
      </Backdrop>

      <DialogUpdate
        dialog={showPopup}
        setDialog={setShowPopup}
        setValues={setValues}
        data={data}
        setData={setData}
        getValues={setValues}
        update={update}
        setUpdate={setUpdate}
        notification={notification}
        setNotification={setNotification}
      />

      <DialogUpdateLangs
        dialog={showPopupLang}
        setDialog={setShowPopupLang}
        setValues={setValues}
        fields={fields}
        control={control}
        register={register}
        errors={errors}
        getValues={getValues}
        handleSubmit={handleSubmit}
        languages={languagesList}
        update={update}
        setUpdate={setUpdate}
        notification={notification}
        setNotification={setNotification}
      />

      <DialogNewLangs
        dialog={showPopupNewLang}
        setDialog={setShowPopupNewLang}
        setValues={setValues}
        getValuesTotal={getValues}
        languages={filterLanguage}
        update={update}
        setUpdate={setUpdate}
        notification={notification}
        setNotification={setNotification}
      />

      <Header
        title={"Itinerary Details"}
        subTitle={"Manage all information of itinerary and update itinerary."}
        loading={loading}
        showBack={true}
      />

      <Box marginX={6} paddingX={3}>
        <TabContext value={number}>
          {loading ? (
            <Skeleton width="100%" height={75} />
          ) : (
            <Box
              sx={{
                marginTop: 1,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <TabList onChange={handleChange}>
                <Tab label="General" value="1" />
                <Tab label="Descriptions" value="2" />
                <Tab label="Feedbacks" value="3" />
              </TabList>
            </Box>
          )}
          <TabPanel value="1">
            <Box display="flex" justifyContent="end">
              {!loading ? (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    borderRadius: 2.5,
                    height: 40,
                  }}
                  startIcon={<Update height={24} />}
                  onClick={() => setShowPopup(true)}
                >
                  <Typography fontWeight="medium">Update</Typography>
                </Button>
              ) : (
                <Skeleton width={100} />
              )}
            </Box>
            <GeneralInfo values={values} loading={loading} />
          </TabPanel>
          <TabPanel value="2">
            <Box display="flex" justifyContent="end" gap={2}>
              {loading ? (
                <Skeleton width={100} />
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    borderRadius: 2.5,
                    height: 40,
                  }}
                  startIcon={<Update height={24} />}
                  onClick={() => setShowPopupLang(true)}
                >
                  <Typography fontWeight="medium">Update</Typography>
                </Button>
              )}
              {loading ? (
                <Skeleton width={100} />
              ) : values?.tourDescriptions?.length < languagesList?.length ? (
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 2.5,
                    height: 40,
                  }}
                  startIcon={<Add height={24} />}
                  onClick={() => setShowPopupNewLang(true)}
                >
                  <Typography fontWeight="medium">New</Typography>
                </Button>
              ) : null}
            </Box>
            <SubsLanguage
              values={values}
              loading={loading}
              languages={languagesList}
            />
          </TabPanel>
          <TabPanel value="3">
            <Feedback
              id={tourId}
              notification={notification}
              setNotification={setNotification}
              rating={values?.rate}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default TourDetails;
