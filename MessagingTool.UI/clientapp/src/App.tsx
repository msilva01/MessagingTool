import React from "react";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import {
  faBan,
  faEnvelope,
  faSearch,
  faSms,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import { PhoneUpload } from "./components/PhoneUpload/PhoneUpload";
import { SendMessage } from "./components/SendMessage/SendMessage";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { DotLoaderOverlay } from "react-spinner-overlay";
import { ThemeProvider, createTheme } from "@mui/material";
export const MessagingTheme = createTheme({
  palette: {
    secondary: {
      main: "#839AA5",
      //light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      //contrastText: "#47008F",
      contrastText: "#fff",
    },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "#db3131",
          "&$error": {
            color: "#db3131",
          },
        },
      },
    },
  },
});

function App() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  return (
    <>
      <ThemeProvider theme={MessagingTheme}>
        <DotLoaderOverlay
          loading={isFetching + isMutating > 0}
          color="rgba(68,68,68,1)"
          overlayColor="rgba(68,68,68,0.2)"
        />
        <Navbar expand="lg" className="navBarHeader" variant="dark">
          <Container fluid>
            <Navbar.Brand>
              <Nav>
                <Nav.Item>
                  Messaging Tool
                  {process.env.REACT_APP_ENVIRONMENT === "DEV" && (
                    <Badge pill bg="primary" className="ms-2">
                      {process.env.REACT_APP_ENVIRONMENT}
                    </Badge>
                  )}
                </Nav.Item>
              </Nav>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-center"
            >
              <>
                <Nav>
                  <Nav.Item>
                    <Nav.Link
                      as={NavLink}
                      to="/"
                      eventKey={"/"}
                      className="px-4"
                    >
                      <FontAwesomeIcon icon={faUpload} />
                      &nbsp; Upload
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      as={NavLink}
                      to="/SendMessage"
                      eventKey={"SendMessage"}
                      className="px-4"
                    >
                      <FontAwesomeIcon icon={faSms} />
                      &nbsp; Send Text
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      as={NavLink}
                      to="/DoNotCall"
                      eventKey={"DoNotCall"}
                      className="px-4"
                    >
                      <FontAwesomeIcon icon={faBan} />
                      &nbsp; Do Not Call
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </>
            </Navbar.Collapse>
            <div>
              <span className="fs-8 float-end mt-3">
                v.{process.env.REACT_APP_VERSION}
              </span>
            </div>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/" element={<PhoneUpload></PhoneUpload>}></Route>
          <Route
            path="/SendMessage"
            element={<SendMessage doNotCall={false}></SendMessage>}
          ></Route>
          <Route
            path="/DoNotCall"
            element={<SendMessage doNotCall={true}></SendMessage>}
          ></Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;

//onSelect={(key) => this.handleSelect(key)}>
