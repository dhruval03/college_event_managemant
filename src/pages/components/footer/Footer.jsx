import React from 'react';
import {FaClock, FaPhone, FaEnvelope,FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaCaretRight } from 'react-icons/fa';
const Logo = () => {
  return (
    <div className="Footer_logo">
      {/* Your logo content here */}
      <a href="/">
        <img src="/img/logo.png"/>
      </a>
    </div>
  );
};

const Footer = () => {
    return (
        <footer className="footer-area section-padding-80-0">
            {/* Main Footer Area */}
            <div className="main-footer-area">
                <div className="container">
                    <div className="row align-items-baseline justify-content-between">
                        {/* Single Footer Widget Area */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="single-footer-widget mb-80">
                                {/* Footer Logo */}
                                <Logo />

                                <h4><FaPhone style={{marginRight:'5px', width:'20px'}}/>+91 2697 265011/12</h4>
                                <span><FaEnvelope style={{marginRight:'5px'}}/>info@charusat.ac.in</span>
                                <span><FaMapMarkerAlt style={{marginRight:'5px'}}/>139, CHARUSAT Campus, Highway, Off, Nadiad - Petlad Rd, Changa, Gujarat 388421</span>
                            </div>
                        </div>

                        {/* Single Footer Widget Area */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="single-footer-widget mb-80">
                                {/* Widget Title */}
                                <h5 className="widget-title">Our Blog</h5>

                                {/* Single Blog Area */}
                                <div className="latest-blog-area">
                                    <p className="post-title">Freelance Design Tricks How</p>
                                    <span className="post-date"><FaClock/> Jan 02,
                                        2019</span>
                                </div>

                                {/* Single Blog Area */}
                                <div className="latest-blog-area">
                                    <p className="post-title">Free Advertising For Your Online</p>
                                    <span className="post-date"><FaClock/> Jan 02,
                                        2019</span>
                                </div>
                            </div>
                        </div>

                        {/* Single Footer Widget Area */}
                        <div className="col-12 col-sm-4 col-lg-2">
                            <div className="single-footer-widget mb-80">
                                {/* Widget Title */}
                                <h5 className="widget-title">Links</h5>

                                {/* Footer Nav */}
                                <ul className="footer-nav">
                                    <li><a href="#"><FaCaretRight/> Home</a></li>
                                    <li><a href="#"><FaCaretRight/> Slot Book</a></li>
                                    <li><a href="#"><FaCaretRight/> About Us</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copywrite Area */}
            <div className="container">
                <div className="copywrite-content">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-8">
                            {/* Copywrite Text */}
                            <div className="copywrite-text">
                                <p>
                                    {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                    Copyright © <script>document.write(new Date().getFullYear());</script>
                                    2024 All rights reserved | <a href="https://www.charusat.ac.in/" target="_blank">CHARUSAT</a>
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            {/* Social Info */}
                            <div className="social-info">
                                <a href="https://www.facebook.com/thecharusat/"><FaFacebook/></a>
                                <a href="https://twitter.com/thecharusat?lang=en"><FaTwitter/></a>
                                <a href="https://www.linkedin.com/school/charotar-university-of-science-&-technology-charusat-"><FaLinkedin/></a>
                                <a href="https://www.instagram.com/thecharusat/?hl=en"><FaInstagram/></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;