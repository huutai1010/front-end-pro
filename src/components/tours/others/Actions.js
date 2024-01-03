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
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { MoreHoriz } from "@styled-icons/material";
import { changeTourState } from "../action";

const Actions = ({ id, status, getData, notification, setNotification }) => {
  const theme = useTheme();
  const [popupConfirm, setPopupConfirm] = useState(false);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [update, setUpdate] = useState(false);

  const showMenu = async (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const onConfirm = async () => {
    setUpdate(true);
    try {
      const response = await changeTourState(id);
      if (response) {
        getData();
        setUpdate(false);
        setNotification({
          ...notification,
          errorState: true,
          errorMessage: "Change state successfully!",
          status: "success",
        });
      }
    } catch (e) {
      setUpdate(false);
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
        {status === 0 ? null : (
          <MenuItem
            onClick={() => {
              setValue(0);
              setPopupConfirm(true);
              setAnchorEl(false);
            }}
          >
            <Typography variant="span">Deactivate</Typography>
          </MenuItem>
        )}

        {status === 1 ? null : (
          <MenuItem
            onClick={() => {
              setValue(1);
              setPopupConfirm(true);
              setAnchorEl(false);
            }}
          >
            <Typography variant="span">Activate</Typography>
          </MenuItem>
        )}
      </Menu>
      <Dialog
        open={popupConfirm}
        onClose={() => setPopupConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {value === 0 ? "Are you sure you want to deactivate?" : null}
          {value === 1 ? "Are you sure you want to activate?" : null}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {value === 0
              ? "Your action will cause this itinerary to no longer be used in the system."
              : null}
            {value === 1
              ? "Your action will make the itinerary active again, and users can operate on it."
              : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 3 }}>
          <Button
            variant="outlined"
            onClick={onConfirm}
            disabled={update}
            autoFocus
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            color="error"
            disabled={update}
            onClick={() => setPopupConfirm(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Actions;
