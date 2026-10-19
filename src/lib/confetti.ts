import confetti from "canvas-confetti";

export function fireCelebrationConfetti() {
  // Fire a celebratory burst with Saffron, Mint, and Gold colors!
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#FF8A3D", "#3DDBA9", "#FFD166", "#2B2A6B", "#FFFFFF"],
  });
}
