// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu toggle
const navbarToggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");

if (navbarToggler) {
  navbarToggler.addEventListener("click", function () {
    navbarCollapse.classList.toggle("show");
  });
}

// Floating images animation
document.addEventListener("DOMContentLoaded", function () {
  const images = [
    "fotos/plato-sonora.jpg",
    "fotos/plato-sonora2.jpg",
    "fotos/plato-sonora3.jpg",
    "fotos/plato-sonora4.jpg",
    "fotos/plato-sonora5.jpg",
    "fotos/plato-sonora6.jpg",
    "fotos/plato-sonora7.jpg",
    "fotos/plato-sonora8.jpg",
    "fotos/plato-sonora9.jpg",
    "fotos/plato-sonora10.jpg",
    "fotos/plato-sonora11.jpg",
    "fotos/plato-sonora12.jpg",
    "fotos/birria.jpg",
    "fotos/quesabirria.jpg",
    "fotos/tacos.jpg",
    "fotos/tacos2.jpg",
    "fotos/tamales.jpg",
    "fotos/tortillas.jpg",
    "fotos/tortillas2.jpg",
  ];

  const leftFloating = document.querySelector(".left-floating");
  const rightFloating = document.querySelector(".right-floating");
  let leftInterval, rightInterval;

  // Arrays to track active images positions to avoid overlap
  let leftActiveImages = [];
  let rightActiveImages = [];

  function isPositionClear(newTop, newLeft, activeImages, imageSize = 120) {
    // Check if new position overlaps with existing images
    const buffer = 50; // Minimum distance between images
    return !activeImages.some((img) => {
      const existingTop = parseInt(img.style.top);
      const existingLeft =
        parseInt(img.style.left) || parseInt(img.style.right);

      return (
        Math.abs(newTop - existingTop) < imageSize + buffer &&
        Math.abs(newLeft - existingLeft) < imageSize + buffer
      );
    });
  }

  function findClearPosition(container, side, activeImages) {
    const imageSize = 120;
    const attempts = 20; // Maximum attempts to find clear position

    // Use more of the available width
    const maxHorizontalOffset = Math.min(
      container.offsetWidth - imageSize - 20,
      80
    );
    const safeTopMargin = 150;
    const safeBottomMargin = 150;
    const availableHeight =
      container.offsetHeight - safeTopMargin - safeBottomMargin - imageSize;

    for (let i = 0; i < attempts; i++) {
      const randomTop =
        safeTopMargin + Math.random() * Math.max(0, availableHeight);
      const horizontalOffset = Math.random() * maxHorizontalOffset;

      const position = {
        top: randomTop,
        horizontal:
          side === "left" ? 20 + horizontalOffset : 20 + horizontalOffset,
      };

      if (
        isPositionClear(
          position.top,
          position.horizontal,
          activeImages,
          imageSize
        )
      ) {
        return position;
      }
    }

    // If no clear position found, use a random one anyway
    return {
      top: safeTopMargin + Math.random() * Math.max(0, availableHeight),
      horizontal:
        side === "left"
          ? 20 + Math.random() * maxHorizontalOffset
          : 20 + Math.random() * maxHorizontalOffset,
    };
  }

  function createFloatingImage(container, side) {
    const activeImages = side === "left" ? leftActiveImages : rightActiveImages;

    const img = document.createElement("img");
    img.className = "floating-img";
    img.src = images[Math.floor(Math.random() * images.length)];
    img.loading = "lazy";

    // Find a clear position
    const position = findClearPosition(container, side, activeImages);

    img.style.top = position.top + "px";
    if (side === "left") {
      img.style.left = position.horizontal + "px";
    } else {
      img.style.right = position.horizontal + "px";
    }

    // Random scale for variety (smaller range to avoid huge images)
    const scale = 0.85 + Math.random() * 0.3; // Scale between 0.85 and 1.15
    img.style.transform = `scale(${scale})`;

    // Random animation delay
    const delay = Math.random() * 800;
    img.style.animationDelay = delay + "ms";

    container.appendChild(img);

    // Add to active images tracking
    activeImages.push(img);

    // Remove image after animation
    const removeTime = 4500 + Math.random() * 1500; // 4.5-6 seconds
    setTimeout(() => {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
        // Remove from active tracking
        const index = activeImages.indexOf(img);
        if (index > -1) {
          activeImages.splice(index, 1);
        }
      }
    }, removeTime);
  }

  function startFloatingAnimation() {
    if (leftFloating && rightFloating) {
      // More controlled intervals to prevent overcrowding
      leftInterval = setInterval(() => {
        // Only create new image if not too many active
        if (leftActiveImages.length < 3) {
          createFloatingImage(leftFloating, "left");
        }
      }, 2000 + Math.random() * 1000); // 2-3 seconds

      rightInterval = setInterval(() => {
        // Only create new image if not too many active
        if (rightActiveImages.length < 3) {
          createFloatingImage(rightFloating, "right");
        }
      }, 2200 + Math.random() * 1300); // 2.2-3.5 seconds

      // Create initial images with more spacing
      setTimeout(() => createFloatingImage(leftFloating, "left"), 500);
      setTimeout(() => createFloatingImage(rightFloating, "right"), 1500);
      setTimeout(() => createFloatingImage(leftFloating, "left"), 3000);
      setTimeout(() => createFloatingImage(rightFloating, "right"), 4500);
    }
  }

  // Start animation when menu section is visible
  const menuSection = document.getElementById("menu");
  if (menuSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startFloatingAnimation();
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(menuSection);
  }
});
