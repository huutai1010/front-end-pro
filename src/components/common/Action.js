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
import { changeState } from "../users/action";

const Action = ({
  titleAc,
  titleDe,
  messageAc,
  messageDe,
  feedback,
  id,
  api,
  status,
  getData,
  notification,
  setNotification,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [popupConfirm, setPopupConfirm] = useState(false);

  const showMenu = async (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleConfirm = () => {
    setPopupConfirm(true);
    setAnchorEl(false);
  };

  const onConfirm = async () => {
    try {
      const response = await changeState(api, id);
      if (response) {
        getData();
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Change state successfully!",
          status: "success",
        });
      }
    } catch (e) {
      setNotification({
        ...notification,
        errorState: true,
        errorMessage: "Change state failed!",
        status: "error",
      });
    }
    await setPopupConfirm(false);
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
        <MenuItem onClick={handleConfirm}>
          {feedback
            ? status
              ? "Hide"
              : "Show"
            : status
            ? "Deactivate"
            : "Activate"}
        </MenuItem>
      </Menu>
      <Dialog
        open={popupConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {status ? titleDe : titleAc}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {status ? messageDe : messageAc}
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

export default Action;
