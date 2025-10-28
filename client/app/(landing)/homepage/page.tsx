import React from "react";
import Hero from "./Hero";
import Container from "@/components/code/Container";
import Features from "./Features";
import Partners from "./Partners";
import Services from "./Services";

const Homepage = () => {
  return (
    <div>
      <Hero />
      <Container>
        <Partners />
        <Features />
        <Services />
      </Container>
    </div>
  );
};

export default Homepage;
