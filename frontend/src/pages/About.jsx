import React from "react";
import "../css/About.css";
import pancakeImg from "../images/pancakes.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-hero">
        <div className="about-intro">
          <h1>
            Cooking Made
            <br />
            Personal
          </h1>
          <p className="quote">
            “We believe everyone deserves quick access to recipes that fit their
            tastes, lifestyles, and occasions—so we built a filter-powered
            kitchen companion that brings the perfect dish to your fingertips.”
          </p>
        </div>
        <div className="about-img">
          <img src={pancakeImg} alt="Stack of pancakes with syrup" />
        </div>
      </div>

      <section className="about-section">
        <h2 className="section-heading">Our Story</h2>
        <p>
          We believe cooking should be joyful, not a chore—so we built a
          filter-powered kitchen companion that takes the guesswork out of meal
          planning. By combining a global recipe library with intuitive filters
          for diet, cuisine, occasion, and prep time, we empower home cooks to
          instantly discover, customize, and whip up dishes that fit their
          tastes, lifestyles, and schedules—no more endless scrolling, just the
          perfect recipe at your fingertips.
        </p>
      </section>

      <section className="about-section">
        <h2 className="section-heading">Why We're Different</h2>
        <p>
          Our app stands out by putting you in complete control of discovery:
          our powerful filters let you mix and match tags—dietary preferences,
          cuisines, occasions, and prep times—to surface exactly the recipes you
          want; our global flavors library spans Sri Lankan curries, European
          pastries, Japanese street food, and beyond so you can satisfy any
          craving; and our mobile-first design ensures a streamlined, hands-free
          cooking experience right at your fingertips—whether you’re juggling
          pots on the stove or hunting for inspiration on the go.
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default About;
