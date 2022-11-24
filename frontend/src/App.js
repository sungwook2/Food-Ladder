import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Button,
  ButtonGroup,
  Image,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./components/home";
import Aboutus from "./components/aboutus";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">Food Wheel</Navbar.Brand>
            <Nav >
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/aboutus">About Us</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Switch>
          <Route exact path="/"> 
            <Home /> 
          </Route>
          <Route exact path="/aboutus"> 
            <Aboutus /> 
          </Route>        
        </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
