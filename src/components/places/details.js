import React, { useEffect, useState } from "react";
import {
  Box,
  Backdrop,
  Button,
  CircularProgress,
  Skeleton,
  Tab,
  Typography,
  useTheme,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useLocation } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import Header from "../common/Header";
import ErrorModal from "../common/ErrorModal";
import GeneralInfo from "./others/details/GeneralInfo";
import MultiLanguages from "./others/details/MultiLanguages";
import Feedback from "./others/details/Feedback";
import BeaconSub from "./others/details/BeaconSub";
import DialogUpdateLang from "./others/details/DialogUpdateLang";
import DialogNewLang from "./others/details/DialogNewLang";
import DialogNewBeacon from "./others/details/DialogNewBeacon";

import { getPlaceDetails } from "./action";
import { getAllLanguages } from "../languages/action";

import { Update } from "@styled-icons/material-rounded";
import { Add } from "@styled-icons/ionicons-solid";
import DialogUpdateBeacon from "./others/details/DialogUpdateBeacon";
import DialogUpdate from "./others/details/DialogUpdate";
import { getCategoriesAll } from "../categories/action";

const PlaceDetails = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { placeId } = state;

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [showPopupLang, setShowPopupLang] = useState(false);
  const [showPopupBeacon, setShowPopupBeacon] = useState(false);
  const [showPopupNewLang, setShowPopupNewLang] = useState(false);
  const [showPopupNewBeacon, setShowPopupNewBeacon] = useState(false);

  const [values, setValues] = useState({});
  const [data, setData] = useState({});
  const [number, setNumber] = useState("1");
  const [beaconId, setBeaconId] = useState("");
  const [languagesList, setLanguagesList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const {
    getValues,
    register,
    reset,
    setValue,
    resetField,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { fields: fieldsDescriptions } = useFieldArray({
    control,
    name: "placeDescriptions",
  });

  const { fields: fieldsItems } = useFieldArray({
    control,
    name: "placeItems",
  });

  useEffect(() => {
    setLoading(true);
    async function getInfo() {
      try {
        const data = await getPlaceDetails(placeId);
        setValues(data);
        reset(data);
        const response = await dispatch(getAllLanguages());
        setLanguagesList(response.languages);
        const catesList = await dispatch(getCategoriesAll());
        setCategoryList(catesList.categories);
        setLoading(false);
      } catch (error) {
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Can't get data details for place!",
          status: "error",
        });
        setLoading(false);
      }
    }
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId]);

  useEffect(() => {
    reset(values);
    setData(values);
  }, [reset, values]);

  const handleTabs = (event, newValue) => {
    setNumber(newValue);
  };

  const filterLanguage = languagesList?.filter(
    (desc) =>
      !values?.placeDescriptions?.some(
        (lang) => lang.languageCode === desc.languageCode
      )
  );

  const filterItem = fieldsItems?.filter((item) => item.id === beaconId);
  const IndexItem = fieldsItems?.findIndex((item) => item.id === beaconId);
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
        categories={categoryList}
        setData={setData}
        control={control}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        getValues={getValues}
        update={update}
        setUpdate={setUpdate}
        notification={notification}
        setNotification={setNotification}
      />

      <DialogUpdateLang
        dialog={showPopupLang}
        setDialog={setShowPopupLang}
        setValues={setValues}
        fields={fieldsDescriptions}
        control={control}
        resetField={resetField}
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

      <DialogNewLang
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

      <DialogUpdateBeacon
        dialog={showPopupBeacon}
        setDialog={setShowPopupBeacon}
        setValues={setValues}
        location={filterItem[0]}
        locationIndex={IndexItem}
        languages={languagesList}
        updateItem={setValue}
        getValuesTotal={getValues}
        update={update}
        setUpdate={setUpdate}
        notification={notification}
        setNotification={setNotification}
      />

      <DialogNewBeacon
        dialog={showPopupNewBeacon}
        setDialog={setShowPopupNewBeacon}
        setValues={setValues}
        getValuesTotal={getValues}
        languages={filterLanguage}
        update={update}
        setUpdate={setUpdate}
        notification={notification}
        setNotification={setNotification}
      />

      <Header
        title={"Place Details"}
        subTitle={"Manage all information of place and update place."}
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
              <TabList onChange={handleTabs}>
                <Tab label="General" value="1" />
                <Tab label="Languages" value="2" />
                <Tab label="Positions" value="3" />
                <Tab label="Feedbacks" value="4" />
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
              ) : values?.placeDescriptions?.length < languagesList?.length ? (
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
            <MultiLanguages values={values} loading={loading} />
          </TabPanel>

          <TabPanel value="3">
            <Box display="flex" justifyContent="end">
              {loading ? (
                <Skeleton width={100} />
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 2.5,
                    height: 40,
                  }}
                  startIcon={<Add height={24} />}
                  onClick={() => setShowPopupNewBeacon(true)}
                >
                  <Typography fontWeight="medium">New</Typography>
                </Button>
              )}
            </Box>
            <BeaconSub
              placeName={values?.name}
              values={fieldsItems}
              loading={loading}
              getValues={getValues}
              setValues={setValues}
              setDialog={setShowPopupBeacon}
              locationIndex={IndexItem}
              setBeaconId={setBeaconId}
              update={update}
              setUpdate={setUpdate}
              notification={notification}
              setNotification={setNotification}
            />
          </TabPanel>

          <TabPanel value="4">
            <Feedback
              id={placeId}
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

export default PlaceDetails;
