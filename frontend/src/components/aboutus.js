import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../style/style.css";
import Background from '../images/background.png';


class Aboutus extends Component {
  render() {
    return (
      // <div style={{  
      //   backgroundImage: `url(${Background})`,
      //   backgroundSize: 'contain',
      //   backgroundRepeat: 'no-repeat',
      // }}>
      <div>
        <div class="slogans">
          <Container>
            <Row>
              <h1>What is Food Ladder?</h1>
            </Row>
            <Row id="row1">
              <Col>
                <h3 className="instruction" id="list1">Choose Your Options</h3>
              </Col>
              <Col>
                <h5 className="detail">Edit the fiters on number of Candidates, Distance, and any Keyword</h5>
              </Col>
            </Row>
            <Row id="row2">
              <Col>
                <h3 className="instruction" id="list2">Spin the Wheel</h3>
              </Col>
              <Col>
                <h5 className="detail">Press Spin and watch as the wheel spins to choose a winner</h5>
              </Col>
            </Row>
            <Row id="row3">
              <Col>
                <h3 className="instruction" id="list3">Find A Menu</h3>
              </Col>
              <Col>
                <h5 className="detail">Observe the winning Restaurant and enjoy your meal!</h5>
              </Col>
            </Row>
          </Container>
        </div>
        <div class="explanation">
          <Container>
            <Row>
              <Col>
                <h5>
                  Food Wheel is a web application designed to help you choose
                  your menu.
                </h5>
              </Col>
            </Row>
          </Container>
        </div>
        <div class="whoweare">
        <Container>
          <Row>
            <Col>
              <h1>Who We Are</h1>
            </Col>
          </Row>
          <Row>
              <Col>
                <h4> We are KESA - Korean Engineering Student Association</h4>
              </Col>
          </Row>
        </Container>
        </div>
      </div>
    );
  }
}

export default Aboutus;
