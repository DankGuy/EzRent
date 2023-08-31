import { Card, Col, Form, Input, Row, Space } from 'antd';
import React, { useState } from 'react';
import aboutusBg from '../../images/aboutUsBg.jpg';
import missionPic from '../../images/missionPic.jpg';
import { PiStudentFill } from 'react-icons/pi';
import { MdSecurity } from 'react-icons/md';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { FaFileContract } from 'react-icons/fa';




function AboutUs() {

  const bannerStyle = {
    backgroundImage: `url(${aboutusBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textShadow: '0 0 10px #000',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    letterSpacing: '1px',
    lineHeight: '1.5',
    zIndex: '1',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 0 2000px rgba(0,0,0,.5)',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,.6) 0%,rgba(0,0,0,.6) 100%)',
      zIndex: '-1',
    },
  };


  return (
    <div className="aboutUs">
      <div style={bannerStyle}>
        <div style={{ padding: '0 20px', width: '50%' }}>
          <h1 style={{ fontSize: '3rem', marginBlockStart: '0.8em', marginBlockEnd: '0em' }}>
            About Us
          </h1>
          {/* <p style={{ fontSize: '1.5rem' }}>
            Welcome to ezRent - Your Home Away from Home!
          </p> */}
          <p style={{ fontSize: '1.5rem' }}>
            EzRent is a platform that connects students with landlords.
            We aim to provide a safe and secure platform for students to find their ideal home away from home.
          </p>
        </div>
      </div>

      <div style={{
        padding: '20px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        <h3 style={{ fontSize: '1.5rem' }}>
          Welcome to ezRent - Your Home Away from Home!
        </h3>
      </div>

      <section>
        <Row>
          <Col span={12}>
            <div style={{
              padding: '20px 50px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
              <h3 style={{ fontSize: '1.4rem' }}>
                Our Mission
              </h3>
              <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                Our mission is simple: to provide TARUMT students with a trusted platform
                for finding comfortable and affordable accommodations near their campus.
                We are committed to ensuring the welfare and convenience of our student users.
              </p>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <img src={missionPic} alt="missionPic" style={{ width: '100%' }} />
            </div>
          </Col>
        </Row>
      </section>

      <section>
        <div style={{
          padding: '20px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginBottom: '50px',
        }}>
          <h3 style={{ fontSize: '1.6rem' }}>
            Our Solution
          </h3>
          <Space direction="horizontal" size="large">
            <SolutionCard 
              title="Exclusive Access"
              content="We restrict access to TARUMT students, ensuring they have priority when searching for accommodations."
              icon= {<PiStudentFill 
                style={{ 
                  color: 'red',
                  backgroundColor: "rgba(255,0,0,0.25)",
                  borderRadius: '50%',
                  fontSize: '3rem',
                  padding: 8,
               }} />}
            />

            <SolutionCard
              title="Verified Listings"
              content="Our admin team carefully reviews and approves rental listings, minimizing the risk of scams and fraud."
              icon= {<MdSecurity 
                style={{ 
                  color: 'blue',
                  backgroundColor: "rgba(0,0,255,0.25)",
                  borderRadius: '50%',
                  fontSize: '3rem',
                  padding: 8,
                 }} />}
            />

            <SolutionCard
              title="Transparent Pricing"
              content="We provide a platform for agents to list their properties for free, ensuring that students get the best deals."
              icon= {<MdOutlinePriceCheck style={{ 
                color: 'green',
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: '50%',
                fontSize: '3rem',
                padding: 8,
               }} />}
            />

            <SolutionCard
              title="Rental Agreements"
              content="We generate digital rental agreements for a seamless and efficient renting process."
              icon= {<FaFileContract 
                  style={{ 
                    color: 'orange',
                    backgroundColor: "rgba(255,165,0,0.25)",
                    borderRadius: '50%',
                    fontSize: '3rem',
                    padding: 8,
                   }} />}
            />
          </Space>
        </div>
      </section>
    </div>
  );
}

function SolutionCard({ content, icon, title }) {
  return (
    <Card hoverable style={{ width: 240, height: 280 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {icon}
        <h3 style={{ textAlign: 'center' }}>{title}</h3>
        <p style={{textAlign: 'center'}}>{content}</p>
      </div>
    </Card>
  );
}


export default AboutUs;