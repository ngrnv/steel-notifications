import React from "react";
import { Box, Theme } from "@mui/material";

const FieldGroup = (props: any) => {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        margin: (theme: Theme) => `${theme.spacing(1.5)} 0`,
        ...sx
      }}
      {...other} />

  );
};

export default FieldGroup;
