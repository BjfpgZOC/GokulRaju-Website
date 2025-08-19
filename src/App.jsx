import React, { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/next"
import Orb from "./Orb.jsx";
import GlassSurface from "./GlassSurface.jsx";
import "./Orb.css";
import "./GlassSurface.css";
import DecryptedText from "./DecryptedText.jsx";
import TiltedCard from "./TiltedCard.jsx";
import SplitText from "./SplitText.jsx";
import Dock from "./Dock.jsx";
import { VscMail, VscGithub } from "react-icons/vsc";
import { FaLinkedin } from "react-icons/fa";
import Carousel from "./Carousel.jsx";
import ShinyButton from "./ShinyButton";
import RotatingText from "./RotatingText.jsx"; // ⟵ NEW

import avatar from "./assets/avatar.png";
import logo from "./assets/logo.png";
import cvUrl from "./assets/CV.pdf";
import p1 from "./assets/p1.gif";
import p2 from "./assets/p2.gif";
import p3 from "./assets/p3.gif";
import p4 from "./assets/p4.gif";

const Sun = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
  </svg>
);
const Moon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const NAV_H = 56;
const CARD_W = "clamp(200px, 28vw, 300px)";
const CARD_H = `calc(${CARD_W} * 1.333)`;
const PROJ_W = "clamp(320px, 48vw, 720px)";
const PROJ_H_NUM = 370;
const PROJ_W_NUM = 600;

const projectItems = [
  { src: p1, title: "Project 1" },
  { src: p2, title: "Project 2" },
  { src: p3, title: "Project 3" },
  { src: p4, title: "Project 4" },
];

const projectDescs = [
  <>
    <span className="proj-title"><strong>State Space Models for Efficient Reinforcement Learning in Quadrotors</strong></span>
    <span className="proj-desc">Proposed the first SSM-based RL framework for Autonomous Drone Racing for both state-based and vision-based domains. Developed a custom PPO JAX-Implementation to train the drone racing policies for the Flightmare Simulator.</span>
    <span aria-hidden className="proj-gap" />
    <span className="proj-desc">Achieved SOTA performance – 8-10% faster lap-times in comparison to existing drone racing policies on the Flightmare Simulator by effectively capturing and utilizing the rich temporal information embedded in the drone racing environment.</span>
  </>,
  <>
    <span className="proj-title"><strong>Pushing the limits of Optical Flow Estimation in Event Cameras</strong></span>
    <span className="proj-desc">Proposed the first multi-event learning based optical flow framework for event-based vision. Achieved SOTA performance on DSEC-Flow and MVSEC.</span>
    <span aria-hidden className="proj-gap" />
    <span className="proj-desc">An extension of this work was published as a Workshop Paper.</span>
    <span aria-hidden className="proj-gap" />
    <span className="proj-desc"><strong>Perturbed State Space Feature Encoders for Optical Flow with Event Cameras</strong></span>
    <span className="proj-desc"><em>Gokul Raju Govinda Raju, Nikola Zubi´c, Marco Cannici, Davide Scaramuzza</em></span>
    <span className="proj-desc"><em>IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops (CVPRW), Nashville, 2025</em></span>
  </>,
  <>
    <span className="proj-title"><strong>Spaceship Obstacle Avoidance and Trajectory Planning</strong></span>
    <span className="proj-desc">Implemented a SCvx (Successive Convexification) planning and control algorithm for a 2-D spaceship to effectively avoid static & dynamic obstacles and dock with the station.</span>
  </>,
  <>
    <span className="proj-title"><strong>Robust Soccer Ball Detection and Tracking (FIFA)</strong></span>
    <span className="proj-desc">Developed an end-to-end pipeline to effectively detect & track soccer balls in both sharp and blurred broadcast frames. Generated a synthetic dataset with Google Research Football Simulator and implemented transfer learning on the YOLOv8n object detection model to achieve a 216% increase in precision (0.31 to 0.98) and 717% increase in recall (0.12 to 0.98) compared to the base model.</span>
    <span aria-hidden className="proj-gap" />
    <span className="proj-desc">Integrated the fine-tuned detection model with a state-of-the art approach MfB (Motion from Blur) to hadnle high-speed blurry motion. Combined multi-view detections with camera pose information to triangulate the position of the soccer ball (95.78% tracking accuracy at 0.75 IoU) and visualized the tracking results by generating 3D trajectories for coaching analytics.</span>
  </>,
];

