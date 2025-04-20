// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP ScrollTrigger
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
  }

  // Preloader
  const loader = document.getElementById("loader")
  const loaderBar = document.querySelector(".loader-bar")

  // Simple loader animation
  gsap.to(loaderBar, {
    width: "100%",
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => {
      gsap.to(loader, {
        y: "-100%",
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          loader.style.display = "none"
          initAnimations()
        },
      })
    },
  })

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll("a")
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden")
      })
    })
  }

  // Form submission
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const subject = document.getElementById("subject").value
      const message = document.getElementById("message").value

      // Here you would typically send the form data to a server
      // For now, we'll just show an alert
      alert(`Thank you for your message, ${name}! I'll get back to you soon.`)

      // Reset form
      contactForm.reset()
    })
  }

  // Initialize particles.js for background effect
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
    })
  }
})

// Initialize all animations
function initAnimations() {
  // Hero section animations
  animateHero()

  // Reveal animations on scroll
  initScrollAnimations()

  // Skill progress bars
  animateSkillBars()
}

// Hero section animations
function animateHero() {
  if (typeof gsap === "undefined") return

  const heroTitle = document.querySelector(".hero-title")
  const heroSubtitle = document.querySelector(".hero-subtitle")
  const heroText = document.querySelector(".hero-text")
  const heroButtons = document.querySelector(".hero-buttons")

  const tl = gsap.timeline()

  // Animate hero title (word by word)
  const titleSpans = heroTitle.querySelectorAll("span")
  tl.to(titleSpans, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
  })
    .to(
      heroSubtitle,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .to(
      heroText,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4",
    )
    .to(
      heroButtons,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4",
    )
}

// Scroll animations
function initScrollAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    // Fallback to basic reveal on scroll if GSAP is not available
    window.addEventListener("scroll", basicScrollReveal)
    basicScrollReveal() // Initial check
    return
  }

  // Reveal content on scroll with GSAP
  const revealContents = document.querySelectorAll(".reveal-content")

  revealContents.forEach((content) => {
    gsap.from(content, {
      scrollTrigger: {
        trigger: content,
        start: "top 80%",
        toggleActions: "play none none none",
        onEnter: () => content.classList.add("is-visible"),
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    })
  })

  // Section titles animation
  const sectionTitles = document.querySelectorAll(".section-title")

  sectionTitles.forEach((title) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    })
  })

  // Project cards animation
  const projectCards = document.querySelectorAll(".project-card")

  projectCards.forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    })
  })
}

// Basic scroll reveal fallback (no GSAP)
function basicScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-content")
  const windowHeight = window.innerHeight

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    if (elementTop < windowHeight * 0.8) {
      element.classList.add("is-visible")
    }
  })
}

// Animate skill bars
function animateSkillBars() {
  const skillCards = document.querySelectorAll(".skill-card")

  skillCards.forEach((card) => {
    const progressBar = card.querySelector(".skill-progress-bar")
    const progress = progressBar.getAttribute("data-progress")

    if (typeof gsap !== "undefined") {
      gsap.to(progressBar, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        width: progress + "%",
        duration: 1.5,
        ease: "power2.out",
      })
    } else {
      // Fallback without GSAP
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              progressBar.style.width = progress + "%"
              progressBar.style.transition = "width 1.5s ease-out"
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.5 },
      )

      observer.observe(card)
    }
  })
}
