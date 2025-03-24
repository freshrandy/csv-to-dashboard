import React, { useEffect, useRef } from "react";

const ParticleBackground = ({
  color = "#ffffff",
  particleCount = 30,
  speed = 1,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    // Set canvas size to match parent element
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;

      // Recreate particles when canvas is resized
      createParticles();
    };

    // Create particles
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    // Update and draw particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Reset position if particle goes off canvas
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.x = Math.random() * canvas.width;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.y = Math.random() * canvas.height;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, particleCount, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Make sure it doesn't interfere with interactions
      }}
    />
  );
};

export default ParticleBackground;
