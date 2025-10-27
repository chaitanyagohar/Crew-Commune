import React, { useState, useEffect, useRef } from "react";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useAnimation, // Added for CircularText
  useMotionValue, // Added for CircularText
} from "framer-motion";

import {
  Users,
  Medal,
  Briefcase,
  Clapperboard,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  Twitter,
  Instagram,
  Linkedin,
  Award,
  Target,
  TrendingUp,
  Globe,
  Phone,
  Mail,
} from "lucide-react";

/*
 * This is a single-file, MULTI-PAGE React application showcase.
 * It uses React State to simulate page navigation, allowing for
 * full-page animations with Framer motion.
*/

// --- Animation Variants ---

const loadingScreenVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, delay: 0.6 },
  },
};

const loadingTextVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.5,
    },
  },
};

// Page Transition Variants (Clip-path wipe)
const pageVariants = {
  initial: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
  },
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.1 },
  },
  exit: {
    clipPath: "inset(100% 0% 0% 0%)",
    transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
  },
};

// For staggering children elements
const staggerContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Fade in from bottom
const fadeInUpVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// For elements revealing on scroll
const scrollRevealVariants = {
  initial: { opacity: 0, y: 50 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0.0, 0.2, 1] },
  },
  viewport: { once: true, amount: 0.3 },
};

// --- Reusable Components ---

/**
 * Higher-Order Component to wrap each page with animation.
 */
const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="bg-[#111111]"
  >
    {children}
  </motion.div>
);

/**
 * AnimatedText Component (Word-by-word reveal)
 */
const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
  once = true,
  delay = 0,
}) => {
  const words = text.split(" ");

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    },
  };

  const wordVariants = {
    initial: { y: "100%" },
    animate: {
      y: 0,
      transition: { duration: 0.7, ease: "circOut" },
    },
  };

  return (
    <Wrapper className={className}>
      <motion.span
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: once, amount: 0.3 }}
        className="inline-block"
      >
        {words.map((word, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden align-bottom mr-[0.25em]"
          >
            <motion.span variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};

/**
 * NEW: AnimatedTextLines Component (Line-by-line reveal)
 */
const AnimatedTextLines = ({
  text,
  el: Wrapper = "h2",
  className,
  once = true,
  delay = 0,
}) => {
  const lines = text.split("\n");

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: delay,
      },
    },
  };

  const lineVariants = {
    initial: { y: "100%" },
    animate: {
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <Wrapper className={className}>
      <motion.span
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: once, amount: 0.3 }}
        className="inline-block"
      >
        {lines.map((line, index) => (
          <span key={index} className="block overflow-hidden">
            <motion.span variants={lineVariants} className="block">
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};

/**
 * MagneticButton Component (Effect Disabled)
 */
const MagneticButton = ({ children, strength = 30, ...props }) => {
  // All hooks, event handlers, and motion effects have been removed.
  // We return a simple div that accepts the props (like className)
  // to avoid breaking the layout.
  return <div {...props}>{children}</div>;
};

/**
 * Reusable component for Clip-Path Image Reveals
 */
const AnimatedImage = ({ src, alt, className = "" }) => {
  const variants = {
    initial: {
      clipPath: "inset(100% 0% 0% 0%)",
      scale: 1.1,
    },
    whileInView: {
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.6, 0.01, -0.05, 0.95],
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true, amount: 0.3 }}
      className={`w-full h-full ${className}`}
      data-cursor-hover="image"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src =
            "https://placehold.co/600x400/333333/555555?text=Image";
        }}
      />
    </motion.div>
  );
};

/**
 * ParallaxImage Component
 */
const ParallaxImage = ({ src, alt, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div
      ref={ref}
      className={`w-full h-full overflow-hidden rounded-xl ${className}`}
      data-cursor-hover="image"
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ y }}
        onError={(e) => {
          e.target.src =
            "https://placehold.co/600x400/333333/555555?text=Image";
        }}
      />
    </div>
  );
};
/**
 * NEW: MobileHeroGapSlideshow Component
 * Replicates the "cross-fade with scale" animation from the new video.
 */
const MobileHeroGapSlideshow = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // This interval cycles to the next image every 2.5 seconds
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 700); // 0.7-second interval

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  return (
    // Add overflow-hidden to the container to clip the animation
    <div className="relative w-full h-full overflow-hidden ">
      <AnimatePresence>
        <motion.img
          key={index} // This is crucial for AnimatePresence
          src={images[index].src}
          alt={images[index].alt}
          initial={{ opacity: 0, scale: 1 }} // Start slightly zoomed in
          animate={{
            opacity: 1,
            scale: 1, // Settle to 1
            transition: { duration: 0.7, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            scale: 1, // Shrink out
            transition: { duration: 0.5, ease: "easeIn" },
          }}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/300x200/333333/555555?text=Image";
          }}
        />
      </AnimatePresence>
    </div>
  );
};

/**
 * Accordion (FAQ) Component
 */
const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border-b border-neutral-800"
      layout
      onClick={() => setIsOpen(!isOpen)}
    >
      <motion.div
        className="flex justify-between items-center py-6 cursor-pointer"
        data-cursor-hover="link"
      >
        <h3 className="text-xl font-medium text-[#F5F5F5]">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={24} className="text-neutral-500" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: { duration: 0.4, ease: "easeInOut" },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            className="pb-6"
          >
            <p className="text-neutral-400 text-base leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// NEW COMPONENT: Service Differentiator (Used on Services Page)
const ServiceDifferentiator = ({ stat, label, description }) => (
  <motion.div
    className="bg-neutral-900/50 border-r border-b border-neutral-800 p-8 text-center"
    variants={scrollRevealVariants}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, amount: 0.3 }}
  >
    <h3 className="text-6xl font-extrabold text-[#BFFF00] mb-2">{stat}</h3>
    <p className="text-xl font-semibold mb-2">{label}</p>
    <p className="text-neutral-400 text-sm">{description}</p>
  </motion.div>
);

// --- Hero Section Components (From previous step) ---

// DATA: 6 follow-up images for the Hero section
// FEEDBACK #1: Replace these URLs with images of Indian people
const heroImages = [
  {
    src: "./cricket.webp", // <-- REPLACE
    alt: "cricket",
    width: "250px",
    height: "350px",
    xOffset: -100, // Initial X offset from center
    yOffset: 0, // Initial Y offset from center
    rotate: -15, // Initial rotation
  },
  {
    src: "./basket.webp", // <-- REPLACE
    alt: "Basketball court branding",
    width: "300px",
    height: "200px",
    xOffset: 150,
    yOffset: -50,
    rotate: 10,
  },
  {
    src: "./merchhero.jpeg", // <-- REPLACE
    alt: "Merchandise design",
    width: "200px",
    height: "280px",
    xOffset: -250,
    yOffset: 150,
    rotate: 5,
  },
  {
    src: "./tennis.png", // <-- REPLACE
    alt: "tennis",
    width: "350px",
    height: "300px",
    xOffset: 300,
    yOffset: 100,
    rotate: -8,
  },
  {
    src: "./Usain-Bolt.jpg", // <-- REPLACE
    alt: "Crowd at a live event",
    width: "350px",
    height: "250px",
    xOffset: -50,
    yOffset: -150,
    rotate: 12,
  },
  {
    src: "./volley.png", // <-- REPLACE
    alt: "Branded running shoes",
    width: "250px",
    height: "280px",
    xOffset: -350,
    yOffset: -50,
    rotate: -5,
  },
];

