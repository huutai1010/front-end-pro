import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Backdrop,
  CircularProgress,
  Skeleton,
  Tab,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

import Header from "../common/Header";
import ErrorModal from "../common/ErrorModal";

import GeneralInfo from "./others/GeneralInfo";
import ChangePassword from "./others/ChangePassword";

const Profile = () => {
  const theme = useTheme();

  const [tab, setTab] = useState("1");

  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState({
    errorState: false,
    errorMessage: "",
    status: "error",
  });

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
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
        open={update}
      >
        <CircularProgress color="error" />
      </Backdrop>

      <Header
        title={"Settings"}
        subTitle={"Manage personal information and update them."}
        loading={loading}
      />

      {/* Information Settings */}
      <Box paddingX={2} marginTop={2}>
        <TabContext value={tab}>
          {loading ? (
            <Skeleton width="100%" />
          ) : (
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChangeTab}>
                <Tab label="General" value={"1"} />
                <Tab label="Password" value={"2"} />
              </TabList>
            </Box>
          )}

          <TabPanel value={"1"} sx={{ paddingX: 5 }}>
            <GeneralInfo
              loading={loading}
              setLoading={setLoading}
              update={update}
              setUpdate={setUpdate}
              notification={notification}
              setNotification={setNotification}
            />
          </TabPanel>
          <TabPanel value={"2"}>
            <ChangePassword
              update={update}
              setUpdate={setUpdate}
              notification={notification}
              setNotification={setNotification}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default Profile;
