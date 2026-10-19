import { MotionConfig } from "motion/react";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { useRepoInfo } from "./lib/github";
import { Before } from "./sections/Before";
import { Contribute } from "./sections/Contribute";
import { Footer } from "./sections/Footer";
import { Matrix } from "./sections/Matrix";
import { Platforms } from "./sections/Platforms";
import { Privacy } from "./sections/Privacy";
import { VideoSection } from "./sections/VideoSection";

export default function App() {
  const info = useRepoInfo();
  return (
    <MotionConfig reducedMotion="user">
      <Nav info={info} />
      <main>
        <Hero info={info} />
        <Before />
        <VideoSection />
        <Matrix />
        <Privacy />
        <Platforms info={info} />
        <Contribute info={info} />
      </main>
      <Footer info={info} />
    </MotionConfig>
  );
}
