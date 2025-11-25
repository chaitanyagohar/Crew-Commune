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
  Shirt,
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
    className="bg-[#111111] transform-gpu"
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
 * MagneticButton Component
 */
const MagneticButton = ({ children, strength = 30, ...props }) => {
  const ref = useRef(null);
  const springConfig = {
    type: "spring",
    stiffness: 150,
    damping: 15,
    mass: 0.1,
  };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const onMouseMove = (e) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();

    const distanceX = clientX - (left + width / 2);
    const distanceY = clientY - (top + height / 2);

    x.set(distanceX * (strength / 100));
    y.set(distanceY * (strength / 100));
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      transition={springConfig}
      {...props}
      data-cursor-magnetic="true"
    >
      {children}
    </motion.div>
  );
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
 * MobileHeroGapSlideshow Component
 */
const MobileHeroGapSlideshow = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 700);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden ">
      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index].src}
          alt={images[index].alt}
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 0.7, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            scale: 1,
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

// NEW COMPONENT: Service Differentiator
const ServiceDifferentiator = ({ stat, label, description, icon: Icon }) => (
  <motion.div
    className="bg-neutral-900/50 border-r border-b border-neutral-800 p-8 text-center"
    variants={scrollRevealVariants}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, amount: 0.3 }}
  >
    {Icon && <Icon className="w-16 h-16 text-[#BFFF00] mx-auto mb-3" />}
    {stat && (
      <h3 className="text-6xl font-extrabold text-[#BFFF00] mb-2">{stat}</h3>
    )}
    <p className="text-xl font-semibold mb-2">{label}</p>
    <p className="text-neutral-400 text-sm">{description}</p>
  </motion.div>
);

// --- Hero Section Data & Components ---

const heroImages = [
  {
    src: "./swim1.jpg",
    alt: "swimmingleft",
    width: "250px",
    height: "350px",
    xOffset: -100,
    yOffset: 0,
    rotate: -15,
  },
  {
    src: "./cycle1.jpg",
    alt: "cycle ",
    width: "300px",
    height: "200px",
    xOffset: 150,
    yOffset: -50,
    rotate: 10,
  },
  {
    src: "./running.png",
    alt: "running",
    width: "200px",
    height: "280px",
    xOffset: -250,
    yOffset: 150,
    rotate: 5,
  },
  {
    src: "./swim2.jpg",
    alt: "swimmingright",
    width: "350px",
    height: "300px",
    xOffset: 300,
    yOffset: 100,
    rotate: -8,
  },
  {
    src: "./pickelball2.webp",
    alt: "pickelball",
    width: "350px",
    height: "250px",
    xOffset: -50,
    yOffset: -150,
    rotate: 12,
  },
  {
    src: "./cycle2.jpg",
    alt: "badminton",
    width: "250px",
    height: "280px",
    xOffset: -350,
    yOffset: -50,
    rotate: -5,
  },
];