const projectActions = [
  [{ label: "Report", href: "https://github.com/BjfpgZOC/ETH-Master-Thesis" }],
  [
    { label: "Report", href: "https://github.com/BjfpgZOC/ETH-Semester-Thesis" },
    { label: "arXiv", href: "https://arxiv.org/abs/2504.10669" },
    { label: "Benchmark", href: "https://dsec.ifi.uzh.ch/uzh/dsec-flow-optical-flow-benchmark/" },
  ],
  [{ label: "Code", href: "https://github.com/BjfpgZOC/ETH-PDM4AR-Spaceship-Project" }],
  [{ label: "Report", href: "https://github.com/BjfpgZOC/ETH-3DVision-Project" }],
];

const rotateTexts = [
  "Machine Learning",
  "Computer Vision",
  "Reinforcement Learning",
  "Event-based Vision",
  "Sequence Models",
  "Diffusion Models",
  "Robotics",
  "LLMs"
];

const pdfNoChrome = `${cvUrl}#toolbar=0&navpanes=0&statusbar=0&view=FitH`;

export default function App() {
  const [light, setLight] = useState(false);
  const [tab, setTab] = useState("home");
  const [projIdx, setProjIdx] = useState(0);
  const year = new Date().getFullYear();

  const bg = light ? "#F6E8D5" : "#000000";
  const fg = light ? "#20150A" : "#f5f5f5";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", light ? "light" : "dark");
  }, [light]);

  useEffect(() => {
    if (tab === "projects") setProjIdx(0);
  }, [tab]);

  const Link = ({ id, children }) => (
    <a
      href={`#${id}`}
      className={`nav-link ${tab === id ? "nav-link--active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        setTab(id);
      }}
    >
      {children}
    </a>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: bg,
        color: fg,
        transition: "background 200ms ease, color 200ms ease",
        overflow: tab === "home" ? "hidden" : "auto",
      }}
    >
      <GlassSurface
        width="fit-content"
        height={NAV_H}
        borderRadius={NAV_H / 2}
        brightness={light ? 70 : 65}
        opacity={0.95}
        displace={1.2}
        saturation={1.8}
        distortionScale={-140}
        backgroundOpacity={light ? 0.06 : 0.16}
        className="nav-glass"
        style={{
          position: "fixed",
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "inline-flex",
          maxWidth: "92vw",
          background: light ? "rgba(32,21,10,0.06)" : "rgba(255,255,255,0.10)",
          border: light ? "1px solid rgba(32,21,10,0.14)" : "1px solid rgba(255,255,255,0.22)",
          boxShadow: light
            ? "0 8px 30px rgba(0,0,0,0.06)"
            : "0 8px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)",
          color: fg,
        }}
      >
        <div className="nav-row">
          <div className="brand">Gokul Raju</div>
          <span className="brand-gap" aria-hidden />
          <div className="nav-right">
            <nav className="nav-links">
              <Link id="home">Home</Link>
              <Link id="about">About Me</Link>
              <Link id="projects">Projects</Link>
              <Link id="extras">Extras</Link>
              <Link id="resume">Resume</Link>
            </nav>
            <button
              aria-label={light ? "Switch to dark background" : "Switch to light background"}
              onClick={() => setLight((v) => !v)}
              className="nav-icon"
              title={light ? "Dark" : "Light"}
            >
              {light ? <Moon /> : <Sun />}
            </button>
          </div>
        </div>
      </GlassSurface>

      {/* HOME */}
      {tab === "home" && (
        <>
          <div className="hero">
            <h1 className="hero-title">
              <span className="line">
                <DecryptedText text="BjfpgZOC welcomes you!" animateOn="view" speed={25} maxIterations={10} />
              </span>
              <span className="line">
                <DecryptedText text="An account of my contributions" animateOn="view" speed={25} maxIterations={20} />
              </span>
              <span className="line">
                <DecryptedText text="Towards Singularity." animateOn="view" speed={25} maxIterations={30} />
              </span>
            </h1>
          </div>

          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
            mono={light ? 1 : 0}
            monoBrightness={0.22}
          />
        </>
      )}

      {/* ABOUT */}
      {tab === "about" && (
        <section
          style={{
            minHeight: "100svh",
            padding: "96px 24px 32px",
            boxSizing: "border-box",
            display: "grid",
            placeItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `${CARD_W} minmax(280px, 520px)`,
              alignItems: "center",
              justifyContent: "center",
              justifyItems: "center",
              width: "min(1100px, 92vw)",
              margin: "0 auto",
              columnGap: "clamp(32px, 7vw, 120px)",
              rowGap: 24,
            }}
          >
            {/* LEFT: photo + rotating expertise */}
            <div style={{ display: "grid", justifyItems: "center", rowGap: 12 }}>
              <TiltedCard
                imageSrc={avatar}
                altText="Gokul portrait"
                captionText=""
                containerHeight={CARD_H}
                containerWidth={CARD_W}
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.07}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              />

              {/* ⟵ NEW RotatingText just below the photo */}
              <div
                style={{
                  fontSize: "clamp(13px, 1.05vw, 16px)",
                  fontWeight: 600,
                  letterSpacing: "0.2px",
                  opacity: 0.92,
                }}
              >
              <RotatingText
                texts={rotateTexts}
                mainClassName="rt-pill"
                splitLevelClassName="rt-word"
                elementLevelClassName="rt-char"
                splitBy="words"
                staggerFrom="last"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-120%", opacity: 0 }}
                staggerDuration={0.035}
                transition={{
                  layout: { type: "spring", stiffness: 520, damping: 26, mass: 0.7, bounce: 0.33 },
                  type: "spring",
                  damping: 26,
                  stiffness: 320
                }}
                rotationInterval={1800}
                auto
              />
              </div>
            </div>

            {/* RIGHT: about text */}
            <div style={{ width: "100%", maxWidth: 520, textAlign: "left" }}>
              <h2 style={{ margin: "0 0 8px", fontSize: "clamp(18px, 2vw, 22px)" }}>Hello!</h2>

              <SplitText rich className="about-para" splitType="words" delay={5} duration={0.25}
                         ease="power3.out" from={{ opacity: 0, y: 12 }} to={{ opacity: 1, y: 0 }}
                         threshold={0.2} rootMargin="-80px" textAlign="left" wordGap="0.3em" letterGap="0.05">
                My name is Gokul Raju and I recently graduated with a Master's degree in{" "}
                <a href="https://ethz.ch/en/studies/master/degree-programmes/engineering-sciences/robotics-systems-and-control.html"
                   target="_blank" rel="noopener noreferrer">Robotics, Systems &amp; Control</a>{" "}
                from <a href="https://ethz.ch/en.html" target="_blank" rel="noopener noreferrer">ETH Zurich.</a>
                My research interests focus on Machine Learning, Computer Vision, Reinforcement Learning,
                Event-based Vision, Sequence Modelling (State-Space Models), Diffusion Models and LLMs.
              </SplitText>

              <SplitText rich className="about-para" splitType="words" delay={5} duration={0.25}
                         ease="power3.out" from={{ opacity: 0, y: 12 }} to={{ opacity: 1, y: 0 }}
                         threshold={0.2} rootMargin="-80px" textAlign="left" wordGap="0.3em" letterGap="0.05">
                Over the course of my Master's degree, I implemented learning algorithms for complex computer
                vision tasks in both pixel-based and event-based domains and for dynamic real-world tasks
                such as autonomous drone racing at the{" "}
                <a href="https://rpg.ifi.uzh.ch/" target="_blank" rel="noopener noreferrer">Robotics and Perception Group</a>{" "}
                in <a href="https://www.uzh.ch/en.html" target="_blank" rel="noopener noreferrer">University of Zurich</a>{" "}
                under <a href="https://rpg.ifi.uzh.ch/people_scaramuzza.html" target="_blank" rel="noopener noreferrer">
                  Prof. Davide Scaramuzza.</a>
              </SplitText>

              <SplitText rich className="about-para" splitType="words" delay={5} duration={0.25}
                         ease="power3.out" from={{ opacity: 0, y: 12 }} to={{ opacity: 1, y: 0 }}
                         threshold={0.2} rootMargin="-80px" textAlign="left" wordGap="0.3em" letterGap="0.05">
                Prior to my Masters, I completed my{" "}
                <a href="https://www.hw.ac.uk/dubai/study/undergraduate/mechanical-engineering"
                   target="_blank" rel="noopener noreferrer">BEng (Hons) in Mechanical Engineering</a>{" "}
                at <a href="https://www.hw.ac.uk/dubai/" target="_blank" rel="noopener noreferrer">Heriot-Watt University, Dubai;</a>
                I was awarded the{" "}
                <a href="https://www.hw.ac.uk/alumni/watt-club/medals-prizes.htm" target="_blank" rel="noopener noreferrer">
                  Watt Club Medal
                </a>{" "}
                and{" "}
                <a href="https://www.hw.ac.uk/alumni/watt-club/medals-prizes.htm" target="_blank" rel="noopener noreferrer">
                  The James Anderson Memorial Prize.</a>
              </SplitText>
            </div>
          </div>

          {/* Dock */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 36 }}>
            <Dock
              className="embedded"
              items={[
                { icon: <VscMail size={18} />, label: "Email", onClick: () => (window.location.href = "mailto:gokul10012000@gmail.com") },
                { icon: <FaLinkedin size={18} />, label: "LinkedIn", onClick: () => window.open("https://www.linkedin.com/in/gokul-8011a", "_blank", "noopener,noreferrer") },
                { icon: <VscGithub size={18} />, label: "GitHub", onClick: () => window.open("https://github.com/BjfpgZOC", "_blank", "noopener,noreferrer") },
              ]}
              panelHeight={64}
              baseItemSize={46}
              magnification={74}
              distance={180}
            />
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {tab === "projects" && (
        <>
          {/* Scoped CSS just for Projects (won’t affect other tabs) */}
          <style>{`
            .projects-shell{
              min-height: 100svh;
              padding: 96px 24px 40px;
              box-sizing: border-box;
              display: grid;
              place-items: center;
            }
            .projects-grid{
              display: grid;
              grid-template-columns: min(64vw, 820px) minmax(320px, 680px);
              align-items: center;
              justify-content: center;
              justify-items: center;
              width: min(1400px, 92vw);
              margin: 0 auto;
              column-gap: clamp(16px, 3.5vw, 72px);
              row-gap: 24px;
              transform: translateX(clamp(-50px, -3vw, 0px));
            }
            .projects-left{ width: 100%; display: grid; place-items: center; }
            .projects-right{ width: 100%; max-width: 500px; }

            /* Stack vertically on narrow viewports to avoid collision */
            @media (max-width: 980px){
              .projects-grid{
                grid-template-columns: 1fr;
                width: min(680px, 92vw);
                column-gap: 0;
                row-gap: 20px;
              }
              .projects-right{ max-width: 680px; }
            }

            /* Ensure the carousel container can’t bleed */
            .projects-left .carousel-container{
              max-width: 100%;
              height: auto;
            }
          `}</style>

          <section className="projects-shell">
            <div className="projects-grid">
              {/* LEFT: Carousel */}
              <div className="projects-left">
                <Carousel
                  items={projectItems}
                  baseWidth={PROJ_W_NUM}
                  baseHeight={PROJ_H_NUM}
                  autoplay={false}
                  pauseOnHover={false}
                  loop={false}
                  round={false}
                  onIndexChange={(i) => setProjIdx(i)}
                />
              </div>

              {/* RIGHT: Description */}
              <div className="projects-right" style={{ textAlign: "left" }}>
                <SplitText
                  rich
                  key={projIdx}
                  className="about-para"
                  splitType="words"
                  delay={5}
                  duration={0.25}
                  ease="power3.out"
                  from={{ opacity: 0, y: 12 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.2}
                  rootMargin="-80px"
                  textAlign="left"
                  wordGap="0.28em"
                  letterGap="0.02em"
                >
                  {projectDescs[projIdx]}
                </SplitText>

                <div className="proj-cta-row">
                  {projectActions[projIdx]?.map(({ label, href }, i) => (
                    <ShinyButton key={i} href={href}>
                      {label}
                    </ShinyButton>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* EXTRAS */}
      {tab === "extras" && (
        <div className="hero">
          <h1 className="hero-title">
            <span className="line">
              <DecryptedText text="Personal projects coming soon!" animateOn="view" speed={30} maxIterations={24} />
            </span>
          </h1>
        </div>
      )}

      {/* RESUME */}
      {tab === "resume" && (
        <section
          id="resume"
          style={{
            padding: "0 16px",
            paddingTop: "calc(env(safe-area-inset-top) + 92px)", // clears glass nav
            scrollMarginTop: "calc(env(safe-area-inset-top) + 88px)",
            overflow: "hidden", // hide any spill from inside
          }}
        >
          <div
            style={{
              width: "min(1000px, 92vw)",
              margin: "0 auto",
              /* Viewport-sized shell: PDF (1fr) + buttons (auto) */
              height: "calc(100vh - (env(safe-area-inset-top) + 88px) - 16px)",
              display: "grid",
              gridTemplateRows: "1fr auto",
              gap: 12,
              overflow: "hidden",
            }}
          >
            {/* PDF fills the available row; only this scrolls */}
            <object
              data={pdfNoChrome}
              type="application/pdf"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "rgba(0,0,0,0.04)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                overflow: "hidden",
              }}
              aria-label="Resume PDF"
            >
              <iframe
                src={pdfNoChrome}
                title="Resume"
                style={{ width: "100%", height: "100%", border: "none", borderRadius: 16 }}
              />
            </object>

            {/* Buttons below */}
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <a className="shiny-btn" href={cvUrl} target="_blank" rel="noopener noreferrer">
                Open Resume in New Tab
              </a>
              <a className="shiny-btn" href={cvUrl} download>
                Download PDF
              </a>
            </div>
          </div>
        </section>      
      )}
      
      {/* copyright chip — add here */}
      <div className="site-chip">© {year} Gokul Raju</div>

    </div>
  );
}
