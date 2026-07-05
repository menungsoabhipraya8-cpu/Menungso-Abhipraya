// 1. Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
})
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// 1.5 Smart Navigation (Hide on scroll down)
let lastScrollY = window.scrollY;
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    if (window.scrollY > lastScrollY) {
      nav.classList.add('nav-hidden'); // Scrolling down
    } else {
      nav.classList.remove('nav-hidden'); // Scrolling up
    }
  } else {
    nav.classList.remove('nav-hidden'); // At top
  }
  lastScrollY = window.scrollY;
});

// 2. Custom Cursor (Difference Blend Mode)
const cursorDot = document.querySelector('.cursor-dot');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
window.addEventListener('mousedown', () => cursorDot.classList.add('clicked'));
window.addEventListener('mouseup', () => cursorDot.classList.remove('clicked'));

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.2;
  cursorY += (mouseY - cursorY) * 0.2;
  cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverElements = document.querySelectorAll('a, button, input, textarea, .tilt-img, .art-placeholder, .flip-card');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursorDot.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovered'));
});


// 3. Interactive Canvas Background (Elegant Subtle Network)
const canvas = document.getElementById('bg-canvas');
if(canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const numParticles = window.innerWidth < 768 ? 30 : 60; // Fewer particles for a cleaner look

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.2; // Slower velocity
      this.vy = (Math.random() - 0.5) * 0.2;
      this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Subtle mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        this.x -= dx * 0.005; // Gentle push
        this.y -= dy * 0.005;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // Soft white/grey dots
      ctx.fill();
    }
  }

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          // Very subtle red connection
          ctx.strokeStyle = `rgba(230, 57, 70, ${0.15 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}


// 4. Menu 1: Text Scramble (Glitch) Logic
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// 5. GSAP Cinematic Animations
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Preloader & Hero Reveal Animation
  const heroSplit = new SplitType('.giant-text', { types: 'lines, words, chars' });
  const tl = gsap.timeline();
  
  // 1. Intro Animation
  tl.to('.preloader-logo', { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.5 })
    .to('.preloader-text', { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', duration: 1, ease: "power2.out" }, "-=0.3")
    .to('#preloader', { opacity: 0, duration: 1, ease: "power2.inOut", delay: 0.8 })
    .set('#preloader', { display: 'none' })
    // 2. Hero Reveal (after intro)
    .to('.logo-hero', { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.2")
    .from(heroSplit.chars, { 
      y: 100, 
      opacity: 0, 
      rotationZ: 10,
      duration: 1, 
      stagger: 0.05, 
      ease: "power4.out" 
    }, "-=0.5")
    .to('.hero-subtext', { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5");

  // Section Titles Reveal
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    const splitTitle = new SplitType(title, { types: 'words, chars' });
    gsap.fromTo(splitTitle.chars, 
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.02, ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          onEnter: () => {
            gsap.set(title, { opacity: 1 }); // Ensure wrapper is visible
          }
        }
      }
    );
  });

  // Text Blocks & Headers Reveal
  gsap.utils.toArray('.text-block, .portfolio-header, .form-container, .vision-box').forEach(block => {
    gsap.fromTo(block, 
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: block, start: "top 85%" }
      }
    );
  });

  // Story Blocks Stagger Reveal
  gsap.utils.toArray('.story-block').forEach(block => {
    gsap.fromTo(block, 
      { y: 100, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: block, start: "top 80%" }
      }
    );
  });

  // Mission Items Reveal
  gsap.utils.toArray('.mission-item').forEach((item, i) => {
    gsap.fromTo(item, 
      { x: -50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: i * 0.15,
        scrollTrigger: { trigger: '.mission-list', start: "top 85%" }
      }
    );
  });

  // Parallax Images
  gsap.utils.toArray('.art-placeholder, .story-image .parallax-img').forEach(img => {
    gsap.to(img, {
      yPercent: 20, // Moves image down as you scroll
      ease: "none",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom", 
        end: "bottom top",
        scrub: true
      } 
    });
  });

  // Floating Decorative Elements Parallax
  gsap.utils.toArray('.floating-decor').forEach((decor, i) => {
    const speed = decor.dataset.speed || (i % 2 === 0 ? 30 : -40); // Alternating directions if not specified
    gsap.to(decor, {
      yPercent: speed,
      rotation: (i % 2 === 0 ? 15 : -15),
      ease: "none",
      scrollTrigger: {
        trigger: decor.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5 // 1.5s lag for smooth floaty feel
      }
    });
  });

  // Flip Cards Stagger
  gsap.utils.toArray('.flip-card').forEach((card, i) => {
    gsap.fromTo(card, 
      { y: 100, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: {
          trigger: card.parentElement,
          start: "top 80%"
        },
        delay: i * 0.1
      }
    );
  });

  // Scramble Text Trigger
  const scrambleElements = document.querySelectorAll('.scramble-text');
  scrambleElements.forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const text = el.getAttribute('data-text');
        const scrambler = new TextScramble(el);
        scrambler.setText(text);
      }
    });
  });
}


// 6. Magnetic Elements (Buttons & Nav)
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach((btn) => {
  btn.addEventListener('mousemove', function(e) {
    const position = btn.getBoundingClientRect();
    const x = e.clientX - position.left - position.width / 2;
    const y = e.clientY - position.top - position.height / 2;
    btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
  });
  btn.addEventListener('mouseleave', function() {
    btn.style.transform = 'translate(0px, 0px)';
  });
});


// 7. Form WhatsApp Redirect
const formPendaftaran = document.getElementById('formPendaftaran');
if (formPendaftaran) {
  formPendaftaran.addEventListener('submit', function(e) {
    e.preventDefault(); 
    const nama = document.getElementById('nama').value;
    const email = document.getElementById('email').value;
    const domisili = document.getElementById('domisili').value;
    const cerita = document.getElementById('cerita').value;
    const nomorWA = "6281383745243"; 
    const teksPesan = `Halo Menungso Abhipraya! Saya ingin mendaftar.%0A%0A*Nama:* ${nama}%0A*Email:* ${email}%0A*Domisili:* ${domisili}%0A*Cerita:* ${cerita}`;
    const urlWhatsApp = `https://wa.me/${nomorWA}?text=${teksPesan}`;
    window.open(urlWhatsApp, '_blank');
  });
}

