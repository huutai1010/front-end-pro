import React from "react";
import { Typography, alpha, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { MenuItem } from "react-pro-sidebar";

const Item = ({ title, icon, linkUrl, selected, setSelected }) => {
  const theme = useTheme();
  const location = useLocation();
  let path = location.pathname.slice();

  return (
    <MenuItem
      icon={icon}
      component={<Link to={linkUrl} onClick={() => setSelected(path)} />}
      style={{
        color: selected ? theme.palette.text.active : undefined,
        backgroundColor: selected
          ? alpha(theme.palette.background.hovered, 0.05)
          : undefined,
      }}
      active={selected}
    >
      <Typography
        fontWeight={selected ? "bold" : "medium"}
        color="inherit"
        fontSize={14}
      >
        {title}
      </Typography>
    </MenuItem>
  );
};

export default Item;
