/* ---------- NAV ---------- */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
});

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => navLinks.classList.remove("open"));
});

/* ---------- COUNTDOWN ---------- */
const weddingDate = new Date("2026-11-12T14:00:00+08:00").getTime();
const elDays = document.getElementById("cd-days");
const elHours = document.getElementById("cd-hours");
const elMins = document.getElementById("cd-mins");
const elSecs = document.getElementById("cd-secs");

function pad(n) {
    return n.toString().padStart(2, "0");
}

function bump(el, val) {
    if (el.textContent !== val) {
        el.textContent = val;
        el.classList.remove("tick");
        void el.offsetWidth;
        el.classList.add("tick");
    }
}

function updateCountdown() {
    const now = Date.now();
    let diff = weddingDate - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    bump(elDays, days.toString());
    bump(elHours, pad(hours));
    bump(elMins, pad(mins));
    bump(elSecs, pad(secs));
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
const io = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                io.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.18 }
);
revealEls.forEach((el) => io.observe(el));

/* ---------- GIFT GUIDE MODAL ---------- */
const giftGuideCard = document.getElementById("giftGuideCard");
const giftModal = document.getElementById("giftModal");
const giftModalClose = document.getElementById("giftModalClose");

function openGiftModal() {
    giftModal.classList.add("show");
    document.body.style.overflow = "hidden";
}
function closeGiftModal() {
    giftModal.classList.remove("show");
    document.body.style.overflow = "";
}

giftGuideCard.addEventListener("click", openGiftModal);
giftModalClose.addEventListener("click", closeGiftModal);
giftModal.addEventListener("click", (e) => {
    if (e.target === giftModal) closeGiftModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeGiftModal();
});

/* ---------- PRENUP VIDEO PLAYER ---------- */
const vFrame = document.getElementById("videoFrame");
const vVideo = document.getElementById("prenupVideo");
const vOverlay = document.getElementById("videoOverlay");
const vPlayPause = document.getElementById("vPlayPause");
const vMute = document.getElementById("vMute");
const vFullscreen = document.getElementById("vFullscreen");
const vProgress = document.getElementById("vProgress");
const vProgressFill = document.getElementById("vProgressFill");
const vTimeCurrent = document.getElementById("vTimeCurrent");
const vTimeTotal = document.getElementById("vTimeTotal");

function fmtTime(t) {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
        .toString()
        .padStart(2, "0");
    return `${m}:${s}`;
}

function startVideo() {
    vVideo.play().catch(() => {});
    vFrame.classList.add("started");
    vOverlay.classList.add("hidden");
    // pause the wedding song if it's playing so audio doesn't overlap
    if (typeof pauseMusic === "function" && typeof isPlaying !== "undefined" && isPlaying)
        pauseMusic();
}
vOverlay.addEventListener("click", startVideo);

vPlayPause.addEventListener("click", () => {
    if (vVideo.paused) {
        vVideo.play();
    } else {
        vVideo.pause();
    }
});
vVideo.addEventListener("play", () => {
    vPlayPause.querySelector("svg").innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"></path>';
});
vVideo.addEventListener("pause", () => {
    vPlayPause.querySelector("svg").innerHTML = '<path d="M8 5v14l11-7z"></path>';
});

vMute.addEventListener("click", () => {
    vVideo.muted = !vVideo.muted;
    vMute.querySelector("svg").style.opacity = vVideo.muted ? 0.5 : 1;
});

vFullscreen.addEventListener("click", () => {
    if (vFrame.requestFullscreen) {
        vFrame.requestFullscreen();
    }
});

vVideo.addEventListener("loadedmetadata", () => {
    vTimeTotal.textContent = fmtTime(vVideo.duration);
});
vVideo.addEventListener("timeupdate", () => {
    const pct = (vVideo.currentTime / (vVideo.duration || 1)) * 100;
    vProgressFill.style.width = pct + "%";
    vTimeCurrent.textContent = fmtTime(vVideo.currentTime);
});
vProgress.addEventListener("click", (e) => {
    const rect = vProgress.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    vVideo.currentTime = pct * (vVideo.duration || 0);
});

/* ---------- MUSIC WIDGET ---------- */
const audio = document.getElementById("weddingAudio");
const musicBtn = document.getElementById("musicBtn");
const musicPrompt = document.getElementById("musicPrompt");
const musicYes = document.getElementById("musicYes");
const musicNo = document.getElementById("musicNo");
const musicIcon = document.getElementById("musicIcon");
let isPlaying = false;

function playMusic() {
    audio.play().catch(() => {
        /* autoplay blocked; user can retry via button */
    });
    isPlaying = true;
    musicBtn.classList.add("playing");

    musicIcon.classList.remove("fa-volume-xmark");
}
function pauseMusic() {
    audio.pause();
    isPlaying = false;
    musicBtn.classList.remove("playing");

    musicIcon.classList.add("fa-volume-xmark");
}

setTimeout(() => {
    musicPrompt.classList.add("show");
}, 1600);

musicYes.addEventListener("click", () => {
    playMusic();
    musicPrompt.classList.remove("show");
});
musicNo.addEventListener("click", () => {
    musicPrompt.classList.remove("show");
});
musicBtn.addEventListener("click", () => {
    musicPrompt.classList.remove("show");
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

setTimeout(() => {
    if (musicPrompt.classList.contains("show")) musicPrompt.classList.remove("show");
}, 60000);
