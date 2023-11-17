// Footer.jsx
import React from "react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear(); // Get the current year using JavaScript

  return (
    <footer className="footer">
      <p>© {currentYear} zkHub Inc</p>{" "}
      {/* Dynamically display the current year */}
      <div className="footer-links">
        <a
          href="https://www.zkHub.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Website
        </a>
        <a
          href="https://github.com/zkHubHQ/"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.twitter.com/zkHubHQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </div>
    </footer>
  );
}

export default Footer;
