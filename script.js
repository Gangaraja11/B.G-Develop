let currentSection = "home";
let sectionHistory = ["home"];
let isGoingBack = false;

/* =========================
   SECTION NAVIGATION
========================= */
function showSection(id) {
    const sections = document.querySelectorAll("section");
    const current = document.querySelector("section.active");
    const next = document.getElementById(id);
    
    if (current === next) return;

    const sectionArray = [...sections];

    // detect direction properly
    const currentIndex = sectionArray.indexOf(current);
    const nextIndex = sectionArray.indexOf(next);

    const isForward = nextIndex > currentIndex;

    // prepare next BEFORE showing
    next.style.display = "block";
    next.style.transition = "none";

    // set starting position correctly
    next.style.transform = isForward
        ? "translateX(100%)"
        : "translateX(-100%)";

    next.style.opacity = "0";

    // force reflow
    next.offsetHeight;

    // enable animation
    next.style.transition = "all 0.5s ease";

    // animate both
    current.style.transform = isForward
        ? "translateX(-100%)"
        : "translateX(100%)";
    current.style.opacity = "0";

    next.style.transform = "translateX(0)";
    next.style.opacity = "1";

    // after animation cleanup
    setTimeout(() => {
        current.classList.remove("active");
        current.style.display = "none";
        current.style.transform = "";
        current.style.opacity = "";

        next.classList.add("active");
    }, 500);

    // ONLY push when NOT going back
if (!isGoingBack) {
    if (sectionHistory[sectionHistory.length - 1] !== id) {
        sectionHistory.push(id);
    }
}

currentSection = id;

// reset flag
isGoingBack = false;


    // close menu
    document.getElementById("menu").classList.remove("active");

    // scroll top
    window.scrollTo(0, 0);

    // re-trigger animations
    if (id === "plans") setTimeout(animatePlans, 150);
    if (id === "work") setTimeout(initWorkAnimation, 150);
    if (id === "why") setTimeout(initWhyAnimation, 150);
    if (id === "process") setTimeout(() => {
        initProcessAnimation();
        startProcessFlow();
    }, 150);
    if (id === "contact") {
    resetQuickIcons(); // reset every time
    setTimeout(initQuickIconsObserver, 200);
    }
    if (id === "about") {
    setTimeout(() => {
        initAboutAnimation();
        animateCounters(); // direct trigger
    }, 200);
    }

    // SHOW / HIDE BACK BUTTON
const backBtn = document.getElementById("backHome");

if (id === "home") {
    backBtn.classList.remove("show");
} else {
    backBtn.classList.add("show");
}

}

/* =========================
   MOBILE MENU
========================= */
function toggleMenu() {
    const menu = document.getElementById("menu");
    const icon = document.getElementById("menuIcon");

    menu.classList.toggle("active");

    // toggle icon (☰ ↔ ✖)
    if (menu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
        icon.classList.add("rotate");
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
        icon.classList.remove("rotate");
    }
}
// CLOSE WHEN CLICK MENU ITEM
document.querySelectorAll("#menu li").forEach(item => {
    item.addEventListener("click", () => {
        closeMenu();
    });
});

// CLOSE WHEN CLICK OUTSIDE
document.addEventListener("click", (e) => {
    const menu = document.getElementById("menu");
    const toggle = document.querySelector(".menu-toggle");

    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
    }
});

function closeMenu() {
    const menu = document.getElementById("menu");
    const icon = document.getElementById("menuIcon");

    menu.classList.remove("active");

    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
    icon.classList.remove("rotate");
}

/* =========================
   TYPING EFFECT (HOME)
========================= */
const services = [
    "Business Websites",
    "Landing Pages",
    "Shop Websites",
    "Modern Designs"
];

let i = 0;
let j = 0;
let isDeleting = false;

function typeEffect() {
    const currentText = services[i];
    const displayText = currentText.substring(0, j);

    document.getElementById("typing").innerHTML = displayText;

    if (!isDeleting && j < currentText.length) {
        j++;
        setTimeout(typeEffect, 80);
    } 
    else if (isDeleting && j > 0) {
        j--;
        setTimeout(typeEffect, 40);
    } 
    else {
        isDeleting = !isDeleting;

        if (!isDeleting) {
            i = (i + 1) % services.length;
        }

        setTimeout(typeEffect, 1500);
    }
}