const ImageFollower = ({ img, index }) => {
  const ref = useRef(null);

  const springConfig = {
    type: "spring",
    stiffness: 50,
    damping: 10,
    mass: 0.8,
  };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const offsetX = (clientX - centerX) * 0.05;
      const offsetY = (clientY - centerY) * 0.05;

      springX.set(img.xOffset + offsetX);
      springY.set(img.yOffset + offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [img.xOffset, img.yOffset, springX, springY]);

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
        delay: 1 + index * 0.1,
      },
    },
    hover: {
      scale: 1.05,
      zIndex: 100,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
      rotate: img.rotate + (img.rotate > 0 ? 5 : -5),
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
        className="w-full h-full object-cover transition-all duration-500"
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
    const duration = 4000;
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
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/crewload2.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#BFFF00]/70"></div>

      <motion.div
        variants={loadingTextVariants}
        className="relative text-4xl md:text-5xl font-extrabold text-black tracking-widest"
      >
        CREW COMMUNE
      </motion.div>

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
const Header = ({ setPage, currentPage }) => {
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
    { name: "Home", page: "home" },
    { name: "About", page: "about" },
    { name: "Services", page: "services" },
    { name: "Events", page: "events" },
    { name: "FAQ", page: "faq" }, // ✅ Added FAQ in header
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
          <MagneticButton strength={40}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onClick={() => handleNavClick("home")}
              className="cursor-pointer bg-white px-2 py-1 rounded-md"
              data-cursor-hover="link"
            >
              <img
                src="/newlogo.png"
                alt="Crew Commune Logo"
                className="h-10 w-auto block"
              />
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
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    currentPage === item.page
                      ? "text-[#BFFF00] font-semibold"
                      : "text-neutral-300 hover:text-[#F5F5F5]"
                  }`}
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
                className={`ml-4 px-5 py-2 text-sm font-medium rounded-full ${
                  currentPage === "contact"
                    ? "bg-[#BFFF00] text-black font-semibold shadow-[0_0_10px_#BFFF00]"
                    : "bg-[#BFFF00] text-black"
                }`}
              >
                Reach Us 
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
                  className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg ${
                    currentPage === item.page
                      ? "text-[#BFFF00] bg-neutral-800 font-semibold"
                      : "text-neutral-300 hover:text-[#F5F5F5] hover:bg-neutral-800"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => handleNavClick("contact")}
                data-cursor-hover="link"
                className={`mt-2 block w-full text-left px-4 py-3 text-base font-medium rounded-lg ${
                  currentPage === "contact"
                    ? "bg-[#BFFF00] text-black font-semibold shadow-[0_0_10px_#BFFF00]"
                    : "bg-[#BFFF00] text-black"
                }`}
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
  const x = useTransform(scrollY, [0, 1000], ["0%", "-10%"], { clamp: false });

  return (
    <div className="relative w-full h-24 md:h-32 overflow-hidden bg-black text-[#F5F5F5] border-y-2 border-neutral-800">
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex items-center"
        style={{ x }}
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

/* ===========================
   FOOTER (Redesigned) — with active highlight
=========================== */
const Footer = ({ setPage, currentPage }) => {
  const links = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Services", page: "services" },
    { label: "Events", page: "events" },
    { label: "FAQs", page: "faq" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <footer className="bg-black text-[#aaa] py-16 border-t border-[#222]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">
        <div >
          <img src="/newlogo.png" alt="Crew Commune" className="h-10 mb-4 rounded-md" />
          <p className="text-sm">
            Empowering Sports, <br />Enriching Communities.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Quick Links</h3>
          {links.map((l) => (
            <p
              key={l.page}
              onClick={() => setPage(l.page)}
              className={`cursor-pointer text-sm mb-2 transition-colors ${
                currentPage === l.page
                  ? "text-[#BFFF00] font-semibold"
                  : "hover:text-[#BFFF00]"
              }`}
            >
              {l.label}
            </p>
          ))}
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <p className="text-sm">Mumbai, India</p>
          <p className="text-sm">raikars.yash@gmail.com</p>
          <p className="text-sm">+91 90823 55787</p>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            {[Twitter, Instagram, Linkedin].map((Icon, i) => (
              <Icon key={i} className="text-[#BFFF00] hover:scale-110 transition" />
            ))}
          </div>
        </div>
      </div>
      <div className="text-center text-xs mt-10 text-[#777] border-t border-[#222] pt-6">
        © {new Date().getFullYear()} Crew Commune. All rights reserved.
      </div>
    </footer>
  );
};


/**
 * 4. Home Page (Bento Services + Outcomes & Process)
 */
const HomePage = ({ setPage }) => {
  const services = [
    {
      title: "Sports & Corporate Event Management",
      icon: Medal,
      desc: "From grand-scale sports events to internal corporate tournaments, we manage it all.",
      img: "./service1.jpg",
    },
    {
      title: "Event Productions and Branding",
      icon: Clapperboard,
      desc: "Full-scale event production, from stage design to live broadcasting and branding.",
      img: "./coorporateevents.jpg",
    },
    {
      title: "Sports & Corporate Merchandise",
      icon: Globe,
      desc: "Custom apparel and merchandise that connects your brand with your community.",
      img: "./merchandise2.png",
    },
    {
      title: "PR & Media Management",
      icon: Users,
      desc: "Elevating your brand's voice with strategic PR and impactful media campaigns.",
      img: "./ser3.jpeg",
    },
  ];

  const mobileSlideshowImages = [
    heroImages[0],
    heroImages[1],
    heroImages[2],
    heroImages[3],
    heroImages[4],
    heroImages[5],
  ];

  const heroSlideshowImages = [
    "/v1.jpg",
    "/v2.jpg",
    "/v3.jpeg",
    "/v4.jpeg",
    "/v5.avif",
    "/v6.avif",
    "/v7.webp",
    "/v8.webp",
    "/v9.webp",
    "/v10.webp",
  ];
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % heroSlideshowImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [heroSlideshowImages.length]);

  const mobileHeroContainerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };
  const textInnovatingVariants = {
    initial: { y: 0, scale: 0.5, opacity: 0 },
    animate: {
      y: -110,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 1 },
    },
  };
  const textSuccessVariants = {
    initial: { y: 0, scale: 0.5, opacity: 0 },
    animate: {
      y: 110,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 1 },
    },
  };
  const slideshowVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { delay: 1.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
<motion.section
  initial="initial"
  animate="animate"
  className="relative h-[100vh] flex items-center justify-center text-center overflow-hidden bg-black"
>
  {/* ======= VIDEO BACKGROUND ======= */}
  <div className="absolute inset-0 z-0">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover opacity-90"
    >
      <source src="/crewherovideo.mov" type="video/mp4" />
      {/* Fallback message */}
      Your browser does not support the video tag.
    </video>
    {/* Overlay gradient for better text contrast */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />
  </div>

  {/* ======= FLOATING IMAGES (keep same) ======= */}
  {heroImages.map((img, index) => (
    <ImageFollower key={index} img={img} index={index} />
  ))}

  {/* ======= HERO TEXT ======= */}
  <div className="relative z-20 max-w-4xl px-4 pointer-events-none">
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

    {/* ======= MOBILE VERSION ======= */}
    <motion.div
      className="md:hidden flex flex-col items-center justify-center relative h-80"
      initial="initial"
      animate="animate"
    >
      <motion.span
        initial={{ y: 0, scale: 0.5, opacity: 0 }}
        animate={{
          y: -110,
          scale: 1,
          opacity: 1,
          transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 1 },
        }}
        className="block text-6xl font-extrabold text-white absolute z-20"
      >
        INNOVATING
      </motion.span>
      <motion.div className="w-[70vw] h-[25vh] rounded-xl shadow-2xl pointer-events-auto absolute z-10">
        <MobileHeroGapSlideshow images={heroImages} />
      </motion.div>
      <motion.span
        initial={{ y: 0, scale: 0.5, opacity: 0 }}
        animate={{
          y: 110,
          scale: 1,
          opacity: 1,
          transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 1 },
        }}
        className="block text-6xl font-extrabold text-[#BFFF00] absolute z-20"
      >
        SUCCESS.
      </motion.span>
    </motion.div>
  </div>

  {/* ======= CIRCULAR SCROLL CUE ======= */}
  <motion.div
    className="absolute bottom-12 left-0 right-0 z-20"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 0.6 }}
    transition={{ delay: 2, duration: 0.8 }}
    data-cursor-hover="link"
  >
    <CircularText
      text="SCROLL*DOWN*EXPLORE*"
      onHover="speedUp"
      spinDuration={12}
      className="text-[#BFFF00] uppercase text-xs font-bold"
    />
  </motion.div>
</motion.section>

      {/* Marquee */}
      <Marquee
        text="Sports & Corporate Event Management • Event Productions and Branding • Sports & Corporate Merchandise • PR & Media Management •"
        speed={80}
      />
{/* ===== NEW SLOGAN SECTION ===== */} <section className="relative bg-black py-36 text-center overflow-hidden border-t border-neutral-900"> {/* Background glow */} <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,255,0,0.06)_0%,transparent_70%)]"></div> {/* Content */} <motion.div variants={scrollRevealVariants} initial="initial" whileInView="whileInView" viewport={{ once: true, amount: 0.3 }} className="relative z-10 max-w-5xl mx-auto px-6" > <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-white"> <span className="bg-gradient-to-r from-[#BFFF00] via-white to-[#BFFF00] bg-clip-text text-transparent"> Empowering Sports, </span>{" "} <br className="hidden sm:block" /> <span className="text-neutral-100">Enriching Communities.</span> </h2> <div className="h-[2px] w-24 bg-gradient-to-r from-[#BFFF00] to-transparent mx-auto my-8"></div> <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"> Driving growth, unity, and progress through powerful sporting experiences and meaningful community connections. </p> </motion.div> </section>

      {/* Our Core Expertise – BENTO GRID */}
      <section className="py-20 md:py-32 bg-[#111111] text-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedText
            text="Our Core Expertise"
            el="h2"
            className="text-3xl font-bold text-center sm:text-4xl mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <ServiceTile
              service={services[0]}
              onClick={() => setPage("services")}
              className="md:col-span-3 md:row-span-2 h-[420px]"
            />

            <ServiceTile
              service={services[1]}
              onClick={() => setPage("services")}
              className="md:col-span-3 h-[200px]"
            />

            <ServiceTile
              service={services[2]}
              onClick={() => setPage("services")}
              className="md:col-span-2 h-[220px]"
            />

            <ServiceTile
              service={services[3]}
              onClick={() => setPage("services")}
              className="md:col-span-4 h-[220px]"
            />
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <MagneticButton strength={25}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPage("services")}
                className="px-6 py-3 rounded-full bg-[#BFFF00] text-black font-semibold"
                data-cursor-hover="link"
              >
                View All Services
              </motion.button>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Outcomes & Process */}
      <section className="bg-black text-[#F5F5F5] py-20 md:py-32 border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Outcomes */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            {[
              { stat: "250K+", label: "Participants Engaged" },
              { stat: "120+", label: "Events Delivered" },
              { stat: "40+", label: "Brands Activated" },
              { stat: "99.3%", label: "On-time Delivery" },
            ].map((k) => (
              <motion.div
                key={k.label}
                variants={scrollRevealVariants}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-[#BFFF00]">
                  {k.stat}
                </div>
                <div className="mt-2 text-neutral-300">{k.label}</div>
              </motion.div>
            ))}
          </div> */}

          {/* Process */}
          <div className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900/60 to-neutral-900/30 p-6 md:p-10">
            <AnimatedText
              text="How We Deliver Impact"
              el="h3"
              className="text-2xl md:text-3xl font-bold text-center mb-10"
            />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Target, title: "Discover", desc: "Align goals, audience and KPIs." },
                { icon: Briefcase, title: "Design", desc: "Concept, branding, and run-of-show." },
                { icon: Clapperboard, title: "Produce", desc: "Vendors, logistics, talent, tech." },
                { icon: TrendingUp, title: "Amplify", desc: "PR, media, content & post-report." },
              ].map((s) => (
                <motion.div
                  key={s.title}
                  variants={scrollRevealVariants}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6"
                >
                  <s.icon className="w-8 h-8 text-[#BFFF00]" />
                  <h4 className="mt-4 text-xl font-semibold">{s.title}</h4>
                  <p className="mt-2 text-neutral-400 text-sm">{s.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
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
                  <span>Plan Your Next Event</span>
                  <ArrowRight size={20} />
                </motion.button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <span>Reach Us</span>
              <ArrowRight size={20} />
            </motion.button>
          </MagneticButton>
        </div>
      </section>
    </PageWrapper>
  );
};

/** Small, reusable Service tile used in the Bento grid */
const ServiceTile = ({ service, onClick, className = "" }) => (
  <motion.button
    onClick={onClick}
    variants={scrollRevealVariants}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, amount: 0.3 }}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
    className={[
      "relative overflow-hidden rounded-3xl group text-left",
      "bg-neutral-950 border border-neutral-800",
      className,
    ].join(" ")}
    data-cursor-hover="image"
  >
    <img
      src={service.img}
      alt={service.title}
      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
      onError={(e) => {
        e.currentTarget.src =
          "https://placehold.co/800x600/1C1C1C/BFFF00?text=Service";
      }}
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

    <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full">
      <div className="flex items-center gap-3">
        <service.icon className="w-6 h-6 md:w-8 md:h-8 text-[#BFFF00]" />
        <h3 className="font-extrabold text-xl md:text-2xl">{service.title}</h3>
      </div>
      <p className="text-neutral-300 mt-3 text-sm md:text-base">
        {service.desc}
      </p>
      <motion.span
        className="mt-4 inline-flex items-center text-[#BFFF00] font-semibold text-sm"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        Learn More <ArrowRight size={18} className="ml-2" />
      </motion.span>
    </div>

    <div className="absolute inset-0 scale-100 group-hover:scale-[1.03] transition-transform duration-700" />
  </motion.button>
);

// NEW COMPONENT: Milestone for About Page Scroll
const Milestone = ({ year, title, description, isRight }) => (
  <motion.div
    className="relative grid grid-cols-1 md:grid-cols-2 gap-8 py-8"
    variants={scrollRevealVariants}
    initial="initial"
    whileInView="whileInView"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div
      className={`md:pr-8 ${
        isRight ? "md:order-2 md:text-left" : "md:text-right"
      }`}
    >
      <h3 className="text-5xl font-extrabold text-[#BFFF00]">{year}</h3>
      <h4 className="text-2xl font-semibold mt-2 text-[#F5F5F5]">{title}</h4>
    </div>

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

  const differentiators = [
    {
      title: "Experience Meets Energy",
      desc: "Crew Commune blends 10+ years of global agency expertise with the drive of a next-gen creative powerhouse — delivering work that’s bold, efficient, and built to perform.",
      icon: Briefcase,
    },
    {
      title: "In-House Mastery",
      desc: "From event production and branding to custom merchandise — we do it all ourselves. Full control. Zero compromises.",
      icon: Shirt,
    },
    {
      title: "Beyond Management",
      desc: "We don’t just manage events. We craft unforgettable experiences, build loyal communities, and fuel the spirit of sports across India.",
      icon: Medal,
    },
    {
      title: "Driven by Purpose",
      desc: "Every project begins with a question — how will this make an impact? We amplify stories, not just campaigns.",
      icon: Users,
    },
  ];

  return (
    <PageWrapper>
      {/* ===== HERO ===== */}
      <header className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-[#F5F5F5] text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-black z-0 overflow-hidden"
          data-cursor-hover="image"
        >
          <ParallaxImage src="delhimarathon.avif" alt="Founder portrait" />
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
          <AnimatedText
            text="DRIVEN BY PASSION.
DEFINED BY RESULTS."
            el="h1"
            className="text-5xl sm:text-7xl font-extrabold tracking-tighter my-4"
            delay={0.5}
          />
          <motion.p
            variants={fadeInUpVariants}
            className="max-w-2xl mx-auto text-lg text-neutral-300"
          >
            We saw a need for an agency that operates as a true partner. Our foundation is built on 10+ years of global industry experience, tailored for the Indian market.
          </motion.p>
        </motion.div>
      </header>

      {/* ===== MISSION ===== */}
      <section className="py-20 md:py-32 bg-[#111111] text-[#F5F5F5]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-lg">
          <motion.div
            variants={scrollRevealVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.3 }}
          >
            <AnimatedText
              text="Our Mission: Your True Partner"
              el="h2"
              className="text-3xl font-bold mb-6"
            />
            <p className="mb-6 text-neutral-300">
              Crew Commune exists to bridge the gap between vision and execution. We’re more than a service provider — we’re an extension of your team, driving every project with strategy, passion, and purpose.
            </p>
            <p className="mb-6 text-neutral-300">
              From managing international marathons to producing corporate experiences and merchandise, our mission stays the same — empower communities through sport, creativity, and connection.
            </p>
            <p className="font-semibold text-[#F5F5F5]">- Yash Raikar, Founder</p>
          </motion.div>
        </div>
      </section>

      {/* ===== WHAT SETS US APART ===== */}
      <section className="relative py-28 bg-gradient-to-b from-black via-[#0b0b0b] to-black text-[#F5F5F5] overflow-hidden border-t border-neutral-800">
        {/* Subtle gradient glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,255,0,0.06)_0%,transparent_70%)] blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <AnimatedText
            text="What Sets Us Apart"
            el="h2"
            className="text-4xl md:text-6xl font-extrabold text-center mb-16"
          />
          <p className="max-w-2xl mx-auto text-center text-neutral-400 mb-20">
            We’re not another agency — we’re the Crew behind your success. 
            A collective of strategists, creators, and doers who make ideas tangible and brands unforgettable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                variants={scrollRevealVariants}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5 }}
                className="relative bg-[#111]/60 backdrop-blur-sm border border-neutral-800 rounded-3xl p-8 overflow-hidden group hover:border-[#BFFF00]/60 hover:shadow-[0_0_25px_rgba(191,255,0,0.15)] transition-all duration-500"
              >
                {/* Soft glow ring */}
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#BFFF00]/10 blur-3xl rounded-full group-hover:opacity-100 opacity-0 transition-all"></div>

                <item.icon className="w-10 h-10 text-[#BFFF00] mb-4 relative z-10" />
                <h3 className="text-2xl font-bold mb-3 relative z-10">
                  {item.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed relative z-10">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Small bottom quote */}
          <motion.div
            variants={scrollRevealVariants}
            initial="initial"
            whileInView="whileInView"
            className="text-center mt-20 text-lg italic text-neutral-400"
          >
            “Every great event has a story — and we make sure yours becomes unforgettable.”
          </motion.div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
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
                className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl text-center hover:border-[#BFFF00]/40 transition-all duration-500"
                variants={scrollRevealVariants}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="relative flex justify-center mb-4">
                  <div className="absolute w-14 h-14 bg-[#BFFF00]/20 blur-2xl rounded-full"></div>
                  <item.icon className="w-10 h-10 text-[#BFFF00] relative z-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-neutral-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};


const ServicesPage = ({ setPage }) => {
  const services = [
    {
      title: "Sports & Corporate Event Management",
      desc: "At Crew Commune, we specialize in delivering end-to-end event management solutions — from creative conceptualization to flawless execution. With a proven track record across sporting, corporate, and political events, our team combines innovation, precision, and professionalism to craft experiences that inspire and engage. Whether it’s a high-energy marathon, a dynamic corporate conference, or a large-scale public gathering, we ensure every detail is planned to perfection — from strategy and logistics to production and on-ground management. Driven by passion and guided by expertise, we don’t just organize events — we create impactful moments that leave lasting impressions.",
      icon: Medal,
      img: "./service1.jpg",
    },
    {
      title: "Event Productions and Branding",
      desc: "We bring ideas to life through powerful event production and branding solutions. From stage design, lighting, and sound to creative installations and digital media — every element is crafted to reflect your brand’s identity and purpose. Our team ensures seamless execution, delivering visually striking, high-impact experiences that capture attention and elevate your event’s presence. Whether it’s a corporate celebration, sporting event, or public campaign, we make your brand stand out where it matters most.",
      icon: Clapperboard,
      img: "./coorporateevents.jpg",
    },
    {
      title: "Sports & Corporate Merchandise",
      desc: "We specialize in the manufacturing and customization of premium sports and corporate merchandise. From performance wear and event accessories to branded gifts and promotional items, we create products that seamlessly combine quality, functionality, and style. With in-house design and production capabilities, we ensure every item reflects your brand’s identity — making it perfect for marathons, corporate events, team gear, and promotional campaigns.",
      icon: Globe,
      img: "./merchandise3.png",
    },
    {
      title: "PR & Media Management",
      desc: "At Crew Commune, we specialize in strategic PR and media management for events and athletes, ensuring maximum visibility and impactful storytelling. From press coverage and social media campaigns to influencer collaborations and media relations, we craft narratives that build strong public presence and lasting brand value. Our experienced team manages every communication touchpoint — before, during, and after the event — to deliver the right message to the right audience at the right time.",
      icon: Users,
      img: "./media.jpg",
    },
  ];

  const differentiators = [
    {
      stat: "10+",
      label: "Years of Elite Experience",
      description:
        "Our founder's background spans top-tier global agencies and brands.",
    },
    {
      label: "In-House Production",
      description:
        "From content to logistics, we manage everything without third-party bottlenecks. We make T-shirts, medals, sports bags, corporate merchandise, etc.",
      icon: Shirt,
    },
    {
      stat: "100%",
      label: "Full Control. Flawless Execution.",
      description:
        "We don't outsource. Our 100% in-house team handles every detail, from creative content to complex logistics.",
    },
    {
      stat: "24/7",
      label: "Strategic Partnership",
      description:
        "Generating significant media buzz for every major event managed.",
    },
  ];

  return (
    <PageWrapper>
      {/* ===== HERO SECTION ===== */}
      <header className="relative h-[60vh] flex items-center justify-center text-center text-[#F5F5F5] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <img
            src="./servicehero.jpg"
            alt="Services Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-transparent" />
        </motion.div>

        <div className="relative z-10 px-4 max-w-3xl">
          <AnimatedText
            text="Our Services"
            el="h1"
            className="text-4xl md:text-6xl font-extrabold mb-4"
            delay={0.3}
          />
          <AnimatedText
            text="Expert services to elevate your brand, manage your talent, and create unforgettable events."
            el="p"
            className="text-base md:text-xl text-neutral-400 leading-relaxed"
            delay={0.6}
          />
        </div>
      </header>

      {/* ===== DIFFERENTIATORS ===== */}
      <section className="bg-[#111111] py-20 relative border-y border-neutral-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,255,0,0.05)_0%,transparent_70%)]"></div>

        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-6">
          {differentiators.map((item, index) => (
            <motion.div
              key={index}
              variants={scrollRevealVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 150, damping: 10 }}
              className="bg-neutral-900/40 border border-[#2a2a2a] backdrop-blur-sm rounded-2xl p-8 text-center shadow-[0_0_15px_rgba(191,255,0,0.05)]"
            >
              {item.icon && (
                <item.icon className="w-12 h-12 mx-auto mb-3 text-[#BFFF00]" />
              )}
              {item.stat && (
                <h3 className="text-5xl font-extrabold text-[#BFFF00] mb-2">
                  {item.stat}
                </h3>
              )}
              <h4 className="text-xl font-semibold mb-2">{item.label}</h4>
              <p className="text-neutral-400 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SERVICES GRID (MOBILE OPTIMIZED) ===== */}
      <section className="bg-black py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-28 md:space-y-48">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={scrollRevealVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.3 }}
              className={`relative flex flex-col md:flex-row items-center ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* === IMAGE === */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full md:w-[60%] overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(191,255,0,0.08)] group"
                data-cursor-hover="image"
              >
                <motion.img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-[280px] sm:h-[320px] md:h-[450px] object-cover rounded-2xl transition-transform duration-[1.4s] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110 object-center"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/1200x600/1C1C1C/BFFF00?text=Service+Image")
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(191,255,0,0.12)_0%,transparent_70%)]"></div>
                <motion.div
                  className="absolute inset-0 border border-[#BFFF00]/20 rounded-2xl"
                  whileHover={{
                    borderColor: "#BFFF00",
                    boxShadow: "0px 0px 30px rgba(191,255,0,0.5)",
                  }}
                />
              </motion.div>

              {/* === TEXT === */}
              <div
                className={`relative md:w-[40%] text-left mt-6 md:mt-0 ${
                  index % 2 === 0 ? "md:pl-16" : "md:pr-16"
                }`}
              >
                <service.icon className="w-8 h-8 md:w-10 md:h-10 text-[#BFFF00] mb-3" />
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-3">
                  {service.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-neutral-400 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              {/* === BACKGROUND GLOW === */}
              <div
                className={`absolute z-0 w-[350px] h-[350px] blur-3xl rounded-full bg-[#BFFF00]/5 ${
                  index % 2 === 0
                    ? "top-[10%] left-[-100px]"
                    : "bottom-[10%] right-[-100px]"
                }`}
              ></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 md:py-28 bg-[#111] text-center overflow-hidden border-t border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,255,0,0.08)_0%,transparent_70%)]"></div>
        <div className="absolute -top-10 -left-20 w-96 h-96 rounded-full bg-[#BFFF00]/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#BFFF00]/10 blur-3xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <AnimatedText
            text="Have a brief? We'll turn it into a win."
            el="h3"
            className="text-3xl md:text-5xl font-extrabold mb-4"
          />
          <p className="text-neutral-400 text-base md:text-lg mb-10">
            Share your goals and constraints—timeline, budget, KPIs—and we’ll
            propose a crisp action plan within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <MagneticButton strength={30}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPage("contact")}
                className="px-8 py-3 bg-[#BFFF00] text-black font-semibold rounded-full shadow-[0_0_20px_#BFFF00aa] text-sm sm:text-base"
              >
                Get a Custom Quote
              </motion.button>
            </MagneticButton>

            <MagneticButton strength={30}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPage("contact")}
                className="px-8 py-3 border border-[#BFFF00]/50 text-[#BFFF00] rounded-full font-semibold hover:bg-[#BFFF00]/10 transition text-sm sm:text-base"
              >
                Talk to Us
              </motion.button>
            </MagneticButton>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