const ImageFollower = ({ img, index }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Use spring for smooth, delayed following effect
  const springConfig = {
    type: "spring",
    stiffness: 50,
    damping: 10,
    mass: 0.8,
  };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    // 1. Image following cursor (magnetic-like effect on the image itself)
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      // Calculate the center of the image group's container (the whole hero section)
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate movement relative to the center
      const offsetX = (clientX - centerX) * 0.05; // Less aggressive follow
      const offsetY = (clientY - centerY) * 0.05;

      // Apply initial offset + cursor offset
      springX.set(img.xOffset + offsetX);
      springY.set(img.yOffset + offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [img.xOffset, img.yOffset, springX, springY]);

  // 2. Animation variants for image enter/exit and hover
  const variants = {
    initial: {
      x: img.xOffset,
      y: img.yOffset,
      rotate: img.rotate,
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      x: img.xOffset,
      y: img.yOffset,
      rotate: img.rotate,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1],
        delay: 1 + index * 0.1, // Staggered entry after the main text animation
      },
    },
    hover: {
      scale: 1.05,
      zIndex: 100, // Bring to front
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
      rotate: img.rotate + (img.rotate > 0 ? 5 : -5), // Subtle extra rotation
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{
        width: img.width,
        height: img.height,
        position: "absolute",
        // Apply spring values for dynamic following
        translateX: springX,
        translateY: springY,
      }}
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="hidden md:block overflow-hidden rounded-xl shadow-2xl transition-all duration-300 transform-gpu cursor-pointer"
      data-cursor-hover="image"
    >
      <img
        src={img.src}
        alt={img.alt}
        className={`w-full h-full object-cover transition-all duration-500`}
        onError={(e) => {
          e.target.src =
            "https://placehold.co/300x400/333333/555555?text=Image";
        }}
      />
    </motion.div>
  );
};

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 4000; // 4 seconds
    const interval = duration / 100;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      setProgress(current);
      if (current >= 100) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const loadingScreenVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  const loadingTextVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={loadingScreenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/crewload.mp4" type="video/mp4" />
      </video>

      {/* Solid Green Overlay (70% opacity) */}
      <div className="absolute inset-0 bg-[#BFFF00]/70"></div>

      {/* Central Text */}
      <motion.div
        variants={loadingTextVariants}
        className="relative text-4xl md:text-5xl font-extrabold text-black tracking-widest"
      >
        CREW COMMUNE
      </motion.div>

      {/* Bottom-Right Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-6 right-8 text-black text-lg font-semibold"
      >
        {progress}%
      </motion.div>
    </motion.div>
  );
};

/**
 * 2. Header Component
 */
const Header = ({ setPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Services", page: "services" },
    { name: "About", page: "about" },
    { name: "Events", page: "events" },
  ];

  const handleNavClick = (page) => {
    window.scrollTo(0, 0);
    setPage(page);
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-[#1C1C1C]/80 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <MagneticButton strength={40}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onClick={() => handleNavClick("home")}
              className="text-2xl font-bold text-[#F5F5F5] cursor-pointer"
              data-cursor-hover="link"
            >
              CREW COMMUNE
            </motion.div>
          </MagneticButton>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <MagneticButton key={item.name} strength={25}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.page)}
                  data-cursor-hover="link"
                  className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-[#F5F5F5] transition-colors"
                >
                  {item.name}
                </motion.button>
              </MagneticButton>
            ))}
            <MagneticButton strength={25}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick("contact")}
                data-cursor-hover="link"
                className="ml-4 px-5 py-2 text-sm font-medium bg-[#BFFF00] text-black rounded-full"
              >
                Get In Touch
              </motion.button>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MagneticButton strength={25}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                data-cursor-hover="link"
                className="text-[#F5F5F5]"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </MagneticButton>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="bg-[#1C1C1C]/80 backdrop-blur-lg border border-neutral-700 rounded-2xl shadow-lg p-4 space-y-2 m-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.page)}
                  data-cursor-hover="link"
                  className="block w-full text-left px-4 py-3 text-base font-medium text-neutral-300 hover:text-[#F5F5F5] hover:bg-neutral-800 rounded-lg"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => handleNavClick("contact")}
                data-cursor-hover="link"
                className="mt-2 block w-full text-left px-4 py-3 text-base font-medium bg-[#BFFF00] text-black rounded-lg"
              >
                <span>Get In Touch</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

/**
 * Marquee Component
 */
