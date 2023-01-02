import React from "react";
import Divider from "@mui/material/Divider";
import { Box, Grid, Typography } from "@mui/material";

const InnerText = (image: any) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <Box sx={{ my: 3, mx: 2 }}>
        <Grid container style={{ justifyContent: "center" }}>
          <Grid item xs>
            <Typography gutterBottom variant="h4" component="div">
              {image.image.title}
            </Typography>
          </Grid>
        </Grid>
        <Divider variant="middle" />
        <Grid>
          <Typography gutterBottom variant="h6" component="div">
            price: {image.image.price} discount: {image.image.discount}
          </Typography>
        </Grid>
        <Divider variant="middle" />
        <Typography color="text.secondary" variant="body2">
          {image.image.description}
        </Typography>
      </Box>
    </Box>
  );
};
export default InnerText;
