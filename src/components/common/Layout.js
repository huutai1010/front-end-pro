import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import SidebarApp from "./sidebar";

const Layout = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 800px)");
  const [isCollapsed, setIsCollapsed] = useState(!isNonMobile);

  return (
    <Box display="flex" minHeight="inherit">
      <SidebarApp isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Box
        flexGrow={1}
        sx={{
          background: theme.palette.background.secondary,
          transition: "all 200ms ease-in-out",
        }}
        marginLeft={isCollapsed ? "80px" : "250px"}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