const Marquee = ({ text, speed = 20 }) => {
  const { scrollY } = useScroll();
  // Slower movement on scroll
  const x = useTransform(scrollY, [0, 1000], ["0%", "-10%"], { clamp: false });

  return (
    <div className="relative w-full h-24 md:h-32 overflow-hidden bg-black text-[#F5F5F5] border-y-2 border-neutral-800">
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex items-center"
        style={{ x }} // Apply horizontal scroll parallax
      >
        <motion.div
          className="flex whitespace-nowrap items-center text-4xl md:text-6xl font-bold uppercase"
          animate={{
            x: ["0%", "-100%"],
          }}
          transition={{
            ease: "linear",
            duration: speed,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <span className="mx-8">{text}</span>
          <span className="mx-8">{text}</span>
          <span className="mx-8">{text}</span>
          <span className="mx-8">{text}</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

/**
 * 3. Footer Component
 */
const Footer = ({ setPage }) => {
  const handleNavClick = (page) => {
    window.scrollTo(0, 0);
    setPage(page);
  };

  return (
    <footer className="bg-[#111111] text-neutral-400 py-16 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4">
            CREW COMMUNE
          </h3>
          <p className="text-sm mb-4">
            Innovating Success. Empowering Athletes.
          </p>
          <div className="flex space-x-4">
            <MagneticButton strength={20}>
              <a
                href="#"
                className="hover:text-[#F5F5F5]"
                data-cursor-hover="link"
              >
                <Twitter size={20} />
              </a>
            </MagneticButton>
            <MagneticButton strength={20}>
              <a
                href="#"
                className="hover:text-[#F5F5F5]"
                data-cursor-hover="link"
              >
                <Instagram size={20} />
              </a>
            </MagneticButton>
            <MagneticButton strength={20}>
              <a
                href="#"
                className="hover:text-[#F5F5F5]"
                data-cursor-hover="link"
              >
                <Linkedin size={20} />
              </a>
            </MagneticButton>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#F5F5F5] mb-3">Menu</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <MagneticButton strength={15}>
                <button
                  onClick={() => handleNavClick("services")}
                  className="hover:text-[#F5F5F5]"
                  data-cursor-hover="link"
                >
                  Services
                </button>
              </MagneticButton>
            </li>
            <li>
              <MagneticButton strength={15}>
                <button
                  onClick={() => handleNavClick("about")}
                  className="hover:text-[#F5F5F5]"
                  data-cursor-hover="link"
                >
                  About
                </button>
              </MagneticButton>
            </li>
            <li>
              <MagneticButton strength={15}>
                <button
                  onClick={() => handleNavClick("events")}
                  className="hover:text-[#F5F5F5]"
                  data-cursor-hover="link"
                >
                  Events
                </button>
              </MagneticButton>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[#F5F5F5] mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <MagneticButton strength={15}>
                <a
                  href="#"
                  className="hover:text-[#F5F5F5]"
                  data-cursor-hover="link"
                >
                  Careers
                </a>
              </MagneticButton>
            </li>
            <li>
              <MagneticButton strength={15}>
                <button
                  onClick={() => handleNavClick("contact")}
                  className="hover:text-[#F5F5F5]"
                  data-cursor-hover="link"
                >
                  Contact
                </button>
              </MagneticButton>
            </li>
            <li>
              <MagneticButton strength={15}>
                <a
                  href="#"
                  className="hover:text-[#F5F5F5]"
                  data-cursor-hover="link"
                >
                  Privacy
                </a>
              </MagneticButton>
            </li>
          </ul>
        </div>

        <div className="col-span-2">
          <h4 className="font-semibold text-[#F5F5F5] mb-3">
            Join the newsletter
          </h4>
          <p className="text-sm mb-3">
            Get the latest on events and innovations.
          </p>
          {/* FEEDBACK #4: Added preventDefault to stop page reload */}
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-l-md text-sm text-[#F5F5F5] focus:outline-none focus:border-[#BFFF00]"
              data-cursor-hover="link"
            />
            <MagneticButton strength={20}>
              <button
                type="submit"
                className="px-3 py-2 bg-[#BFFF00] text-black rounded-r-md text-sm font-medium"
                data-cursor-hover="link"
              >
                <ArrowRight size={20} />
              </button>
            </MagneticButton>
          </form>
        </div>
      </div>

      <div className="mt-12 border-t border-neutral-800 pt-8 text-center text-sm">
        <p>© {new Date().getFullYear()} Crew Commune. All rights reserved.</p>
      </div>
    </footer>
  );
};
/**
 * 4. Home Page (UPDATED with Centered Services & new CTA)
 */
const HomePage = ({ setPage }) => {
  // Services array (UPDATED: "Athlete Management" removed)
  const services = [
    {
      title: "Sports Event Management",
      icon: Medal,
      desc: "From planning to execution, we deliver memorable, high-octane events.",
      img: "ser2.jpg", // <-- REPLACE
    },
    {
      title: "Media Management",
      icon: Users,
      desc: "Elevating your online presence with tailored strategies, creative content, and analytics.",
      img: "./ser3.jpeg", // <-- REPLACE
    },
    {
      title: "Design Services",
      icon: Globe,
      desc: "Custom apparel and merchandise that connects your brand with your community.",
      img: "./merchandise.webp", // <-- REPLACE
    },
    {
      title: "Corporate Sports Events",
      icon: Award,
      desc: "Boost team morale and brand visibility with professionally managed corporate sports.",
      img: "./coorporateevents.jpg", // <-- REPLACE
    },
  ];

  // Use all 6 images for the slideshow
  const mobileSlideshowImages = [
    heroImages[0], // cricket
    heroImages[1], // basket
    heroImages[2], // merch
    heroImages[3], // tennis
    heroImages[4], // Usain-Bolt
    heroImages[5], // volley
  ];

  // --- NEW ANIMATION VARIANTS FOR VIDEO EFFECT (Corrected Timing) ---
  const mobileHeroContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      // No stagger, we will use absolute delays
    },
  };

  const textInnovatingVariants = {
    initial: { y: 0, scale: 0.5, opacity: 0 }, // Start centered, small
    animate: {
      y: -110, // Moves UP
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1],
        delay: 1.0, // Wait 1s after loader
      },
    },
  };

  const textSuccessVariants = {
    initial: { y: 0, scale: 0.5, opacity: 0 }, // Start centered, small
    animate: {
      y: 110, // Moves DOWN
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0.0, 0.2, 1],
        delay: 1.0, // Wait 1s (same as "INNOVATING")
      },
    },
  };

  const slideshowVariants = {
    initial: { scale: 0, opacity: 0 }, // Start centered, invisible
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 1.1, // Start 0.1s AFTER the text starts splitting
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };
  // --- END NEW VARIANTS ---

  return (
    <PageWrapper>
      {/* Hero Section */}
      <motion.section
        initial="initial"
        animate="animate"
        className="relative h-[100vh] flex items-center justify-center text-center overflow-hidden bg-black"
      >
        {/* Layer 1: Background Video (z-0) */}
        <motion.div
          className="absolute inset-0 z-0 opacity-30"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
        >
          <video
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            src="./crewhero.mp4"
            poster="https://images.unsplash.com/photo-1506146332389-18140e7f702d?w=800&auto-format&fit=crop&q=60"
          />
        </motion.div>

        {/* Layer 2: Desktop Image Followers (z-auto) */}
        {/* This is correct, no wrapper needed */}
        {heroImages.map((img, index) => (
          <ImageFollower key={index} img={img} index={index} />
        ))}

        {/* Layer 3: Text Content (z-20) */}
        <div className="relative z-20 max-w-4xl px-4 pointer-events-none">
          {/* --- DESKTOP HERO TEXT --- */}
          {/* This uses your original word-by-word animation, hidden on mobile */}
          <div className="hidden md:block">
            <AnimatedText
              text="INNOVATING"
              el="span"
              className="block text-6xl sm:text-8xl font-extrabold text-white"
              delay={0.8}
              variants={{
                animate: { y: [50, 0], opacity: [0, 1], scale: [0.8, 1] },
              }}
            />
            <AnimatedText
              text="SUCCESS."
              el="span"
              className="block text-[#BFFF00] text-6xl sm:text-8xl font-extrabold"
              delay={1.2}
            />
          </div>

          {/* --- NEW MOBILE HERO TEXT (Video Style) --- */}
          {/* This container centers all the animating elements */}
          <motion.div
            className="md:hidden flex flex-col items-center justify-center relative h-80" // Set a height for the absolute elements
            variants={mobileHeroContainerVariants}
            initial="initial"
            animate="animate"
          >
            {/* "INNOVATING" text line, starts centered */}
            <motion.span
              variants={textInnovatingVariants}
              className="block text-6xl font-extrabold text-white absolute z-20"
            >
              INNOVATING
            </motion.span>

            {/* Slideshow is absolutely positioned in the middle (z-10) */}
            <motion.div
              className="w-[70vw] h-[25vh] rounded-xl shadow-2xl pointer-events-auto absolute z-10"
              variants={slideshowVariants}
            >
              <MobileHeroGapSlideshow images={mobileSlideshowImages} />
            </motion.div>

            {/* "SUCCESS." text line, starts centered */}
            <motion.span
              variants={textSuccessVariants}
              className="block text-6xl font-extrabold text-[#BFFF00] absolute z-20"
            >
              SUCCESS.
            </motion.span>
          </motion.div>
        </div>

        {/* --- NEW: Layer 4: Circular Text (z-20) --- */}
        {/* UPDATED: Wrapper is full-width (left-0 right-0) and component centers itself with mx-auto */}
        <motion.div
          className="absolute bottom-12 left-0 right-0 z-20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 0.6 }}
          transition={{ delay: 2.0, duration: 0.8 }} // Fade in after main hero text
          data-cursor-hover="link"
        >
          <CircularText
            text="SCROLL*DOWN*EXPLORE*"
            onHover="speedUp"
            spinDuration={12}
            // Use Tailwind for styling
            className="text-[#BFFF00] uppercase text-xs font-bold"
          />
        </motion.div>
      </motion.section>

      {/* Marquee Section (UPDATED to remove Athlete Management) */}
      <Marquee
        text="Corporate Sports Events • Media Management • Sports Event Management • Design Services •"
        speed={40}
      />

      {/* Philosophy Section */}
      <section className="py-20 md:py-32 bg-black text-[#F5F5FF]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedTextLines
            text={"WE CONNECT BRANDS & ATHLETES\nTO THEIR COMMUNITIES."}
            el="h2"
            className="text-4xl md:text-6xl font-bold leading-tight"
          />
          <motion.p
            variants={scrollRevealVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
            className="text-lg text-neutral-400 max-w-2xl mx-auto mt-8"
          >
            We turn bold ideas into reality. Through expert Media Management,
            exciting Sports Events, and dedicated Athlete Management, we build
            legacies and create experiences that resonate long after the game
            is over.
          </motion.p>
        </div>
      </section>

      {/* Services Preview - ENHANCED Large Card Layout */}
      <section className="py-20 md:py-32 bg-[#111111] text-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Our Core Expertise"
            el="h2"
            className="text-3xl font-bold text-center sm:text-4xl mb-16"
          />

          {/* --- UPDATED GRID ---
              Changed md:grid-cols-3 lg:grid-cols-5 to md:grid-cols-4
              This makes a 2x2 grid on small/medium and a 1x4 grid on large,
              which perfectly centers the 4 service items.
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="group relative h-[450px] overflow-hidden rounded-3xl cursor-pointer shadow-xl transition-all duration-300 hover:shadow-2xl"
                variants={scrollRevealVariants}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  ease: [0.4, 0.0, 0.2, 1],
                  delay: index * 0.1,
                }}
                onClick={() => setPage("services")}
                data-cursor-hover="image"
              >
                {/* Background Image */}
                <img
                  src={service.img}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x450/1C1C1C/BFFF00?text=Service";
                  }}
                />

                {/* Overlay Gradient (Ensures text contrast) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-colors duration-500 group-hover:from-black/90"></div>

                {/* Content Overlay */}
                <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                  <service.icon className="w-12 h-12 text-[#BFFF00] mb-4 transition-transform duration-500 group-hover:translate-y-[-5px]" />
                  <h3 className="text-3xl font-bold text-[#F5F5F5] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-neutral-300 text-base mb-4 opacity-80">
                    {service.desc}
                  </p>
                  {/* CTA on hover */}
                  <motion.div
                    className="flex items-center text-[#BFFF00] font-semibold text-sm mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Learn More <ArrowRight size={18} className="ml-2" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Athlete Highlight */}
      <section className="bg-black text-[#F5F5F5] py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="h-full min-h-[400px] rounded-2xl overflow-hidden"
            variants={scrollRevealVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
          >
            <ParallaxImage
              src="./athlete-home.jpg" // <-- REPLACE
              alt="Athlete running"
              className="h-full"
            />
          </motion.div>
          <motion.div
            variants={scrollRevealVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-sm font-bold text-[#BFFF00] uppercase tracking-widest">
              Athlete Management Spotlight
            </span>
            <AnimatedText
              text="From Local Hero to Global Icon: Our Athlete Success."
              el="h2"
              className="text-3xl sm:text-4xl font-bold my-4"
            />
            <p className="text-lg text-neutral-400 mb-6">
              We take raw talent and craft a lasting legacy. Our hands-on
              approach covers media training, brand endorsement deals, financial
              guidance, and career trajectory planning. We focus on securing
              partnerships that align with the athlete's authentic values.
            </p>
            <ul className="space-y-3 text-neutral-300">
              <li className="flex items-center">
                <ArrowRight size={20} className="text-[#BFFF00] mr-3" />
                Secured 15+ Major Brand Deals
              </li>
              <li className="flex items-center">
                <ArrowRight size={20} className="text-[#BFFF00] mr-3" />
                Managed 3 Olympic-level Athletes
              </li>
              <li className="flex items-center">
                <ArrowRight size={20} className="text-[#BFFF00] mr-3" />
                Increased Social Reach by 200% on average
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* --- NEW CTA SECTION --- 
          Added this section to add more scroll length
          and provide a clear call-to-action to the contact page.
      */}
      <section className="py-20 md:py-32 bg-[#111111] text-[#F5F5F5]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedText
            text="Ready to Start Your Journey?"
            el="h2"
            className="text-3xl sm:text-4xl font-bold mb-6"
          />
          <motion.p
            variants={scrollRevealVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
            className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10"
          >
            Let's collaborate to create unforgettable experiences and elevate
            your brand to the next level. Get in touch with our team today to
            discuss your vision.
          </motion.p>
          <MagneticButton strength={25}>
            <motion.button
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={() => {
                window.scrollTo(0, 0);
                setPage("contact");
              }}
              className="text-lg font-semibold text-[#BFFF00] flex items-center space-x-2 mx-auto"
              data-cursor-hover="link"
            >
              <span>Get In Touch</span>
              <ArrowRight size={20} />
            </motion.button>
          </MagneticButton>
        </div>
      </section>

      {/* Founder CTA (COMMENTED OUT) */}
      {/* <section className="py-20 md:py-32 bg-[#111111] text-[#F5F5F5]">
  ...
      </section> */}
    </PageWrapper>
  );
};
// NEW COMPONENT: Milestone for About Page Scroll
const Milestone = ({ year, title, description, isRight }) => (
  <motion.div
    className="relative grid grid-cols-1 md:grid-cols-2 gap-8 py-8"
    variants={scrollRevealVariants}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, amount: 0.3 }}
  >
    {/* Year/Title Column (Left on left, Right on right) */}
    <div
      className={`md:pr-8 ${
        isRight ? "md:order-2 md:text-left" : "md:text-right"
      }`}
    >
      <h3 className="text-5xl font-extrabold text-[#BFFF00]">{year}</h3>
      <h4 className="text-2xl font-semibold mt-2 text-[#F5F5F5]">{title}</h4>
    </div>

    {/* Description Column */}
    <div
      className={`md:pl-8 border-l-2 border-neutral-800 relative ${
        isRight ? "md:order-1" : ""
      }`}
    >
      <div className="absolute w-4 h-4 rounded-full bg-[#BFFF00] -left-2 top-11"></div>
      <p className="text-lg text-neutral-400 pt-12 md:pt-2">{description}</p>
    </div>
  </motion.div>
);

