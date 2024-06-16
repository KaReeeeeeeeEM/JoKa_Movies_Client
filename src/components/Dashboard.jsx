/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Card from "./Card";
import SimpleBackDrop from "./SimpleBackDrop";
import Star from "@mui/icons-material/Star";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TopBar from "./TopBar";
import MainListItems from "./ListItems";
import { dark } from "@mui/material/styles/createPalette";
import { MovieCreation, TrendingUp, LightbulbIcon, LightbulbCircleOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import SarufiChatbox from "react-sarufi-chatbox";
import "../index.css";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        jokamoviespoint@gmail.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [profile, setProfile] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const { user } = useParams();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const profilePicture = urlSearchParams.get("profile");

  useEffect(() => {
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
  }, [user, profilePicture]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        await fetchMoviesByCategory("popular", 5);
        await fetchMoviesByCategory("top_rated", 5);
        await fetchMoviesByCategory("upcoming", 5);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching movies:", error);
      }
    };
  
    fetchMovies();
  }, []);
  
  const fetchMoviesByCategory = async (category, pageCount) => {
    try {
      let allMovies = [];
  
      for (let page = 1; page <= pageCount; page++) {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${category}?api_key=035c0f1a7347b310a5b95929826fc81f&language=en-US&page=${page}`
        );
       
        const moviesData = response.data.results;
        allMovies = [...allMovies, ...moviesData];
      }
  
      // Update state based on category
      if (category === "popular") {
        setPopularMovies((prev) => [...prev, ...allMovies]);
      } else if (category === "trending") {
        setTrendingMovies((prev) => [...prev, ...allMovies]);
      } else if (category === "upcoming") {
        setUpcomingMovies((prev) => [...prev, ...allMovies]);
      }
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
    }
  };  
  

  return (
    <ThemeProvider theme={defaultTheme}>
      {loading ? (
        <SimpleBackDrop />
      ) : (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <TopBar profile={profilePicture} />
          <Box
            component="main"
            sx={{
              backgroundColor: "#fff",
              flexGrow: 1,
              height: "100vh",
              width: "100%",
            }}
          >
            <Toolbar />
            <Container maxWidth="100vw" sx={{ mt: 3, mb: 4 }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} mt={5} textAlign="center">
                {user ? (
                  <Typography variant="h4">
                    <IconButton>
                      <MovieCreation fontSize="large" />
                    </IconButton>
                    <span style={{ color: "orange" }}>Popular</span> Movies
                    for <span style={{ color: "orange" }}>{username}</span>
                  </Typography>
                ) : (
                  <Typography variant="h4">
                    <IconButton>
                      <MovieCreation fontSize="large" />
                    </IconButton>
                    <span style={{ color: "orange" }}>Popular</span> Movies
                  </Typography>
                )}
                <Grid
                  container
                  justifyContent="center"
                  spacing={0}
                  mt={3}
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    overflowX: "auto",
                    padding: "0 10%",
                  }}
                >
                  {popularMovies.map((movie) => (
                    <Grid item key={movie.id} sx={{ flex: "0 0 auto", margin: "0 2px" }}>
                      <Link
                        href={`/SelectedMovie/${movie.id}/${user}?profile=${profile}&related=${movie.original_title || movie.original_title}`}
                        underline="none"
                      >
                        <Card
                          movie={
                            movie.original_title.length > 30
                              ? movie.original_title.substring(0, 30) + "..."
                              : movie.original_title
                          }
                          year={movie.release_date.slice(0, 4)}
                          poster_path={movie.poster_path}
                        />
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} mt={5} textAlign="center">
                <Typography variant="h4">
                  <IconButton>
                    <TrendingUp fontSize="large" />
                  </IconButton>
                  <span style={{ color: "orange" }}>Trending</span> Movies & Shows
                </Typography>
                <Grid
                  container
                  justifyContent="center"
                  spacing={0}
                  mt={3}
                  sx={{ padding: "0 10%" }}
                >
                  {trendingMovies.map((movie) => (
                    <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3} sx={{ padding: "0 2px" }}>
                      <Link
                        sx={{ textDecoration: "none" }}
                        href={`/SelectedMovie/${movie.id}/${user}?profile=${profile}&related=${movie.original_title || movie.original_title}`}
                      >
                        <Card
                          key={movie.id}
                          movie={
                            movie.title?.length > 30
                              ? movie.title.substring(0, 30)
                              : movie.title || movie.original_title.length > 30
                              ? movie.original_title.substring(0, 30)
                              : movie.original_title || movie.name.length > 30
                              ? movie.name.substring(0, 30) + "..."
                              : movie.name
                          }
                          media={movie.media_type.toUpperCase()}
                          rating={Math.ceil(movie.vote_average * 10) / 10}
                          poster_path={movie.poster_path || movie.backdrop_path}
                          star={<Star />}
                        />
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} mt={5} textAlign="center">
                <Typography variant="h4">
                  <IconButton>
                    <LightbulbCircleOutlined fontSize="large" />
                  </IconButton>
                  <span style={{ color: "orange" }}>Featured</span> Content
                </Typography>
                <Grid
                  container
                  justifyContent="center"
                  spacing={0}
                  mt={3}
                  sx={{ padding: "0 10%" }}
                >
                  {upcomingMovies.map((movie) => (
                    <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3} sx={{ padding: "0 2px" }}>
                      <Link
                        sx={{ textDecoration: "none" }}
                        href={`/SelectedMovie/${movie.id}/${user}?profile=${profile}&related=${movie.original_title || movie.original_title}`}
                      >
                        <Card
                          key={movie.id}
                          movie={
                            movie.title?.length > 30
                              ? movie.title.substring(0, 30)
                              : movie.title || movie.original_title.length > 30
                              ? movie.original_title.substring(0, 30) + "..."
                              : movie.original_title || movie.name.length > 30
                              ? movie.name.substring(0, 30) + "..."
                              : movie.name
                          }
                          year={movie.release_date.slice(0, 4)}
                          rating={
                            movie.vote_average === 0
                              ? "5.5"
                              : movie.vote_average
                          }
                          poster_path={movie.backdrop_path}
                          star={<Star />}
                        />
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            </Container>
            <SarufiChatbox botId={3343} />
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}
