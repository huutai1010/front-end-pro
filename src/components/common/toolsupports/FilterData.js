import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { FilterAlt } from "@styled-icons/boxicons-regular";
import { StyledMenu } from "../styled/StyledMenu";

const FilterData = ({ setSearchBy, setSearch, isPlace }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [statusChecked, setStatusChecked] = useState("All");
  const [paymentMethodChecked, setPaymentMethodChecked] = useState("All");

  // const handleChangeMethod = (event) => {
  //   setPaymentMethodChecked(event.target.value);
  // };

  return (
    <Box>
      <Button
        variant="outlined"
        color="error"
        sx={{
          borderRadius: 20,
          height: 40,
        }}
        startIcon={<FilterAlt height={24} />}
        onClick={handleClick}
      >
        <Typography fontWeight="medium">Filter</Typography>
      </Button>

      {/* FilterMenu */}
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={1}
          paddingX={1}
        >
          <Box>
            <Typography variant="h6">Filter</Typography>
          </Box>

          {(statusChecked !== "All" || paymentMethodChecked !== "All") && (
            <Button
              variant="text"
              color="error"
              sx={{
                "&:hover": { bgcolor: theme.palette.background.primary },
                padding: 0,
              }}
              onClick={() => {
                setSearchBy("name");
                setSearch();
                setStatusChecked("All");
                setPaymentMethodChecked("All");
              }}
            >
              Clear
            </Button>
          )}
        </Box>

        {/* <Divider sx={{ marginBottom: 0.5 }} />

        <Box sx={{ display: "flex", flexDirection: "column", ml: 0.5 }}>
          <Box padding={0.5}>
            <Typography fontSize={16}>Payment Method</Typography>
          </Box>
          <MenuItem dense sx={{ borderRadius: 1 }}>
            <FormControlLabel
              label="All"
              control={
                <Checkbox
                  checked={paymentMethodChecked === "All"}
                  value="All"
                  onChange={handleChangeMethod}
                />
              }
            />
          </MenuItem>

          <MenuItem dense sx={{ borderRadius: 1 }}>
            <FormControlLabel
              label="MasterCard"
              control={
                <Checkbox
                  checked={paymentMethodChecked === "MasterCard"}
                  value="MasterCard"
                  onChange={handleChangeMethod}
                />
              }
            />
          </MenuItem>
          <MenuItem dense sx={{ borderRadius: 1 }}>
            <FormControlLabel
              label="Paypal"
              control={
                <Checkbox
                  checked={paymentMethodChecked === "Paypal"}
                  value="Paypal"
                  onChange={handleChangeMethod}
                />
              }
            />
          </MenuItem>
        </Box> */}

        <Divider sx={{ marginY: 0.5 }} />

        <Box sx={{ display: "flex", flexDirection: "column", ml: 0.5 }}>
          <Box padding={0.5}>
            <Typography fontSize={16}>Status</Typography>
          </Box>
          <MenuItem dense sx={{ borderRadius: 1 }}>
            <FormControlLabel
              label="All"
              control={
                <Checkbox
                  checked={statusChecked === "All"}
                  value="All"
                  onChange={(event) => {
                    setSearchBy("name");
                    setSearch();
                    setStatusChecked(event.target.value);
                  }}
                />
              }
            />
          </MenuItem>

          <MenuItem dense sx={{ borderRadius: 1 }}>
            <FormControlLabel
              label="Deactive"
              control={
                <Checkbox
                  checked={statusChecked === "Deactive"}
                  value="Deactive"
                  onChange={(event) => {
                    setSearchBy("status");
                    setSearch(0);
                    setStatusChecked(event.target.value);
                  }}
                />
              }
            />
          </MenuItem>

          {isPlace && (
            <MenuItem dense sx={{ borderRadius: 1 }}>
              <FormControlLabel
                label="Prepared"
                control={
                  <Checkbox
                    checked={statusChecked === "Prepared"}
                    value="Prepared"
                    onChange={(event) => {
                      setSearchBy("status");
                      setSearch(1);
                      setStatusChecked(event.target.value);
                    }}
                  />
                }
              />
            </MenuItem>
          )}

          <MenuItem dense sx={{ borderRadius: 1 }}>
            <FormControlLabel
              label="Active"
              control={
                <Checkbox
                  checked={statusChecked === "Active"}
                  value="Active"
                  onChange={(event) => {
                    setSearchBy("status");
                    setSearch(2);
                    setStatusChecked(event.target.value);
                  }}
                />
              }
            />
          </MenuItem>
        </Box>
      </StyledMenu>
    </Box>
  );
};

export default FilterData;