/**
 * 6. About Page (Founder's Story)
 */
const AboutPage = () => {
  const values = [
    {
      title: "Authenticity",
      desc: "We build brands that are real. No shortcuts, no compromises. Just genuine connection.",
      icon: Target,
    },
    {
      title: "Impact",
      desc: "We aim for work that doesn't just get seen, but gets felt. We create ripples that last.",
      icon: TrendingUp,
    },
    {
      title: "Innovation",
      desc: "The status quo is our starting line, not our finish. We are relentlessly curious and strategic.",
      icon: Award,
    },
    {
      title: "Community",
      desc: "Building vibrant connections between brands, athletes, and their dedicated fan bases.",
      icon: Users,
    },
  ];

  // FEEDBACK #1: Replace these images with Indian team members or diverse stock photos
  const team = [
    {
      name: "Alex Johnson", // <-- REPLACE (Generic stock name)
      role: "Founder & CEO",
      img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=400&q=80", // <-- REPLACE
    },
    {
      name: "Priya Singh", // <-- REPLACE (Generic stock name)
      role: "Head of Events",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", // <-- REPLACE
    },
    {
      name: "Mike Smith", // <-- REPLACE (Generic stock name)
      role: "Creative Director",
      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80", // <-- REPLACE
    },
    {
      name: "Sarah Chen", // <-- REPLACE (Generic stock name)
      role: "Head of Social",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80", // <-- REPLACE
    },
  ];

  const milestones = [
    {
      year: 2008,
      title: "The Foundation: Global Agency Career",
      desc: "The founder begins a 15-year career, leading strategic campaigns for top-tier international sports and lifestyle brands, gaining unparalleled expertise in the global arena.",
    },
    {
      year: 2018,
      title: "Specialization in Athlete Branding",
      desc: "Shifting focus to athlete management, mastering contract negotiations, endorsements, and building powerful personal brand narratives that transcend sport.",
    },
    {
      year: 2023,
      title: "Crew Commune is Launched",
      desc: "The agency is officially founded to merge world-class strategy with boutique agility, concentrating on the Indian sports and media market with a global outlook.",
    },
    {
      year: 2024,
      title: "First Major Sporting Event Managed",
      desc: "Successfully executing a high-profile national marathon event, solidifying Crew Commune's reputation for flawless on-ground event management and logistics.",
    },
    {
      year: "Today",
      title: "A Growing Community",
      desc: "Expanding our 'Crew' of managed athletes, increasing our brand portfolio, and continuing to innovate in media management and custom merchandise for community engagement.",
    },
  ];

  return (
    <PageWrapper>
      <header className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-[#F5F5F5] text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-black z-0 overflow-hidden"
          data-cursor-hover="image"
        >
          {/* FEEDBACK #1: Replace this image */}
          <ParallaxImage
            src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" // <-- REPLACE
            alt="Founder portrait"
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>

        <motion.div
          className="relative z-10 p-4"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.span
            variants={fadeInUpVariants}
            className="text-sm font-bold text-[#BFFF00] uppercase tracking-widest"
          >
            Our Foundation
          </motion.span>
          {/* FEEDBACK #5: Simplified Headline */}
          <AnimatedText
            text="DRIVEN BY PASSION.
DEFINED BY RESULTS."
            el="h1"
            className="text-5xl sm:text-7xl font-extrabold tracking-tighter my-4"
            delay={0.5}
          />
          {/* FEEDBACK #5: Simplified Content */}
          <motion.p
            variants={fadeInUpVariants}
            className="max-w-2xl mx-auto text-lg text-neutral-300"
          >
            We saw a need for an agency that operates as a true partner. Our
            foundation is built on 15+ years of global industry experience,
            tailored for the Indian market.
          </motion.p>
        </motion.div>
      </header>

      <section className="py-20 md:py-32 bg-[#111111] text-[#F5F5F5]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-lg">
          <motion.div
            variants={scrollRevealVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* FEEDBACK #5: Simplified Headline */}
            <AnimatedText
              text="Our Mission: Your True Partner"
              el="h2"
              className="text-3xl font-bold mb-6"
            />
            {/* FEEDBACK #5: Simplified Content */}
            <p className="mb-6 text-neutral-300">
              Crew Commune was created to fill a gap in the market. We are not
              just a service provider; we are an extension of your team. We
              leverage our deep expertise in Media, Events, and Athlete
              Management to build your legacy.
            </p>
            <p className="mb-6 text-neutral-300">
              Our vision is to be the leading force in creating innovative
              partnerships that build vibrant, lasting communities. We don't
              just execute; we partner, strategize, and deliver.
            </p>
            <p className="font-semibold text-[#F5F5F5]">
              - Alex Johnson, Founder
              {/* FEEDBACK #1: Replaced placeholder name */}
            </p>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION: Experience Timeline */}
      <section className="py-20 md:py-32 bg-black text-[#F5F5F5]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Our Journey & Milestones"
            el="h2"
            className="text-3xl font-bold text-center sm:text-4xl mb-16"
          />
          <div className="space-y-4">
            {milestones.map((item, index) => (
              // Alternate layout for better visual flow
              <Milestone
                key={index}
                year={item.year}
                title={item.title}
                description={item.desc}
                isRight={index % 2 !== 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 md:py-32 bg-[#111111] text-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Our Core Values"
            el="h2"
            className="text-3xl font-bold text-center sm:text-4xl mb-16"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {values.map((item, index) => (
              <motion.div
                key={index}
                className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl text-center"
                variants={scrollRevealVariants}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  ease: [0.4, 0.0, 0.2, 1],
                  delay: index * 0.1,
                }}
              >
                <div className="mb-4">
                  <item.icon className="w-10 h-10 text-[#BFFF00] mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-neutral-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="py-20 md:py-32 bg-black text-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Meet The Crew"
            el="h2"
            className="text-3xl font-bold text-center sm:text-4xl mb-16"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={scrollRevealVariants}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  ease: [0.4, 0.0, 0.2, 1],
                  delay: index * 0.1,
                }}
              >
                <div className="overflow-hidden rounded-full w-32 h-32 md:w-48 md:h-48 mx-auto mb-4">
                  <ParallaxImage
                    src={member.img}
                    alt={member.name}
                    className="grayscale group-hover:grayscale-0"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-[#BFFF00]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

/**
 * 5. Services Page (ENHANCED VISUAL LAYOUT)
 */
// FEEDBACK #4: Added `setPage` prop
const ServicesPage = ({ setPage }) => {
  // FEEDBACK #1: Replace these image URLs
  // FEEDBACK #7: Added "Corporate Sports Events"
  const services = [
    {
      title: "Sports Event Management",
      desc: "Bring your vision to life with our cutting-edge event solutions. From planning to execution, we deliver memorable sports events that inspire and engage. We handle conceptualization, venue selection, sponsorship management, and flawless on-ground execution.",
      icon: Medal,
      img: "./sports.jpeg", // <-- REPLACE
    },
    // {
    //   title: "Athlete Management",
    //   desc: "We’re more than just managers – we’re partners in your journey to success. Our personalized approach helps athletes unlock their full potential. Services include talent scouting, brand partnerships, contract negotiations, and long-term career development.",
    //   icon: Briefcase,
    //   img: "./athlete.png", // <-- REPLACE
    // },
     {
      title: "Corporate Sports Events",
      desc: "Boost team morale and brand visibility with our professionally managed corporate sports days, tournaments, and wellness programs. We handle everything from venue booking to activity planning for a seamless, engaging employee experience.",
      icon: Award,
      img: "./coorporateevents.jpg", // <-- REPLACE (Add this new image)
    },
    {
      title: "Media Management",
      desc: "Elevate your online presence with our expert strategies tailored to your brand. From content creation to analytics, we ensure your audience stays engaged and your brand stays ahead of the curve. This includes platform optimization, creative content, and paid campaigns.",
      icon: Users,
      img: "./media.jpg", // <-- REPLACE
    },
    {
      title: "Merchandise & Design Services",
      desc: "From trendy apparel to exclusive memorabilia, our merchandise is designed to capture the essence of every event and brand. We offer custom design, online & on-site sales management, and full branding & packaging solutions.",
      icon: Globe,
      img: "./merchandise.webp", // <-- REPLACE
    },
   
  ];

  const differentiators = [
    {
      stat: "15+",
      label: "Years of Elite Experience",
      description:
        "Our founder's background spans top-tier global agencies and brands.",
    },
    {
      stat: "4.8K",
      label: "Media Impressions (Avg.)",
      description:
        "Generating significant media buzz for every major event managed.",
    },
    {
      stat: "100%",
      label: "In-House Production",
      description:
        "From content to logistics, we manage everything without third-party bottlenecks.",
    },
    {
      stat: "24/7",
      label: "Strategic Partnership",
      description:
        "We are an extension of your team, providing round-the-clock support and agility.",
    },
  ];

  const faqs = [
    {
      question: "What is Crew Commune's core area of expertise?",
      answer:
        "We are a powerhouse that merges the dynamic worlds of sports, branding, and community building. Our core expertise lies in Media Management, Sports Event Management, and Athlete Management, focusing on creating authentic and lasting impact.",
    },
    {
      question: "How do you measure the success of an event or campaign?",
      answer:
        "Success is unique to each client. We establish clear KPIs before any project begins, whether that's audience growth, engagement rates, ticket sales, media impressions, or brand sentiment. We provide transparent, data-driven reports to track progress.",
    },
    {
      question: "What kind of clients do you work with?",
      answer:
        "We partner with ambitious brands and individuals who want to build a lasting legacy. Our expertise is particularly strong in sports, entertainment, and lifestyle, but our principles of building authentic culture apply to any industry.",
    },
    {
      question: "What's the difference between Sports and Corporate Events?",
      answer:
        "Our 'Sports Event Management' focuses on large-scale, public-facing events like marathons or tournaments. 'Corporate Sports Events' are private, internal-facing events designed for companies to boost employee engagement, team building, and brand morale.",
    },
  ];

  return (
    <PageWrapper>
      <header className="pt-40 pb-20 bg-black text-[#F5F5F5]">
        <AnimatedText
          text="Our Services"
          el="h1"
          className="text-5xl font-bold text-center"
          delay={0.5}
        />
        {/* FEEDBACK #5: Simplified Content */}
        <AnimatedText
          text="Expert services to elevate your brand, manage your talent, and create unforgettable events."
          el="p"
          className="text-xl text-neutral-400 text-center mt-4"
          delay={0.7}
        />
      </header>

      {/* Differentiators */}
      <section className="bg-[#111111] text-[#F5F5F5] border-b-2 border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-800">
          {differentiators.map((item, index) => (
            <ServiceDifferentiator key={index} {...item} />
          ))}
        </div>
      </section>

      {/* ENHANCED SERVICES LIST: Large Images & Overlapping Text Blocks */}
      <section className="py-20 bg-black text-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-32">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={scrollRevealVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              {/* 1. Large Image Block with Parallax (Image Dominance) */}
              <div
                className={`overflow-hidden rounded-3xl mb-8 h-[55vh] relative ${
                  index % 2 === 0 ? "md:mr-24" : "md:ml-24"
                }`}
                data-cursor-hover="image"
              >
                <ParallaxImage
                  src={service.img}
                  alt={service.title}
                  // Scale up slightly on group hover for visual appeal
                  className="h-full group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
              </div>

              {/* 2. Text Content Block (Placed slightly below and offset, using z-index) */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`p-8 md:p-12 z-10 relative bg-neutral-900 border border-neutral-800 rounded-3xl shadow-xl ${
                  index % 2 === 0 ? "md:ml-24" : "md:mr-24"
                } -mt-20 md:-mt-28`}
              >
                <service.icon className="w-12 h-12 text-[#BFFF00] mb-4" />
                <h2 className="text-4xl font-bold mb-4">{service.title}</h2>
                <p className="text-xl text-neutral-400 mb-8">{service.desc}</p>
                <MagneticButton strength={25}>
                  {/* FEEDBACK #4: Made CTA functional */}
                  <button
                    className="px-6 py-2 text-md font-semibold bg-[#BFFF00] text-black rounded-full flex items-center"
                    data-cursor-hover="link"
                    onClick={() => setPage("contact")}
                  >
                    Discuss {service.title}{" "}
                    <ArrowRight size={20} className="ml-2" />
                  </button>
                </MagneticButton>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-[#111111] text-[#F5F5F5]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Frequently Asked Questions"
            el="h2"
            className="text-3xl font-bold text-center sm:text-4xl mb-16"
          />
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

const EventsPage = ({ setPage }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // 🟢 UPCOMING EVENTS (Only 2)
  const upcomingEvents = [
    {
      title: "Pune Twin City Marathon",
      date: "Feb 08, 2026",
      location: "Pune, IN",
      desc: "A grand-scale marathon connecting Pune and PCMC — empowering fitness, unity, and community spirit.",
      category: "Running",
      img: "./punetwincity.jpg",
      registerLink: "/register", // 🔗 Change to your form page or Google Form link
    },
    {
      title: "Udaan Nari Shakti Run",
      date: "Mar 10, 2026",
      location: "New Delhi, IN",
      desc: "A women’s empowerment event celebrating strength, resilience, and equality through fitness and sports.",
      category: "Running",
      img: "./udaannari.jpg",
      registerLink: "/register", // 🔗 Same here
    },
  ];

  // ⚫ PAST EVENTS
  const pastEvents = [
    {
      title: "Mumbai City Marathon",
      date: "Jan 12, 2025",
      location: "Mumbai, IN",
      desc: "India’s largest city marathon uniting professional runners, fitness enthusiasts, and corporate teams.",
      category: "Running",
      img: "./mumbai.jpg",
    },
    {
      title: "Goa Open Water Swim",
      date: "Mar 05, 2025",
      location: "Goa, IN",
      desc: "A professional open-water swimming event set on Goa’s scenic beaches — combining adventure and endurance.",
      category: "Swimming",
      img: "./goaswim.jpg",
    },
    {
      title: "Corporate Wellness Marathon",
      date: "Apr 10, 2025",
      location: "Bengaluru, IN",
      desc: "A unique marathon for corporate teams promoting fitness, teamwork, and leadership through endurance running.",
      category: "Corporate",
      img: "./corporatemarathon.jpg",
    },
    {
      title: "National Athletic Meet",
      date: "May 14, 2025",
      location: "Pune, IN",
      desc: "A multi-discipline athletic championship featuring national-level competitors in track and field events.",
      category: "Athletics",
      img: "./athleticmeet.jpg",
    },
    {
      title: "Delhi Cyclothon",
      date: "Nov 18, 2024",
      location: "New Delhi, IN",
      desc: "A thrilling cycling event across Delhi NCR — promoting sustainable transport and health awareness.",
      category: "Cycling",
      img: "./delhicycle.jpg",
    },
    {
      title: "India Junior Olympiad",
      date: "Jun 02, 2024",
      location: "Chandigarh, IN",
      desc: "A national-scale Olympiad combining academic and athletic excellence for young athletes.",
      category: "Olympiad",
      img: "./olympiad.jpg",
    },
  ];

  const categories = [
    "All",
    "Running",
    "Cycling",
    "Swimming",
    "Corporate",
    "Athletics",
    "Olympiad",
  ];

  const filterEvents = (list) =>
    activeCategory === "All"
      ? list
      : list.filter((e) => e.category === activeCategory);

  const filteredUpcoming = filterEvents(upcomingEvents);
  const filteredPast = filterEvents(pastEvents);

  return (
    <div className="bg-black text-[#F5F5F5] min-h-screen">
      {/* HEADER */}
      <header className="pt-32 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold"
        >
          Sports & Athletic Events
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-neutral-400 mt-4"
        >
          From marathons to corporate fitness and athletic meets — powered by Crew Commune.
        </motion.p>
      </header>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3 pb-10">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              activeCategory === cat
                ? "bg-[#BFFF00] text-black border-[#BFFF00]"
                : "border-neutral-600 hover:border-[#BFFF00]"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* ============================
          UPCOMING EVENTS SECTION
      ============================ */}
      <section className="px-6 md:px-16 py-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-[#BFFF00] text-center"
        >
          Upcoming Events
        </motion.h2>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredUpcoming.map((event, index) => (
              <EventCard
                key={event.title}
                event={event}
                index={index}
                onSelect={() => setSelectedEvent(event)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ============================
          PAST EVENTS SECTION
      ============================ */}
      <section className="px-6 md:px-16 py-10 border-t border-neutral-800">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-[#BFFF00] text-center"
        >
          Past Events
        </motion.h2>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredPast.map((event, index) => (
              <EventCard
                key={event.title}
                event={event}
                index={index}
                onSelect={() => setSelectedEvent(event)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#111] rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-[#BFFF00] hover:text-white"
              >
                <X size={28} />
              </button>
              <img
                src={selectedEvent.img}
                alt={selectedEvent.title}
                className="w-full h-72 object-cover"
              />
              <div className="p-6 space-y-4">
                <h2 className="text-3xl font-bold">{selectedEvent.title}</h2>
                <p className="text-[#BFFF00] font-medium">
                  {selectedEvent.location} • {selectedEvent.date}
                </p>
                <p className="text-neutral-300">{selectedEvent.desc}</p>

                {/* ✅ Button Changes for Upcoming / Past */}
                {upcomingEvents.some((e) => e.title === selectedEvent.title) ? (
                  <motion.a
                    href={selectedEvent.registerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-6 py-3 bg-[#BFFF00] text-black font-semibold rounded-full"
                  >
                    Register Now <ArrowRight className="inline ml-2" />
                  </motion.a>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-[#BFFF00] text-black font-semibold rounded-full"
                    onClick={() => {
                      setPage("contact");
                      setSelectedEvent(null);
                    }}
                  >
                    View Case Study <ArrowRight className="inline ml-2" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA SECTION */}
      <section className="py-20 text-center border-t border-neutral-800">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-8"
        >
          Ready to plan your next major event?
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 text-lg font-semibold bg-[#BFFF00] text-black rounded-full"
          onClick={() => setPage("contact")}
        >
          Start Planning Now
        </motion.button>
      </section>
    </div>
  );
};

// Reusable Event Card Component
const EventCard = ({ event, index, onSelect }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ delay: index * 0.03 }}
    className="relative rounded-2xl overflow-hidden group cursor-pointer"
    onClick={onSelect}
  >
    <img
      src={event.img}
      alt={event.title}
      className="w-full h-72 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
      onError={(e) =>
        (e.target.src =
          "https://placehold.co/600x400/333333/777777?text=Event+Image")
      }
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 opacity-90 group-hover:opacity-100 transition-all"></div>
    <div className="absolute bottom-4 left-4">
      <h2 className="text-2xl font-bold">{event.title}</h2>
      <p className="text-sm text-[#BFFF00] mt-1">{event.location}</p>
    </div>
  </motion.div>
);

/**
 * 8. Contact Page
 */
const ContactPage = () => {
  // Contact info moved here from App.js
  const contactInfo = {
    email: "raikars.yash@gmail.com",
    phone: "+91-90823 55787",
    hq: {
      city: "Mumbai (HQ)",
      address: "123 Creative Lane, Bandra West, Mumbai, IN",
    },
    office: {
      city: "New Delhi",
      address: "456 Media Hub, Hauz Khas, New Delhi, IN",
    },
  };

  return (
    <PageWrapper>
      <header className="pt-40 pb-20 bg-black text-[#F5F5F5]">
        <AnimatedText
          text="Get In Touch"
          el="h1"
          className="text-5xl font-bold text-center"
          delay={0.5}
        />
        <AnimatedText
          text="Let's build something great together."
          el="p"
          className="text-xl text-neutral-400 text-center mt-4"
          delay={0.7}
        />
      </header>

      <section className="py-20 bg-[#111111] text-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Column 1: Contact Form */}
          <motion.div
            variants={scrollRevealVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>
            {/* FEEDBACK #4: Added preventDefault to stop page reload */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-[#F5F5F5] focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00]"
                  data-cursor-hover="link"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-[#F5F5F5] focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00]"
                  data-cursor-hover="link"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="6"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-[#F5F5F5] focus:outline-none focus:border-[#BFFF00] focus:ring-1 focus:ring-[#BFFF00]"
                  data-cursor-hover="link"
                ></textarea>
              </div>
              <MagneticButton strength={25}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-3 text-lg font-semibold bg-[#BFFF00] text-black rounded-full"
                  data-cursor-hover="link"
                >
                  Send Message
                </motion.button>
              </MagneticButton>
            </form>
          </motion.div>

          {/* Column 2: Contact Details */}
          <motion.div
            variants={scrollRevealVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold mb-8">Contact Details</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center mb-2">
                  <Mail size={20} className="text-[#BFFF00] mr-3" /> Email
                </h3>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-lg text-neutral-300 hover:text-[#BFFF00]"
                  data-cursor-hover="link"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div>
                <h3 className="text-xl font-semibold flex items-center mb-2">
                  <Phone size={20} className="text-[#BFFF00] mr-3" /> Phone
                </h3>
                <a
                  href={`tel:${contactInfo.phone.replace(/-/g, "")}`}
                  className="text-lg text-neutral-300 hover:text-[#BFFF00]"
                  data-cursor-hover="link"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div>
                <h3 className="text-xl font-semibold flex items-center mb-2">
                  <Briefcase size={20} className="text-[#BFFF00] mr-3" />{" "}
                  {contactInfo.hq.city}
                </h3>
                <p className="text-lg text-neutral-300">
                  {contactInfo.hq.address}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold flex items-center mb-2">
                  <Briefcase size={20} className="text-[#BFFF00] mr-3" />{" "}
                  {contactInfo.office.city}
                </h3>
                <p className="text-lg text-neutral-300">
                  {contactInfo.office.address}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
};

/**
 * 9. Custom Cursor Component
 */
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [variant, setVariant] = useState("default");
  const [text, setText] = useState("");
  const [isMagnetic, setIsMagnetic] = useState(false);

  // Use spring for smooth cursor movement
  const springConfig = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    mass: 0.1,
  };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });
      cursorX.set(clientX);
      cursorY.set(clientY);

      const hoverTarget = e.target.closest("[data-cursor-hover]");
      const magneticTarget = e.target.closest("[data-cursor-magnetic]");

      setIsMagnetic(!!magneticTarget);

      if (hoverTarget) {
        const hoverType = hoverTarget.getAttribute("data-cursor-hover");
        if (hoverType === "image") {
          setVariant("image");
          setText("View");
        } else {
          setVariant("link");
          setText("");
        }
      } else {
        setVariant("default");
        setText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    const onTouchStart = () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
    window.addEventListener("touchstart", onTouchStart);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [cursorX, cursorY]);

  const variants = {
    default: {
      height: 16,
      width: 16,
      backgroundColor: "#BFFF00",
      mixBlendMode: "normal",
      scale: 1,
    },
    link: {
      height: 24,
      width: 24,
      backgroundColor: "#BFFF00",
      mixBlendMode: "difference",
      scale: 1,
    },
    image: {
      height: 64,
      width: 64,
      backgroundColor: "#F5F5F5",
      mixBlendMode: "normal",
      scale: 1,
    },
    magnetic: {
      height: 16,
      width: 16,
      backgroundColor: "#BFFF00",
      mixBlendMode: "normal",
      scale: 0.5,
    },
  };

  const currentVariantName = isMagnetic
    ? "magnetic"
    : variant === "default"
    ? "default"
    : variant === "link"
    ? "link"
    : "image";

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] rounded-full pointer-events-none hidden md:flex items-center justify-center"
      style={{
        translateX: cursorX,
        translateY: cursorY,
        x: "-50%", // Centering using CSS transform equivalent
        y: "-50%",
      }}
      variants={variants}
      animate={currentVariantName}
      transition={springConfig}
    >
      <span className="text-xs font-semibold text-black uppercase">{text}</span>
    </motion.div>
  );
};

// --- NEW: CircularText Component and Helpers ---

/**
 * NEW: Styles for the CircularText component.
 * This component injects a <style> tag into the document head.
 */
const CircularTextStyles = () => (
  <style>{`
    .circular-text {
      margin: 0 auto;
      border-radius: 50%;
      width: 120px; /* Base size */
      height: 120px; /* Base size */
      position: relative;
      cursor: pointer;
      transform-origin: 50% 50%;
      -webkit-transform-origin: 50% 50%;
    }

    /* This 'p' tag is the container for the letters */
    .circular-text p {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }

    /* The individual <span> styles (the letters) 
      are applied inline in the React component 
      for dynamic rotation. Tailwind classes on the
      component (like text-xs) will be inherited.
    */
  `}</style>
);

// Helper functions for CircularText
const getRotationTransition = (duration, from, loop = true) => ({
  from,
  to: from + 360,
  ease: "linear",
  duration,
  type: "tween",
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration, from) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
});

/**
 * NEW: CircularText Component (Fixed & Integrated)
 */
const CircularText = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();
    if (!onHover) return;

    let transitionConfig;
    let scaleVal = 1;

    switch (onHover) {
      case "slowDown":
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case "speedUp":
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case "pause":
        transitionConfig = {
          rotate: { type: "spring", damping: 20, stiffness: 300 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        };
        scaleVal = 1;
        break;
      case "goBonkers":
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig,
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  // This is the radius (half the width/height from CSS)
  const radius = 60; // 60px is half of 120px width

  return (
    <motion.div
      className={`circular-text ${className}`} // Tailwind classes are passed here
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {/* This 'p' tag is the container for the letters */}
      <p>
        {letters.map((letter, i) => {
          const rotationDeg = (i / letters.length) * 360;

          return (
            <span
              key={i}
              style={{
                // Position the letter at the top-center
                position: "absolute",
                left: "50%",
                top: "0",
                height: `${radius}px`, // height is the radius
                transformOrigin: "bottom center", // Rotate from the center of the circle
                transform: `translateX(-50%) rotate(${rotationDeg}deg)`,
                WebkitTransform: `translateX(-50%) rotate(${rotationDeg}deg)`,
                display: "inline-block", // Make span respect transform
              }}
            >
              {letter}
            </span>
          );
        })}
      </p>
    </motion.div>
  );
};

// --- END NEW CircularText ---

/**
 * Main App Component
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second load screen
    return () => clearTimeout(timer);
  }, []);

  const handleSetPage = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage key="home" setPage={handleSetPage} />;
      // FEEDBACK #4: Passed setPage prop
      case "services":
        return <ServicesPage key="services" setPage={handleSetPage} />;
      case "about":
        return <AboutPage key="about" />;
      // FEEDBACK #4: Passed setPage prop
      case "events":
        return <EventsPage key="events" setPage={handleSetPage} />;
      case "contact":
        return <ContactPage key="contact" />;
      default:
        return <HomePage key="home" setPage={handleSetPage} />;
    }
  };

  return (
    <React.Fragment>
      <CircularTextStyles /> {/* NEW: Inject styles for circular text */}
      <CustomCursor />
      <div className="bg-[#111111] font-sans antialiased scroll-smooth text-[#F5F5F5]">
        <AnimatePresence>
          {isLoading && <LoadingScreen key="loader" />}
        </AnimatePresence>

        {!isLoading && (
          <React.Fragment>
            <Header setPage={handleSetPage} />
            <main>
              <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
            </main>
            <Footer setPage={handleSetPage} />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

// This is the correct way to export the component
export default App;