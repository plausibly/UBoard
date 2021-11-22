import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import GenerateTags from "./Tags";
import ViewPostDialog from "./ViewPostDialog";

import { PostUserPreview } from "../api/v1/index";


export default function PostPreview(props: { postUser: PostUserPreview, 
  setOpenedPost: React.Dispatch<React.SetStateAction<boolean>> }) {
    
  const tags = GenerateTags(["Placeholder"]);

  return (
    <Grid data-testid="test-postpreview" item xs={12} sm={6} md={4} lg={4}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 500,
        }}
      >
        <CardMedia
          component="img"
          //TODO: once we set this up src={props.postUser.thumbnail}
          src="https://i.imgur.com/8EYKtwP.png"
          alt="placeholder"
          sx={{ maxWidth: "500px", maxHeight: "145px" }}
        />
        <CardContent sx={{ flexGrow: 1, mb: -2 }}>
          <Typography variant="h5" component="h2" style={{ wordWrap: 'break-word' }}>
            {props.postUser.title.substring(0, 28) + "..."}
          </Typography>
          <Typography sx={{ fontStyle: "italic" }} style={{ wordWrap: 'break-word' }}>
            By {props.postUser.User.firstName} {props.postUser.User.lastName}
          </Typography>
          <Typography sx={{ py: 1 }} style={{ wordWrap: 'break-word' }}>
            { props.postUser.body.substring(0, 150) + "..." }
          </Typography>
        </CardContent>
        <CardActions>
          <Stack sx={{ pl: 1 }}>
          <ViewPostDialog postUser={props.postUser} tags={tags} setOpenedPost={props.setOpenedPost}/>
          {tags}
          </Stack>
        </CardActions>
      </Card>
    </Grid>
  );
}
