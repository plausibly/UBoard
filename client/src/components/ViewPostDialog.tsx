import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import MoreVert from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

import GenerateTags from './Tags';
import Snackbar from '@mui/material/Snackbar';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

/* Post settings, choosing between deleting, editing or reporting a post. The delete
  and edit options are only shown if the user is authorized. */
function MoreOptions() {
  const [isOpen, toggleMenu] = React.useState(false);

  const closeMenu = () => {
    toggleMenu(false);
  };

  return (
    <>
      <IconButton
        id="post-settings"
        data-testid="test-post-settings"
        color="inherit"
        aria-controls="settings-menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => {
          toggleMenu(true);
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="post-settings-menu"
        data-testid="test-post-settings-menu"
        anchorEl={document.getElementById('post-settings')}
        open={isOpen}
        onClose={closeMenu}
        MenuListProps={{
          'aria-labelledby': 'post-settings',
        }}
      >
        {/* TODO: Edit and Delete should only be visible to post author */}
        <MenuItem onClick={closeMenu}>Edit</MenuItem>
        <MenuItem onClick={closeMenu}>Delete</MenuItem>
        <MenuItem onClick={closeMenu}>Report</MenuItem>
      </Menu>
    </>
  );
}

/* Like button. Handles liking/unliking a post */
function LikeButton() {
  // TODO: update/get data from db
  const [isLiked, toggleLiked] = React.useState(false);

  const handleClick = () => {
    toggleLiked((prevLike) => !prevLike);
  };

  const likeButton = isLiked ? (
    <ThumbUpIcon onClick={handleClick} fontSize="large" />
  ) : (
    <ThumbUpOffAltIcon onClick={handleClick} fontSize="large" />
  );

  return (
    <Stack>
      {likeButton}
      <Typography sx={{ px: 2 }}>0</Typography>
    </Stack>
  );
}

function CapacityBar() {
  // TODO: This data should be synced with db
  const [capacity, setCapacity] = React.useState(0);
  const [isCheckedin, toggleCheckin] = React.useState(false);
  const maxCapacity = 10;

  const handleCheckIn = () => {
    toggleCheckin((prev) => !prev);
  };

  React.useEffect(() => {
    if (isCheckedin) {
      setCapacity((prev) => prev + 1);
    } else {
      setCapacity((prev) => (prev > 0 ? prev - 1 : prev));
    }
  }, [isCheckedin]);

  const buttonHandler =
    capacity < maxCapacity ? (
      isCheckedin ? (
        <Button onClick={handleCheckIn} variant="contained">
          Undo
        </Button>
      ) : (
        <Button onClick={handleCheckIn} variant="outlined">
          Check In
        </Button>
      )
    ) : (
      <Button disabled variant="outlined">
        {' '}
        AT CAPACITY{' '}
      </Button>
    );

  return (
    <Stack spacing={1} sx={{ mr: 4 }}>
      <Typography variant="body1" sx={{ pr: 2 }}>
        Capacity: {capacity}/{maxCapacity}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(capacity * 100) / maxCapacity}
      ></LinearProgress>
      {buttonHandler}
    </Stack>
  );
}

