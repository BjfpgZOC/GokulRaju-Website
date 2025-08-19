import React from "react";
import "./ShinyButton.css";

export default function ShinyButton({
  href = "#",
  children = "GitHub",
  target = "_blank",
}) {
  return (
    <a className="shiny-btn" href={href} target={target} rel="noopener noreferrer">
      <span className="shiny-inner">{children}</span>
    </a>
  );
}
