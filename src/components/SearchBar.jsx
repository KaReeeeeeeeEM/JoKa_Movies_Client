/* eslint-disable react-hooks/exhaustive-deps */
import React,{useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { styled } from "@mui/material/styles"; // Import for custom styling
import { Search } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ccc", // Set border color to primary (orange by default in MUI)
      borderRadius: "2rem", // Use Material UI shape for rounded corners
      width: "100%", // Make input full width
      height: "2.8rem",
      marginTop: "0.5rem",
      marginLeft: "0.2rem",
      transition: theme.transitions.create("border-color", {
        duration: theme.transitions.duration.standard,
      }),
    },
    "&:hover": {
      "& fieldset": {
        borderColor: "orange", // Highlight on hover (same as focused)
      },
    },
    "&.Mui-focused fieldset": {
      borderColor: "orange", // Orange outline on focus
    },
    "& .transformed .MuiInputLabel-root": {
      color: "orange !important",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "orange !important",
    },
  },
}));

export default function OrangeOutlineSearchBar() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const { user } = useParams();
  const [username, setUsername] = useState(null);
  const [profile, setProfile] = useState(null);


  const searchInputRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === '/') {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search); // Parse query string
    const profilePicture = urlSearchParams.get("profile");

    if (user) {
      setUsername(user);
    } else {
      setUsername(username);
    }

    if (profilePicture) {
      setProfile(profilePicture);
    } else {
      setProfile(profile);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setInputValue("");
    console.log(`Searched for ${inputValue}`);
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=035c0f1a7347b310a5b95929826fc81f&query=${inputValue}`);
      console.log('Request successful:', response.data);
      window.location.href=`/Results/${user}?profile=${profile}&search=${inputValue}&pages=${response.data.total_pages}`;
    } catch (error) {
      console.error('Request error:', error);
    } finally {
      console.log('Finished fetching ' + response.data.total_pages);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <StyledTextField
      label="Ctrl + / to Search"
      sx={{marginLeft:{xs:"-50px",md:"0"}}}
      fullWidth // Make the searchbar take up the full width
      variant="outlined"
      value={inputValue}
      inputRef={searchInputRef}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <Search />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
    </form>
  );
}