export function EditPostDialog(props: {
  id: string;
  title: string;
  body: string;
  location: string;
  capacity: number;
  toggleEdit: () => void;
}) {
  const [alertMsg, setMsg] = React.useState('Error. Ensure all fields are filled');
  const [capacityError, setCapacityError] = React.useState('');
  const [isAlertOpen, showAlert] = React.useState(false); 

  const [form, setForm] = React.useState({
    title: props.title,
    body: props.body,
    capacity: props.capacity,
    location: props.location,
  });

  const handleSubmit = () => {
    if (form.body.length < 25 ) {
      setMsg('Body must be atleast 25 characters');
      showAlert(true);
    }
    else if (form.title === '' || form.location === '') {
      setMsg('Enter all required fields');
      showAlert(true);
    } else {
      console.log(form);
      props.toggleEdit();
      // Submit the form
    }
  }

  return (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <IconButton
          data-testid="test-btn-edit-close"
          edge="start"
          color="inherit"
          onClick={props.toggleEdit}
          aria-label="close"
        >
          <ArrowBack />
        </IconButton>
      </AppBar>

      <Stack sx={{ pt: 5, pl: 4, px: 4 }}>
        <Typography> Title </Typography>
        <TextField
          fullWidth
          defaultValue={props.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </Stack>

      {/* Top information (author, date, tags..) */}
      <Stack sx={{ pl: 4, pt: 3, pb: 3, px: 4 }}>
        {/* {GenerateTags(['Tag 1', 'Tag 2'])} */}
        <Typography> Location </Typography>
        <TextField
          size="small"
          defaultValue={props.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </Stack>

      {/* Post image and body */}
      <Stack sx={{ pl: 4, px: 4 }}>
        <Typography> Body </Typography>
        <TextField
          defaultValue={props.body}
          fullWidth
          multiline
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
        <Stack sx={{ pt: 2, pb: 2 }}>
          <Typography> Capacity </Typography>
          <TextField
            size="small"
            defaultValue={props.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: Number(e.target.value) })
            }
            onBlur={() => {
              if (!/^[0-9]*$/.test(form.capacity.toString())) {
                setCapacityError('Only numbers allowed!');
              } else {
                setCapacityError('');
              }
            }}
            error={capacityError !== ''}
            helperText={capacityError}
          />
        </Stack>

        <Button
          data-testid="test-btn-edit"
          variant="contained"
          onClick={() => {
            console.log(form);
          }}
          sx={{ mb: 3 }}
        >
          Update Post
        </Button>
      </Stack>
      <Snackbar
    open={isAlertOpen}
    autoHideDuration={6000}
    onClose={() => showAlert(false)}
    message={alertMsg}
  />
    </>
  );
}

/* Opens a full screen dialog containing a post. */
export default function ViewPostDialog() {
  const [isOpen, toggleDialog] = React.useState(false);
  const [isEdit, toggleEditor] = React.useState(true);

  const closeDialog = () => {
    toggleDialog(false);
  };

  return (
    <div>
     {isEdit && <EditPostDialog id="123" title="this is a testing title" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum." location="jap" capacity={3} 
            toggleEdit={() => toggleEditor(prev => !prev)} /> }
      {/* TODO:  change ID after integrating with API*/}

      {!isEdit && <><Button
        data-testid="test-btn-preview"
        variant="outlined"
        onClick={() => {
          toggleDialog(true);
        }}
        sx={{ mb: 3 }}
      >
        Read More
      </Button>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={closeDialog}
        TransitionComponent={Transition}
        data-testid="test-post-dialog"
        aria-label="post-dialog"
      >
        <AppBar sx={{ position: 'relative' }}>
          <IconButton
            data-testid="test-btn-close"
            edge="start"
            color="inherit"
            onClick={closeDialog}
            aria-label="close"
          >
            <ArrowBack />
          </IconButton>
        </AppBar>

        {/* Title and Options (3 dots) */}
        <Stack direction="row" sx={{ pt: 5, pl: 4 }}>
          <Typography variant="h5">
            This is a placeholder event title
          </Typography>
          <MoreOptions  />
        </Stack>

        {/* Top information (author, date, tags..) */}
        <Stack sx={{ pl: 4 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Posted 01/01/1969 by John Smith (username123)
          </Typography>
          {GenerateTags(['Tag 1', 'Tag 2'])}
          <Typography variant="body2" sx={{ pt: 2 }}>
            Location: China
          </Typography>
          {/* TODO: Implement Google Maps API */}
        </Stack>

        {/* Post image and body */}
        <Stack sx={{ pl: 4 }}>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src="https://i.imgur.com/8EYKtwP.png"
              alt="Thumbnail"
              height="400px"
              width="400px"
            />
          </Box>
          <Typography variant="body1" sx={{ px: 4, py: 1, pb: 4 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Typography>
          <Stack direction="row" sx={{ px: 4, pb: 5 }}>
            {/* Capacity information and check-in (if applicable -- otherwise, this is hidden) */}
            <CapacityBar />
            <LikeButton />
          </Stack>
        </Stack>

        {/* Comment Section */}
        <Stack sx={{ px: 8, pb: 5 }}>
          <Typography variant="h5" sx={{ py: 2 }}>
            Comments
          </Typography>
          <TextField
            variant="filled"
            placeholder="Write a comment"
            size="small"
          ></TextField>
          <Button variant="contained" sx={{ mt: 2 }}>
            Add Comment
          </Button>
        </Stack>
        {/* TODO: Create Comment component later */}
      </Dialog> </> }
    </div>

  );
}
