import { useState, useEffect, useRef } from "react";
import "../styles/Home.css";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";

const Home = () => {
  const aboutRef = useRef(null);
  const { scrollY } = useScroll();

  // Detect when the "About" section is in view
  const [hideScrollDown, setHideScrollDown] = useState(false);

  useEffect(() => {
    window.history.scrollRestoration = "manual"; //Normally react forces the scroll position to where you left off, I did this because its a homepage "fresh start"
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (aboutRef.current) {
        const aboutPosition = aboutRef.current.getBoundingClientRect().top;
        setHideScrollDown(aboutPosition < window.innerHeight / 1.5); // Hide when it enters view
      }
    };

    //This is used to create an event listener for the scroll and then clean it up after unmounting
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Framer Motion animation for smooth opacity
  const scrollOpacity = useTransform(scrollY, 
    [0, window.innerHeight * 0.4],
    [1, 0]); // Fades out when scrolling down


  return (
    <div>
      <section className="intro-section">
        {/*Logo */}
        <motion.h1
          className="logo"
          initial={{ opacity: 0, x: 10 }} //Used this to make the initial position slightly to the right and the element non visible
          animate={{ opacity: 1, x: 0 }} //Then the element becomes visible and moves into the wanted position
          transition={{ duration: 3.5, ease: "easeIn" }}
        >
          aestha
        </motion.h1>
        <motion.h2
          className="motto"
          initial={{ opacity: 0, x: 10 }} //Used this to make the initial position slightly to the right and the element non visible
          animate={{ opacity: 1, x: 0 }} //Then the element becomes visible and moves into the wanted position
          transition={{ duration: 3.5, delay: 3.5, ease: "easeIn" }}
        >
          where today meets tomorrow</motion.h2>
      </section>

      <motion.div
        onClick={() => document.getElementById("about_aestha").scrollIntoView({ behavior: "smooth" })}
        className="scroll-down"
        style={{ opacity: hideScrollDown ? 0 : scrollOpacity }}
        initial={{ x: "-50%" }}
        animate={{
          y: [0, -10, 0], // Adds an extra downward movement
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2, // Slightly longer duration for a natural feel
          ease: "easeInOut",
        }}
      >
        ↓ SCROLL DOWN ↓
      </motion.div>


      <motion.div
        className="about"
        id="about_aestha"
        ref={aboutRef}
        initial={{ opacity: 0, y: 50 }} // Start hidden below
        whileInView={{ opacity: 1, y: 0 }} // Fade in when scrolled into view
        viewport={{ once: true }} // Only animates once
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h2>ABOUT AESTHA</h2>
        <p>Step into a world where fashion is ever-changing and inspiration awaits you daily.
          At Aestha, every visit brings you a fresh selection of randomly curated outfits from around the world, giving you a glimpse into global style trends.
          Whether you're here to discover new looks, get inspired, or stay updated with the latest fashion news, this space is designed to keep you ahead of the curve.
          Come back each day and see where fashion takes you next.</p>
      </motion.div>
      <div className="button-container">
      <a href="/explore">
        <motion.button
          className="explore-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >EXPLORE NOW</motion.button>
        </a>
      </div>
      <div>
      <Navbar />
      {/* Other page content */}
    </div>
    </div>
  );
};
export default Home;