// 8. Main Gallery Slider Logic
window.slideGallery = function(direction) {
  const gallery = document.getElementById('portfolio-gallery');
  if (gallery) {
    const scrollAmount = 330; // 300px item width + 30px gap
    gallery.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }
};

// 9. Portfolio Modal Logic
const portfolioData = {
  'avant-garde': {
    title: 'AVANT GARDE',
    img: 'img/avant.jpg',
    desc: 'Avant Garde adalah pameran seni eksperimental yang memadukan kreativitas tanpa batas dengan elemen-elemen surealisme. Mengusung konsep "Style Without Rules", pameran ini menantang norma-norma konvensional dalam berkesenian. Acara ini akan menampilkan instalasi interaktif, pertunjukan teatrikal kontemporer, dan berbagai karya seni disruptif yang dipresentasikan oleh seniman-seniman muda berbakat. Jadilah bagian dari pergerakan yang akan merusak batasan ("Briseur de barrières") dan mendefinisikan ulang makna seni.'
  },
  'propasia-vol1': {
    title: 'PROPASIA VOL.1',
    img: 'img/poster.jpg',
    desc: 'Propasia Vol.1 adalah pertunjukan seni yang mengangkat sisi magis dan mendalam dari kehidupan. Di bawah Pimpinan Produksi Dwi Laksana, Sutradara Majeng, dan para Crew yang bertugas, karya ini mengajak Anda menyelami harmoni alam dan emosi manusia. Perpaduan visual antara flora mekar dan elemen kematian surealis (tengkorak) melambangkan siklus penciptaan dan kefanaan yang dirangkai secara epik.'
  },
  'propasia-vol2': {
    title: 'PROPASIA VOL.2',
    img: 'img/propasia 2.jpg',
    desc: 'Propasia (Problematika Manusia) Vol.2 kembali hadir mengangkat isu-isu kompleks tentang manusia dan lika-liku kehidupannya. Melalui berbagai medium seni, acara ini membedah realitas problematika sosial dan emosional yang sering disembunyikan. Didukung oleh deretan seniman berbakat, Propasia Vol.2 bukan sekadar tontonan, melainkan sebuah refleksi nyata atas diri kita sendiri.'
  },
  'parade-teater': {
    title: 'PARADE TEATER',
    img: 'img/Postrer.jpg',
    desc: 'Parade Teater adalah perayaan seni panggung yang mempertemukan berbagai kelompok teater dalam satu panggung megah. Bertempat di Lieben Coffee, acara ini menjadi ajang kolaborasi dan ekspresi gaya panggung, gaya karakter yang realis, dengan pesan mendalam di setiap penampilannya.'
  },
  'nekat': {
    title: 'NEKAT NYENI',
    img: 'img/468570376_17914944594013888_1358697949049786426_n.jpg',
    desc: 'Menungso Abhipraya Present: NEKAT (Nyeni Akhir Tahun). Sebuah persembahan akhir tahun yang melibatkan Mujahid, Ucup, Majeng, dan Ardha. Menghadirkan olah tubuh, puisi, siraman rohani, musik, dan games interaktif.'
  },
  'nekat-vol2': {
    title: 'NEKAT VOL 2',
    img: 'img/nekat vol 2.jpg',
    desc: 'NEKAT VOL 2: Harapan & Realita. Menampilkan Puisi "2009" oleh M. Ardha Putra Heyanda, Screening Film "SIMEUT", Performance Arts "KALCER" (Majeng, Reynaldi Al Ghifari, Kipel), Talkshow Film, dan Talkshow Nekat Vol.2 ft. Majeng. Bertempat di Lapangan Sigura-Gura Raya.'
  },
  'nekat-vol3': {
    title: 'NEKAT VOL.3',
    img: 'img/nekat 3.jpg',
    desc: 'NEKAT VOL.3 "Refleksi". Digelar pada 27 - 28 Desember 2025 di 224 Coffee Tangerang (Jl. Jabal Mina Raya, Klp. Dua). Menampilkan Exhibition, Performance Art, Workshop, Discussion, Live Music, dan Experimentation.'
  }
};

const portfolioKeys = Object.keys(portfolioData);
let currentPortfolioIndex = 0;

const modal = document.getElementById('portfolio-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');

window.openModal = function(id) {
  currentPortfolioIndex = portfolioKeys.indexOf(id);
  updateModalContent();
  modal.classList.add('show');
};

function updateModalContent() {
  const id = portfolioKeys[currentPortfolioIndex];
  const data = portfolioData[id];
  if (data) {
    modalImg.src = data.img;
    // Simple fade animation
    modalImg.style.opacity = 0.3;
    setTimeout(() => {
      modalImg.style.transition = "opacity 0.5s ease";
      modalImg.style.opacity = 1;
    }, 50);
    
    modalTitle.innerText = data.title;
    modalDesc.innerText = data.desc;
  }
}

window.prevModal = function() {
  currentPortfolioIndex = (currentPortfolioIndex - 1 + portfolioKeys.length) % portfolioKeys.length;
  updateModalContent();
};

window.nextModal = function() {
  currentPortfolioIndex = (currentPortfolioIndex + 1) % portfolioKeys.length;
  updateModalContent();
};

window.closeModal = function() {
  modal.classList.remove('show');
};