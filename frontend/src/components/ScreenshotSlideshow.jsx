// frontend/src/components/ScreenshotSlideshow.jsx
import { useState, useEffect } from 'react';

const ScreenshotSlideshow = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [images.length, interval]);

  return (
    <div className="slideshow-container">
      {/* Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`slide-image ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Glass Overlay/Border Effect */}
      <div className="slideshow-frame" />

      {/* Dots Indicator */}
      <div className="slideshow-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)} // Allow manual click
          />
        ))}
      </div>
    </div>
  );
};

export default ScreenshotSlideshow;