import React from "react";
import Hero from "./Hero";
import Container from "@/components/code/Container";
import Features from "./Features";

const Homepage = () => {
  return (
    <div>
      <Hero />
      <Container>
        <Features />
      </Container>
    </div>
  );
};

export default Homepage;
