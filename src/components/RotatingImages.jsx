import React from "react";
import "../styles/rotating-images.scss";
import img1 from "../assets/images/sale-stitch.png";
import img2 from "../assets/images/twobutton.png";

export default function RotatingImages({
  size = 300, // base size for both images
  speed = 40, // seconds per full rotation
}) {
  return (
    <div className="rotating-images">
      <img
        src={img1}
        alt="Image 1"
        className="rotating rotating-left"
        style={{ width: size, animationDuration: `${speed}s` }}
      />
      <img
        src={img2}
        alt="Image 2"
        className="rotating rotating-right"
        style={{ width: size, animationDuration: `${speed}s` }}
      />
    </div>
  );
}