window.addEventListener("load", typeEffect);

/* =========================
   PLANS ANIMATION
========================= */
function animatePlans() {
    const cards = document.querySelectorAll(".plan-card");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {

            if (entry.isIntersecting) {

                // restart animation
                entry.target.style.animation = "none";
                entry.target.classList.remove("show");

                setTimeout(() => {
                    entry.target.style.animation = "";
                    entry.target.classList.add("show");
                }, index * 150);

            } else {
                // reset when out of view → allows repeat
                entry.target.classList.remove("show");
            }

        });
    }, {
        threshold: 0.25
    });

    cards.forEach(card => observer.observe(card));
}

//----------about section--------
function initAboutAnimation() {
    const text = document.querySelector(".about-text");
    const cards = document.querySelectorAll(".about-card");

    // reset everything first (IMPORTANT)
    text.classList.remove("show");
    cards.forEach(card => card.classList.remove("show"));

    // animate text
    setTimeout(() => {
        text.classList.add("show");
    }, 100);

    // observer for cards (repeatable)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {

                // restart animation every time
                entry.target.classList.remove("show");

                setTimeout(() => {
                    entry.target.classList.add("show");
                }, index * 180);

            } else {
                // reset when out of view (so it replays)
                entry.target.classList.remove("show");
            }
        });
    }, {
        threshold: 0.3
    });

    cards.forEach(card => observer.observe(card));
}


/* ===== COUNTER ANIMATION ===== */

function animateCounters() {
    const counters = document.querySelectorAll(".counter");
    const boxes = document.querySelectorAll(".stat-box");

    counters.forEach((counter, index) => {

        const target = +counter.getAttribute("data-target");
        const prefix = counter.getAttribute("data-prefix") || "";
        const suffix = counter.getAttribute("data-suffix") || "";

        const duration = 2500;
        const startTime = performance.now();

        counter.innerText = "0";
        boxes[index].classList.remove("show");

        setTimeout(() => {

            boxes[index].classList.add("show");

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOut = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(easeOut * target);

                counter.innerText = prefix + value + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.innerText = prefix + target + suffix;
                }
            }

            requestAnimationFrame(update);

        }, index * 300);
    });
}


/* =========================
   WORK ANIMATION
========================= */
function initWorkAnimation() {
    const cards = document.querySelectorAll(".work-card");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {

            if (entry.isIntersecting) {

                // restart animation every time
                entry.target.classList.remove("show");

                setTimeout(() => {
                    entry.target.classList.add("show");
                }, index * 150);

            } else {
                // remove when out of view → allows replay
                entry.target.classList.remove("show");
            }

        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
}


//-------why section--------
function initWhyAnimation() {
    const cards = document.querySelectorAll(".why-card");
    const isMobile = window.innerWidth <= 768;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {

            if (entry.isIntersecting) {

                // reset for replay
                entry.target.classList.remove("show", "bubble");

                setTimeout(() => {
                    if (isMobile) {
                        entry.target.classList.add("show", "bubble");
                    } else {
                        entry.target.classList.add("show");
                    }
                }, index * 200);

            } else {
                // remove when out → allows repeat
                entry.target.classList.remove("show", "bubble");
            }

        });
    }, {
        threshold: 0.25
    });

    cards.forEach(card => observer.observe(card));
}


// --------------process section-----------
function initProcessAnimation() {
    const steps = document.querySelectorAll(".process-step");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {

            if (entry.isIntersecting) {

                // reset for replay
                entry.target.classList.remove("show");

                setTimeout(() => {
                    entry.target.classList.add("show");
                }, index * 180); // smooth stagger

            } else {
                // remove when out → allows repeat
                entry.target.classList.remove("show");
            }

        });
    }, {
        threshold: 0.25
    });

    steps.forEach(step => observer.observe(step));
}

function startProcessFlow() {
    const steps = document.querySelectorAll(".process-step");

    let index = 0;

    function flow() {
        steps.forEach(step => step.classList.remove("flow"));

        steps[index].classList.add("flow");

        index = (index + 1) % steps.length;

        setTimeout(flow, 1600); // smooth speed
    }

    flow();
}