/**
 * ✅ NEW: FAQ Page (moved FAQs here from Services)
 */
const FaqPage = () => {
  const faqs = [
    {
      question: "What is Crew Commune's core area of expertise?",
      answer:
        "We are a powerhouse that merges the dynamic worlds of sports, branding, and community building. Our core expertise lies in Sports & Corporate Event Management, Event Productions and Branding, Sports & Corporate Merchandise, and PR & Media Management.",
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
      question: "What does 'Sports & Corporate Event Management' include?",
      answer:
        "This combined service covers the full spectrum of event planning. For sports, this means large-scale, public-facing events like marathons. For corporate, it includes private, internal-facing events like wellness programs, tournaments, and team-building days, all managed by one expert team.",
    },
  ];

  return (
    <PageWrapper>
      <header className="pt-40 pb-14 bg-black text-[#F5F5F5] text-center">
        <AnimatedText
          text="Frequently Asked Questions"
          el="h1"
          className="text-5xl font-bold"
          delay={0.4}
        />
        <p className="text-neutral-400 mt-4 max-w-2xl mx-auto">
          Everything you need to know about our process, deliverables, and
          working together.
        </p>
      </header>

      <section className="py-16 bg-[#111111] text-[#F5F5F5]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-10">
            <MagneticButton strength={25}>
              <motion.button
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={() => {
                  window.scrollTo(0, 0);
                  // navigate to contact
                  const evt = new Event("navigate-contact");
                  window.dispatchEvent(evt);
                }}
                className="text-lg font-semibold text-[#BFFF00] flex items-center space-x-2 mx-auto"
                data-cursor-hover="link"
              >
                <span>Still have questions? Contact us</span>
                <ArrowRight size={20} />
              </motion.button>
            </MagneticButton>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};


/* ===========================
   EVENTS PAGE (Updated)
=========================== */
const EventsPage = ({ setPage }) => {
  const upcomingEvents = [
   
    {
      title: "Udaan Nari Shakti Run",
      date: "Mar 10, 2026",
      location: "New Delhi, IN",
      desc: "A women’s empowerment event celebrating strength, resilience, and equality through fitness and sports.",
      img: "./udaannari.jpg",
      registerLink: "/register",
    },
     {
      title: "Pune Twin City Marathon",
      date: "Feb 08, 2026",
      location: "Pune, IN",
      desc: "A grand-scale marathon connecting Pune and PCMC — empowering fitness, unity, and community spirit.",
      img: "./punetwincity.jpg",
      registerLink: "/register",
    },
  ];

  return (
    <div className="bg-black min-h-screen text-[#F5F5F5] pt-32">
      <h1 className="text-5xl font-bold text-center mb-4">Upcoming Events</h1>
      <p className="text-center text-neutral-400 mb-12">
        Discover our upcoming sports and corporate events powered by Crew Commune.
      </p>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-10 px-6">
        {upcomingEvents.map((event, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl overflow-hidden bg-[#111] border border-[#222]"
          >
            <img
              src={event.img}
              alt={event.title}
              className="h-64 w-full object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
              <p className="text-[#BFFF00] text-sm mb-4">
                {event.location} • {event.date}
              </p>
              <p className="text-neutral-400 mb-6">{event.desc}</p>
              <a
                href={event.registerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-2 bg-[#BFFF00] text-black font-semibold rounded-full hover:scale-105 transition"
              >
                Register Now <ArrowRight className="ml-2" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* NEW CTA SECTION */}
      <section className="mt-24 text-center relative py-24 bg-gradient-to-r from-[#BFFF00]/20 via-[#BFFF00]/10 to-transparent border-t border-[#222]">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold mb-6"
        >
          Want to host your own event?
        </motion.h2>
        <p className="text-neutral-400 max-w-xl mx-auto mb-10">
          Let Crew Commune handle everything — from logistics and branding to execution and PR. 
          Transform your idea into an extraordinary experience.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage("contact")}
          className="px-10 py-4 bg-[#BFFF00] text-black rounded-full font-bold text-lg shadow-[0_0_20px_#BFFF00AA]"
        >
          Plan Your Event Now <ArrowRight className="inline ml-2" />
        </motion.button>
      </section>
    </div>
  );
};

/**
 * 8. Contact Page
 */
const ContactPage = () => (
  <PageWrapper>
    <div className="pt-32 pb-20 bg-black text-[#F5F5F5] text-center">
      <h1 className="text-5xl font-bold">Reach Us</h1>
      <p className="text-neutral-400 mt-3">Let's build something great together.</p>
    </div>

    <div className="bg-[#111111] py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6">
        {/* Form */}
        <motion.form
          variants={scrollRevealVariants}
          initial="initial"
          whileInView="whileInView"
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
        >
          {[
            { id: "name", label: "Full Name", type: "text" },
            { id: "org", label: "Organization", type: "text" },
            { id: "email", label: "Email", type: "email" },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block mb-2 text-sm font-medium">
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                placeholder={f.label}
                className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#333] rounded-lg text-sm text-white focus:outline-none focus:border-[#BFFF00]"
              />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder="How can we help?"
              className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#333] rounded-lg text-sm text-white focus:outline-none focus:border-[#BFFF00]"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-[#BFFF00] text-black font-bold rounded-full hover:scale-105 transition"
          >
            Send Message
          </button>
        </motion.form>

        {/* Contact Info */}
        <motion.div
          variants={scrollRevealVariants}
          initial="initial"
          whileInView="whileInView"
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold mb-6">Contact Details</h2>
          <div>
            <p className="text-lg text-[#BFFF00]">Email</p>
            <p className="text-neutral-400">raikars.yash@gmail.com</p>
          </div>
          <div>
            <p className="text-lg text-[#BFFF00]">Phone</p>
            <p className="text-neutral-400">+91 90823 55787</p>
          </div>
          <div>
            <p className="text-lg text-[#BFFF00]">Mumbai HQ</p>
            <p className="text-neutral-400">123 Creative Lane, Bandra West, Mumbai, IN</p>
          </div>
        </motion.div>
      </div>
    </div>
  </PageWrapper>
);
/**
 * 9. Custom Cursor Component
 */
const CustomCursor = () => {
  const [variant, setVariant] = useState("default");
  const [text, setText] = useState("");
  const [isMagnetic, setIsMagnetic] = useState(false);

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
        x: "-50%",
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

// --- NEW: CircularText Component + helpers ---
const CircularTextStyles = () => (
  <style>{`
    .circular-text {
      margin: 0 auto;
      border-radius: 50%;
      width: 120px;
      height: 120px;
      position: relative;
      cursor: pointer;
      transform-origin: 50% 50%;
      -webkit-transform-origin: 50% 50%;
    }
    .circular-text p {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
  `}</style>
);

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

  const radius = 60;

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <p>
        {letters.map((letter, i) => {
          const rotationDeg = (i / letters.length) * 360;

          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "0",
                height: `${radius}px`,
                transformOrigin: "bottom center",
                transform: `translateX(-50%) rotate(${rotationDeg}deg)`,
                WebkitTransform: `translateX(-50%) rotate(${rotationDeg}deg)`,
                display: "inline-block",
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

// --- END CircularText ---

/**
 * Main App Component
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
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
      case "services":
        return <ServicesPage key="services" setPage={handleSetPage} />;
      case "about":
        return <AboutPage key="about" />;
      case "events":
        return <EventsPage key="events" setPage={handleSetPage} />;
      case "faq": // ✅ New FAQ route
        return <FaqPage key="faq" />;
      case "contact":
        return <ContactPage key="contact" />;
      default:
        return <HomePage key="home" setPage={handleSetPage} />;
    }
  };

  return (
    <React.Fragment>
      <CircularTextStyles />
      <CustomCursor />
      <div className="bg-[#111111] font-sans antialiased scroll-smooth text-[#F5F5F5]">
        <AnimatePresence>{isLoading && <LoadingScreen key="loader" />}</AnimatePresence>

        {!isLoading && (
          <React.Fragment>
            <Header setPage={handleSetPage} currentPage={currentPage} />
            <main>
              <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
            </main>
            <Footer setPage={handleSetPage} currentPage={currentPage} />
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

export default App;
