import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { Sidebar, Menu, SubMenu, MenuItem } from "react-pro-sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { logOut } from "../../auth/action";

import { MenuOutline } from "@styled-icons/evaicons-outline";
import { ErrorOutline } from "@styled-icons/material";
import { SignOut } from "@styled-icons/octicons";

import Item from "./Item";
import logo from "../../../assets/eTravelLogo.png";
import tabsItem from "../../../constants/tabsItem";
import tabsItemAdmin from "../../../constants/tabsItemAdmin";

const SidebarApp = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  let path = location.pathname.slice();
  const state = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("dashboard");

  useEffect(() => {
    setSelected(path);
  }, [path]);

  const onLogout = () => {
    dispatch(logOut());
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="fixed"
      minHeight="inherit"
      zIndex={1}
      left={0}
      backgroundColor={theme.palette.background.primary}
    >
      <Sidebar collapsed={isCollapsed} backgroundColor="inherit">
        <Menu
          iconShape="square"
          menuItemStyles={{
            root: {
              color: theme.palette.text.third,
            },
            button: {
              [`&:hover`]: {
                backgroundColor: alpha(theme.palette.background.hovered, 0.025),
              },
            },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent={isCollapsed ? "center" : "space-between"}
            padding={1}
          >
            {!isCollapsed && (
              <Box>
                <img alt="Etravel Logo" width="80px" src={logo} />
              </Box>
            )}
            {!isCollapsed && (
              <Box>
                <Typography
                  color={theme.palette.text.third}
                  fontWeight="medium"
                  fontSize={14}
                >
                  {state.profile.roleName}
                </Typography>
              </Box>
            )}

            <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
              <MenuOutline width={24} />
            </IconButton>
          </Box>

          {state.profile.roleName === "Moderator" &&
            tabsItem.map((tab) => {
              const checkOpen = path.startsWith(tab.url);
              if (tab.options.length > 0) {
                return (
                  <SubMenu
                    key={tab.id}
                    defaultOpen={checkOpen}
                    label={
                      <Typography
                        fontWeight={false ? "bold" : "medium"}
                        color="inherit"
                        fontSize={14}
                      >
                        {tab.title}
                      </Typography>
                    }
                    icon={tab.icon}
                  >
                    {tab.options.map((option, index) => (
                      <Item
                        key={index}
                        title={option.subTitle}
                        icon={option.subIcon}
                        linkUrl={option.subUrl}
                        selected={selected === option.subUrl.toLowerCase()}
                        setSelected={setSelected}
                      />
                    ))}
                  </SubMenu>
                );
              } else {
                return (
                  <Item
                    key={tab.id}
                    title={tab.title}
                    icon={tab.icon}
                    linkUrl={tab.url}
                    selected={selected === tab.url.toLowerCase()}
                    setSelected={setSelected}
                  />
                );
              }
            })}

          {state.profile.roleName === "Administrator" &&
            tabsItemAdmin.map((tab) => (
              <Item
                key={tab.id}
                title={tab.title}
                icon={tab.icon}
                linkUrl={tab.url}
                selected={selected.includes(tab.url.toLowerCase())}
                setSelected={setSelected}
              />
            ))}
        </Menu>
      </Sidebar>
      <Box marginBottom={1}>
        <Sidebar
          collapsed={isCollapsed}
          backgroundColor={theme.palette.background.primary}
        >
          <Menu
            iconShape="square"
            menuItemStyles={{
              root: {
                color: theme.palette.text.third,
              },
              button: {
                [`&:hover`]: {
                  backgroundColor: alpha(
                    theme.palette.background.hovered,
                    0.025
                  ),
                },
              },
            }}
          >
            <MenuItem
              icon={<ErrorOutline width={20} />}
              onClick={() => setOpen(true)}
            >
              <Typography fontWeight="medium" fontSize={14}>
                Help & Information
              </Typography>
            </MenuItem>
            <MenuItem icon={<SignOut height={20} />} onClick={() => onLogout()}>
              <Typography fontWeight="medium" fontSize={14}>
                Log out
              </Typography>
            </MenuItem>
          </Menu>
        </Sidebar>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Help & Information"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The system helps manage all application information. You can perform
            basic operations to develop tours with the right voice for the
            language.
            <Typography fontWeight="medium">
              <strong>Call us: </strong>
              0971 520 977
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SidebarApp;
