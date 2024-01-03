import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { MoreHoriz } from "@styled-icons/material";
import { changeLanguageState } from "../languages/action";

const ActionLanguage = ({
  id,
  status,
  getData,
  notification,
  setNotification,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [popupConfirm, setPopupConfirm] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState(0);

  const showMenu = async (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleConfirm = (value) => {
    setStatusUpdate(value);
    setPopupConfirm(true);
    setAnchorEl(false);
  };

  const onConfirm = async () => {
    const value = { status: statusUpdate };
    try {
      const response = await changeLanguageState(id, value);
      if (response) {
        getData();
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: response.message || response,
          status: "success",
        });
      }
    } catch (e) {
      const message = e.response.data ? e.response.data.message : e.message;
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: message,
        status: "error",
      });
    }
    setPopupConfirm(false);
    //Close error message
    setTimeout(
      () => setNotification({ ...notification, errorState: false }),
      3000
    );
  };

  return (
    <>
      <IconButton aria-label="more" onClick={showMenu}>
        <MoreHoriz width={24} color={theme.palette.text.buttonText} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem disabled={status === 0} onClick={(e) => handleConfirm(0)}>
          Deactivate
        </MenuItem>
        <MenuItem disabled={status === 1} onClick={(e) => handleConfirm(1)}>
          Prepare
        </MenuItem>
        <MenuItem disabled={status === 2} onClick={(e) => handleConfirm(2)}>
          Activate
        </MenuItem>
      </Menu>
      <Dialog
        open={popupConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {statusUpdate === 0
            ? "Confirm language deactivation?"
            : statusUpdate === 1
            ? "Confirm language preparation?"
            : statusUpdate === 2
            ? "Confirm language activation?"
            : null}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {statusUpdate === 0
              ? "Deactivating language will cause this language to no longer be executed on the system."
              : statusUpdate === 1
              ? "Language preparation will allow tour operators to conduct activities in this language."
              : statusUpdate === 2
              ? "Activating language will allow users to perform activities with this language."
              : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 3 }}>
          <Button variant="outlined" onClick={onConfirm} autoFocus>
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setPopupConfirm(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionLanguage;