// -------------contact section-----------

// Show/hide "Other" input
document.getElementById("type").addEventListener("change", function () {
    const otherInput = document.getElementById("otherType");

    if (this.value === "Other") {
        otherInput.style.display = "block";
    } else {
        otherInput.style.display = "none";
    }
});


// WhatsApp send function
function sendWhatsApp() {
    let name = document.getElementById("name").value;
    let type = document.getElementById("type").value;
    let otherType = document.getElementById("otherType").value;
    let budget = document.getElementById("budget").value;
    let message = document.getElementById("message").value;

    // replace type if "Other"
    if (type === "Other" && otherType) {
        type = otherType;
    }

    let text =
        `Hello, my name is ${name}%0A` +
        `I want a ${type}%0A` +
        `Budget: ${budget}%0A` +
        `Project details: ${message}`;

    let url = `https://wa.me/9035597891?text=${text}`;

    window.open(url, "_blank");
}

//--------back button-----
function goHome() {
    const btn = document.getElementById("backHome");

    btn.classList.add("rotate");

    setTimeout(() => {
        btn.classList.remove("rotate");

        if (sectionHistory.length > 1) {

            sectionHistory.pop();
            const prev = sectionHistory[sectionHistory.length - 1];

            isGoingBack = true;
            showSection(prev);

        } else {
            // at HOME → trigger exit logic
            handleExit();
        }

    }, 200);
}

//------to exit feature---------
let lastBackPress = 0;

function handleExit() {
    const now = new Date().getTime();
    const toast = document.getElementById("exitToast");

    if (now - lastBackPress < 2000) {
        // allow exit
        window.history.back();
    } else {
        // show message
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 1500);

        lastBackPress = now;
    }
}
window.addEventListener("popstate", function () {

    if (currentSection !== "home") {
        goHome(); // go to previous section
        history.pushState(null, null, location.href);
    } else {
        handleExit();
    }

});

//---------videos sliding----------

/* ===== VIDEO SLIDER FINAL ===== */

const slider = document.getElementById("videoSlider");
const videos = document.querySelectorAll(".video");
const dotsContainer = document.getElementById("videoDots");

let index = 0;
let total = videos.length;

/* CREATE DOTS */
videos.forEach((_, i) => {
    const dot = document.createElement("span");

    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
        index = i;
        slideTo(index);
    });

    dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll("span");

/* UPDATE ACTIVE */
function updateActive(i) {
    videos.forEach(v => v.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    videos[i].classList.add("active");
    dots[i].classList.add("active");
}

/* PLAY VIDEO */
function playVideo(i) {
    videos.forEach(v => {
        v.pause();
        v.currentTime = 0;
    });

    videos[i].play();
}

/* SLIDE */
function slideTo(i) {
    slider.style.transform = `translateX(-${i * 100}%)`;
    updateActive(i);
    playVideo(i);
}

/* AUTO NEXT AFTER VIDEO ENDS */
videos.forEach((video, i) => {
    video.addEventListener("ended", () => {
        index = (i + 1) % total;
        slideTo(index);
    });
});

/* START */
slideTo(0);

/* ===== SWIPE SUPPORT ===== */
let startX = 0;

slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

slider.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if (diff > 50) {
        index = (index + 1) % total;
    } else if (diff < -50) {
        index = (index - 1 + total) % total;
    }

    slideTo(index);
});


/* ===== QUICK ICON BUBBLE ANIMATION ===== */
/* ===== ICON SCROLL ANIMATION (BEST METHOD) ===== */

/* ===== ICON OBSERVER (REPEATABLE) ===== */

function initQuickIconsObserver() {
    const icons = document.querySelectorAll(".q-icon");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {

                setTimeout(() => {
                    entry.target.classList.add("show");
                }, index * 150);

            } else {
                // REMOVE when out of view → allows replay
                entry.target.classList.remove("show");
            }
        });
    }, {
        threshold: 0.3
    });

    icons.forEach(icon => observer.observe(icon));
}

function resetQuickIcons() {
    const icons = document.querySelectorAll(".q-icon");

    icons.forEach(icon => {
        icon.classList.remove("show");
    });
}