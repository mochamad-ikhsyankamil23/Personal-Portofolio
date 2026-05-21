import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import "./App.css";
import profilePhoto from "./assets/profile.JPG";
import emailjs from '@emailjs/browser';

// ============================================
// EMAILJS CONFIGURATION
// ============================================
const EMAILJS_SERVICE_ID = "service_0ts0cqv";
const EMAILJS_TEMPLATE_ID = "template_ern4bv7";
const EMAILJS_PUBLIC_KEY = "BCMKy3NOZgTyfd2mJ";

// ============================================
// TRANSLATION SYSTEM
// ============================================
const translations = {
  id: {
    // Navigation
    home: "Home",
    about: "About",
    portfolio: "Portofolio",
    certificates: "Sertifikat",
    contactMe: "Hubungi Saya",
    
    // Hero Section
    hiImA: "👋 Hai, saya seorang",
    fullStack: "Full Stack",
    developer: "Developer",
    heroDesc: "Saya membangun pengalaman digital yang indah, cepat, dan fungsional. Dari UI yang memukau hingga arsitektur backend yang solid.",
    viewMyWork: "Lihat Karya Saya",
    certification: "Sertifikasi",
    
    // About Section
    aboutMe: "Tentang Saya",
    aboutText: "Saya adalah seorang Fresh Graduate jurusan Pengembangan Perangkat Lunak dan Gim (PPLG) dari SMK Wikrama Bogor, sekolah yang terkenal dengan kedisiplinan dan kurikulum berbasis industri. Selama masa sekolah, saya telah membangun berbagai proyek aplikasi web, menguasai logika pemrograman yang kuat, serta terbiasa bekerja dalam tim menggunakan metodologi Agile. Berbasis di Bogor, saya siap membawa keterampilan teknis dan etos kerja profesional saya untuk berkembang bersama perusahaan teknologi dan startup inovatif.",
    
    // Status & Info
    status: "Status",
    readyForWork: "Ready For Work",
    education: "Pendidikan",
    educationText: "SMK WIKRAMA BOGOR - Pemograman Perangkat Lunak dan Gim",
    location: "Lokasi",
    locationText: "Cigombong, Kabupaten Bogor, Jawa Barat, Indonesia",
    
    // Career
    pathCareer: "Path Career",
    juniorWebDev: "Junior Web Developer",
    companyName: "PT. Tirta Investama",
    
    // Portfolio
    featuredProjects: "Project Pilihan",
    viewProject: "Lihat Proyek",
    
    // Certificates
    certAndMicro: "Sertifikasi & Micro Credentials",
    professionalCredentials: "Kredensial Profesional",
    viewCertificate: "Lihat Sertifikat",
    open: "Buka",
    
    // Contact
    contact: "Hubungi",
    letsCollaborate: "Mari Bekerja Sama",
    contactDesc: "Punya proyek menarik? Atau hanya ingin ngobrol santai tentang teknologi? Saya selalu terbuka untuk diskusi dan kolaborasi baru.",
    email: "Email",
    phone: "Telepon",
    instagram: "Instagram",
    
    // Form
    fullName: "Nama Lengkap",
    subject: "Subjek",
    message: "Pesan",
    subjectPlaceholder: "Diskusi proyek, kolaborasi, dll.",
    messagePlaceholder: "Halo, saya ingin mendiskusikan...",
    sendMessage: "Kirim Pesan",
    sending: "Mengirim...",
    successMessage: "Pesan Terkirim! Terima kasih 🙏",
    errorMessage: "Gagal mengirim, coba lagi",
    successHint: "✅ Pesan berhasil dikirim! Saya akan membalas secepatnya.",
    errorHint: "⚠️ Gagal mengirim pesan. Silakan coba lagi atau hubungi langsung via email.",
    
    // Footer
    techStack: "Tech Stack & Tools",
    allRights: "All rights reserved.",
  },
  en: {
    // Navigation
    home: "Home",
    about: "About",
    portfolio: "Portfolio",
    certificates: "Certificates",
    contactMe: "Contact Me",
    
    // Hero Section
    hiImA: "👋 Hi, I'm a",
    fullStack: "Full Stack",
    developer: "Developer",
    heroDesc: "I build beautiful, fast, and functional digital experiences. From stunning UI to solid backend architecture.",
    viewMyWork: "View My Work",
    certification: "Certifications",
    
    // About Section
    aboutMe: "About Me",
    aboutText: "I am a Fresh Graduate majoring in Software and Game Development (PPLG) from SMK Wikrama Bogor, a school known for its discipline and industry-based curriculum. During my time at school, I have built various web application projects, mastered strong programming logic, and am accustomed to working in teams using Agile methodology. Based in Bogor, I am ready to bring my technical skills and professional work ethic to grow with technology companies and innovative startups.",
    
    // Status & Info
    status: "Status",
    readyForWork: "Ready For Work",
    education: "Education",
    educationText: "SMK WIKRAMA BOGOR - Software and Game Development",
    location: "Location",
    locationText: "Cigombong, Bogor Regency, West Java, Indonesia",
    
    // Career
    pathCareer: "Path Career",
    juniorWebDev: "Junior Web Developer",
    companyName: "PT. Tirta Investama",
    
    // Portfolio
    featuredProjects: "Featured Projects",
    viewProject: "View Project",
    
    // Certificates
    certAndMicro: "Certifications & Micro Credentials",
    professionalCredentials: "Professional Credentials",
    viewCertificate: "View Certificate",
    open: "Open",
    
    // Contact
    contact: "Contact",
    letsCollaborate: "Let's Collaborate",
    contactDesc: "Have an interesting project? Or just want to chat casually about technology? I'm always open to discussions and new collaborations.",
    email: "Email",
    phone: "Phone",
    instagram: "Instagram",
    
    // Form
    fullName: "Full Name",
    subject: "Subject",
    message: "Message",
    subjectPlaceholder: "Project discussion, collaboration, etc.",
    messagePlaceholder: "Hello, I would like to discuss...",
    sendMessage: "Send Message",
    sending: "Sending...",
    successMessage: "Message Sent! Thank you 🙏",
    errorMessage: "Failed to send, try again",
    successHint: "✅ Message sent successfully! I will reply as soon as possible.",
    errorHint: "⚠️ Failed to send message. Please try again or contact directly via email.",
    
    // Footer
    techStack: "Tech Stack & Tools",
    allRights: "All rights reserved.",
  }
};

// Language Context
const LanguageContext = createContext();

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'id');

  const t = (key) => translations[language][key] || key;

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ============================================
// DATA
// ============================================
const SKILLS = [
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Vue.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
];

const CERTIFICATES_RAW = [
  { id: 1, title: "Soft Skills Score Card", issuer: "Wadwhani Foundation", year: "2026", yearNum: 2026, color: "#6366f1", image: "/certificates/JobReady-EmployabilitySkills.jpg", subCerts: [
    { id: "1-1", title: "JobReady-EmployabilitySkills", image: "/certificates/JobReady-EmployabilitySkills.jpg" },
    { id: "1-2", title: "Impact Writing Skills", image: "/certificates/Impact Writing Skills.jpg" },
    { id: "1-3", title: "Interpersonal Skills", image: "/certificates/Interpersonal Skills.jpg" },
    { id: "1-4", title: "Work Productivity Tools", image: "/certificates/Work Productivity Tools.jpg" },
    { id: "1-5", title: "OnlineCommuni&DataSecurity", image: "/certificates/OnlineCommuni&DataSecurity.jpg" },
    { id: "1-6", title: "Problem Solving & Innovation", image: "/certificates/Problem Solving & Innovation.jpg" },
    { id: "1-7", title: "Proffessionalism", image: "/certificates/Proffessionalism.jpg" },
    { id: "1-8", title: "Self-Management", image: "/certificates/Self-Management.jpg" },
    { id: "1-9", title: "Self-Presentation", image: "/certificates/Self-Presentation.jpg" },
    { id: "1-10", title: "Customer Centricity", image: "/certificates/Customer Centricity.jpg" },
    { id: "1-11", title: "Speaking and Listening Skillsy", image: "/certificates/Speaking and Listening Skills.jpg" },
    { id: "1-12", title: "SkillsScoreCard", image: "/certificates/SkillsScoreCard.jpg" },
  ] },
  { id: 2, title: "Secure Code", issuer: "PT. Sinergi Cakrawala Indonesia", year: "2026", yearNum: 2026, color: "#0ea5e9", image: "/certificates/PT. SCI/Secure Code by SCI.jpg", subCerts: [{ id: "2-1", title: "Secure Code", image: "/certificates/PT. SCI/Secure Code by SCI.jpg" }] },
  { id: 3, title: "Java", issuer: "Dicoding", year: "2024", yearNum: 2024, color: "#10b981", image: "/certificates/Dicoding/DICODING-JAVA_0001.jpg", subCerts: [{ id: "3-1", title: "Java Programming", image: "/certificates/Dicoding/DICODING-JAVA_0001.jpg" }] },
  { id: 4, title: "Surat Keterangan PKL", issuer: "PT. Tirta Investama (Danone Aqua)", year: "2025", yearNum: 2025, color: "#f59e0b", image: "/certificates/PT. Tirta Investama/Surat Keterangan PKL.jpg", subCerts: [{ id: "4-1", title: "PT. Tirta Investama (Danone Aqua)", image: "/certificates/PT. Tirta Investama/Surat Keterangan PKL.jpg" }] },
  { id: 5, title: "Front-End Pemula", issuer: "Dicoding", year: "2026", yearNum: 2026, color: "#ef4444", image: "/certificates/Dicoding/DICODING-FRONT-END_0002.jpg", subCerts: [{ id: "5-1", title: "Front-End Pemula", image: "/certificates/Dicoding/DICODING-FRONT-END_0002.jpg" }] },
  { id: 6, title: "Dasar Pemograman", issuer: "Dicoding", year: "2026", yearNum: 2026, color: "#8b5cf6", image: "/certificates/Dicoding/DICODING-DASAR-PEMOGRAMAN_0003.jpg", subCerts: [{ id: "6-1", title: "Dasar Pemograman", image: "/certificates/Dicoding/DICODING-DASAR-PEMOGRAMAN_0003.jpg" }] },
  { id: 7, title: "Financial Literacy", issuer: "Dicoding", year: "2026", yearNum: 2026, color: "#8b5cf6", image: "/certificates/Dicoding/DICODING-FINANCIAL-LITERACY_0004.jpg", subCerts: [{ id: "7-1", title: "Financial Literacy", image: "/certificates/Dicoding/DICODING-FINANCIAL-LITERACY_0004.jpg" }] },
  { id: 8, title: "Pemograman SOLID", issuer: "Dicoding", year: "2026", yearNum: 2026, color: "#ef4444", image: "/certificates/Dicoding/DICODING-PRINSIP-PEMOGRAMAN-SOLID_0005.jpg", subCerts: [{ id: "8-1", title: "Pemograman SOLID", image: "/certificates/Dicoding/DICODING-PRINSIP-PEMOGRAMAN-SOLID_0005.jpg" }] },
  { id: 9, title: "Dasar Management Project", issuer: "DICODING", year: "2026", yearNum: 2026, color: "#f59e0b", image: "/certificates/Dicoding/DICODING-DASAR-MANAJEMENT-PROJECT_0006.jpg", subCerts: [{ id: "9-1", title: "Dasar Management Project", image: "/certificates/Dicoding/DICODING-DASAR-MANAJEMENT-PROJECT_0006.jpg" }] },
  { id: 10, title: "Dasar Pemograman Java Script", issuer: "DICODING", year: "2026", yearNum: 2026, color: "#10b981", image: "/certificates/Dicoding/DICODING-DASAR-PEMOGRAMAN-JAVASCRIPT_0007.jpg", subCerts: [{ id: "10-1", title: "Dasar Pemograman Java Script", image: "/certificates/Dicoding/DICODING-DASAR-PEMOGRAMAN-JAVASCRIPT_0007.jpg" }] },
];

const CERTIFICATES = [...CERTIFICATES_RAW].sort((a, b) => {
  if (a.yearNum !== b.yearNum) return b.yearNum - a.yearNum;
  return b.id - a.id;
});

const PROJECTS = [
  { id: 1, title: "E-Ticketing App", desc: "Platform belanja online full-stack dengan fitur cart, payment gateway, dan dashboard admin real-time.", tags: ["Laravel", "MySQL"], color: "#6366f1", link: "#" },
  { id: 2, title: "Inventaris Barang", desc: "Aplikasi manajemen inventaris dengan fitur pencatatan, pelacakan, dan laporan. Sekaligus sebagai Tugas Ujian Kenaikan Kelas XII di SMK Wikrama Bogor.", tags: ["Laravel", "MySQL"], color: "#0ea5e9", link: "#" },
  { id: 3, title: "E-commerce Interface", desc: "Antarmuka e-commerce dengan fitur produk, keranjang belanja, dan checkout.", tags: ["Dart", "Flutter"], color: "#10b981", link: "#" },
  { id: 4, title: "Perpustakaan Digital", desc: "Dashboard analitik interaktif dengan grafik real-time, export PDF, dan filter data dinamis.", tags: ["Laravel", "MySQL"], color: "#f59e0b", link: "#" },
  { id: 5, title: "Peduli sampah", desc: "web app untuk memantau dan mengelola sampah dibank sampah", tags: ["Laravel", "MySQL", "tailwind"], color: "#ef4444", link: "#" },
  { id: 6, title: "Portfolio", desc: "Portofolio pribadi dengan desain responsif, animasi halus, dan integrasi API GitHub untuk menampilkan repositori terbaru.", tags: ["React", "CSS"], color: "#8b5cf6", link: "#" },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
const getCertSlides = (cert) => {
  if (cert.subCerts?.length > 0) {
    return cert.subCerts.map((sc) => ({
      id: sc.id, title: sc.title, issuer: cert.issuer, year: cert.year, color: cert.color, image: sc.image,
    }));
  }
  return [{ id: cert.id, title: cert.title, issuer: cert.issuer, year: cert.year, color: cert.color, image: cert.image }];
};

// ============================================
// FALLBACK COMPONENT
// ============================================
const FallbackPreview = ({ cert, size = "card" }) => {
  const isCard = size === "card";
  return (
    <div className="cc-fallback" style={{ background: `${cert.color}12` }}>
      <div className={isCard ? "cc-gen-preview" : "cc-gen-preview cc-gen-preview--lg"}>
        <div className="cc-gen-border" style={{ borderColor: `${cert.color}30` }} />
        <div className="cc-gen-corner tl" style={{ borderColor: cert.color }} />
        <div className="cc-gen-corner tr" style={{ borderColor: cert.color }} />
        <div className="cc-gen-corner bl" style={{ borderColor: cert.color }} />
        <div className="cc-gen-corner br" style={{ borderColor: cert.color }} />
        <div className="cc-gen-lines">
          <div className="cc-gen-line" style={{ background: `${cert.color}25`, width: "60%" }} />
          <div className="cc-gen-line cc-gen-line--wide" style={{ background: `${cert.color}40`, width: "80%" }} />
          <div className="cc-gen-line" style={{ background: `${cert.color}20`, width: "50%" }} />
        </div>
        <div className="cc-seal" style={{ borderColor: `${cert.color}50`, color: cert.color }}>🏆</div>
        <div className="cc-watermark" style={{ color: `${cert.color}10` }}>CERT</div>
      </div>
    </div>
  );
};

// ============================================
// SKILL CAROUSEL
// ============================================
const SkillCarousel = () => {
  const doubled = [...SKILLS, ...SKILLS];
  return (
    <div className="carousel-wrapper">
      <div className="carousel-fade-left" />
      <div className="carousel-track-container">
        <div className="carousel-track">
          {doubled.map((s, i) => (
            <div className="skill-chip" key={i}>
              <img src={s.icon} alt={s.name} width={36} height={36} />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-fade-right" />
    </div>
  );
};

// ============================================
// CERTIFICATE CARD
// ============================================
const CertCard = ({ cert, index, onClick }) => {
  const { t } = useLanguage();
  const [imgErr, setImgErr] = useState(false);
  const hasGroup = cert.subCerts?.length > 0;

  return (
    <div className="cert-card" onClick={() => onClick(cert)} style={{ "--cc": cert.color, animationDelay: `${index * 0.08}s` }}>
      <div className="cc-thumb">
        <div className="cc-bar" style={{ background: cert.color }} />
        {cert.image && !imgErr ? (
          <>
            <img src={cert.image} alt={cert.title} className="cc-img" onError={() => setImgErr(true)} />
            <div className="cc-img-overlay" />
          </>
        ) : (
          <FallbackPreview cert={cert} size="card" />
        )}
        <div className="cc-hover-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          <span style={{ fontSize: "0.75rem", marginLeft: 6 }}>{hasGroup ? t("viewCertificate") : t("open")}</span>
        </div>
      </div>
      <div className="cc-footer">
        <div className="cc-texts">
          <div className="cc-title">{cert.title}</div>
          <div className="cc-meta">
            <span className="cc-issuer">{cert.issuer}</span>
            <span className="cc-dot">·</span>
            <span className="cc-year">{cert.year}</span>
          </div>
        </div>
        <div className="cc-arrow" style={{ background: `${cert.color}20`, color: cert.color }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ZOOMABLE IMAGE
// ============================================
const ZoomableImage = ({ src, alt, onError }) => {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((z) => clamp(z - e.deltaY * 0.001, 1, 4));
    if (zoom <= 1) setPos({ x: 0, y: 0 });
  }, [zoom]);

  const zoomIn = () => setZoom((z) => clamp(z + 0.4, 1, 4));
  const zoomOut = () => {
    const next = Math.max(1, zoom - 0.4);
    setZoom(next);
    if (next <= 1) setPos({ x: 0, y: 0 });
  };
  const zoomReset = () => { setZoom(1); setPos({ x: 0, y: 0 }); };

  const onMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const onMouseUp = () => setDragging(false);

  useEffect(() => { zoomReset(); }, [src]);

  return (
    <div className="zoom-wrapper">
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={zoomOut} title="Zoom Out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        <button className="zoom-btn zoom-pct" onClick={zoomReset}>{Math.round(zoom * 100)}%</button>
        <button className="zoom-btn" onClick={zoomIn} title="Zoom In">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
      </div>
      <div className="zoom-canvas" onWheel={handleWheel} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}>
        <img ref={imgRef} src={src} alt={alt} className="cm-img" onError={onError} style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`, transformOrigin: "center center", transition: dragging ? "none" : "transform 0.15s ease", userSelect: "none", pointerEvents: "none" }} draggable={false} />
      </div>
      {zoom > 1 && <div className="zoom-hint">Scroll untuk zoom · Drag untuk geser</div>}
    </div>
  );
};

// ============================================
// CERTIFICATE MODAL
// ============================================
const CertModal = ({ cert, onClose }) => {
  const slides = getCertSlides(cert);
  const [current, setCurrent] = useState(0);
  const [imgErr, setImgErr] = useState({});
  const activeSl = slides[current];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((p) => (p + 1) % slides.length);
      if (e.key === "ArrowLeft") setCurrent((p) => (p - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, slides.length]);

  const markErr = (id) => setImgErr((prev) => ({ ...prev, [id]: true }));
  const hasImg = activeSl.image && !imgErr[activeSl.id];
  const isGroup = slides.length > 1;

  return (
    <div className="cm-overlay" onClick={onClose}>
      <div className="cm-box" onClick={(e) => e.stopPropagation()}>
        <div className="cm-head" style={{ "--cc": activeSl.color }}>
          <div className="cm-head-left">
            <div className="cm-badge" style={{ background: `${activeSl.color}25`, color: activeSl.color, borderColor: `${activeSl.color}40` }}>🏆 {cert.issuer}</div>
          </div>
          <button className="cm-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cm-img-area">
          {hasImg ? (
            <ZoomableImage key={activeSl.id} src={activeSl.image} alt={activeSl.title} onError={() => markErr(activeSl.id)} />
          ) : (
            <div className="cm-no-img" style={{ "--cc": activeSl.color }}>
              <div className="cm-generated">
                <div className="cm-gen-deco" style={{ borderColor: `${activeSl.color}40` }} />
                <div className="cm-gen-ornament tl" style={{ borderColor: activeSl.color }} />
                <div className="cm-gen-ornament tr" style={{ borderColor: activeSl.color }} />
                <div className="cm-gen-ornament bl" style={{ borderColor: activeSl.color }} />
                <div className="cm-gen-ornament br" style={{ borderColor: activeSl.color }} />
                <div className="cm-gen-inner">
                  <div className="cm-gen-stripe" style={{ background: `${activeSl.color}20` }} />
                  <div className="cm-gen-icon" style={{ color: activeSl.color }}>🏆</div>
                  <div className="cm-gen-label">MICRO CERTIFICATE OF COMPLETION</div>
                  <div className="cm-gen-divider" style={{ background: `${activeSl.color}30` }} />
                  <div className="cm-gen-name">Mochamad Ikhsyan Kamil</div>
                  <div className="cm-gen-course" style={{ color: activeSl.color }}>{activeSl.title}</div>
                  <div className="cm-gen-issuer">Diterbitkan oleh <strong>{activeSl.issuer}</strong></div>
                  <div className="cm-gen-year">{activeSl.year}</div>
                  <div className="cm-gen-seal" style={{ borderColor: `${activeSl.color}50`, color: activeSl.color }}>✦</div>
                </div>
              </div>
            </div>
          )}
          {isGroup && (
            <>
              <button className="cm-nav cm-prev" onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p - 1 + slides.length) % slides.length); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button className="cm-nav cm-next" onClick={(e) => { e.stopPropagation(); setCurrent((p) => (p + 1) % slides.length); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </>
          )}
        </div>

        <div className="cm-info">
          <div className="cm-info-text">
            <h3 className="cm-title">{activeSl.title}</h3>
            <p className="cm-sub">{activeSl.issuer} &nbsp;·&nbsp; {activeSl.year}</p>
          </div>
          <p className="cm-hint">{isGroup ? "← → navigasi micro cert · " : ""}{hasImg ? "Scroll / pinch untuk zoom · " : ""}ESC tutup</p>
        </div>

        {isGroup && (
          <div className="cm-strip cm-strip--thumbs">
            {slides.map((sl, i) => {
              const hasThumb = sl.image && !imgErr[sl.id];
              return (
                <button key={sl.id} className={`cm-strip-thumb ${i === current ? "active" : ""}`} style={{ "--cc": cert.color }} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} title={sl.title}>
                  {hasThumb ? <img src={sl.image} alt={sl.title} className="cm-strip-img" onError={() => markErr(sl.id)} /> : <div className="cm-strip-fallback" style={{ background: `${cert.color}25` }}><span style={{ fontSize: "0.65rem", color: cert.color }}>🏆</span></div>}
                  <div className="cm-strip-label">{i + 1}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// PROJECT CARD
// ============================================
const ProjectCard = ({ project }) => {
  const { t } = useLanguage();
  return (
    <div className="project-card" style={{ "--accent": project.color }}>
      <div className="project-header"><div className="project-dot" /><div className="project-dot" /><div className="project-dot" /></div>
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.desc}</p>
        <div className="project-tags">{project.tags.map((tag) => (<span key={tag} className="tag">{tag}</span>))}</div>
      </div>
      <div className="project-footer">
        <a href={project.link} className="project-link">{t("viewProject")}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg></a>
      </div>
    </div>
  );
};

// ============================================
// PROJECT CAROUSEL
// ============================================
const ProjectCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(PROJECTS.length / itemsPerPage);
  const currentPage = Math.floor(startIndex / itemsPerPage);
  const visibleProjects = PROJECTS.slice(startIndex, startIndex + itemsPerPage);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true); setIsAnimating(true);
    const nextIndex = startIndex + itemsPerPage;
    setStartIndex(nextIndex < PROJECTS.length ? nextIndex : 0);
    setTimeout(() => { setIsAnimating(false); setTimeout(() => setIsTransitioning(false), 100); }, 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true); setIsAnimating(true);
    const prevIndex = startIndex - itemsPerPage;
    setStartIndex(prevIndex >= 0 ? prevIndex : Math.max(0, PROJECTS.length - itemsPerPage));
    setTimeout(() => { setIsAnimating(false); setTimeout(() => setIsTransitioning(false), 100); }, 500);
  };

  const goToPage = (pageIndex) => {
    if (isTransitioning || pageIndex === currentPage) return;
    setIsTransitioning(true); setIsAnimating(true);
    setStartIndex(pageIndex * itemsPerPage);
    setTimeout(() => { setIsAnimating(false); setTimeout(() => setIsTransitioning(false), 100); }, 500);
  };

  return (
    <div className="projects-carousel-container">
      <div className="project-grid-wrapper">
        <div className="project-grid" style={{ transition: isAnimating ? 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none' }}>
          {visibleProjects.map((p) => (<ProjectCard key={p.id} project={p} />))}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="project-slider-controls">
          <button onClick={prevSlide} className="slider-nav-btn" disabled={isTransitioning}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="slider-dots">
            {Array.from({ length: totalPages }).map((_, idx) => (<button key={idx} className={`slider-dot ${currentPage === idx ? 'active' : ''}`} onClick={() => goToPage(idx)} disabled={isTransitioning} />))}
          </div>
          <button onClick={nextSlide} className="slider-nav-btn" disabled={isTransitioning}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// CERTIFICATE CAROUSEL
// ============================================
const CertificateCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [certModal, setCertModal] = useState(null);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(CERTIFICATES.length / itemsPerPage);
  const currentPage = Math.floor(startIndex / itemsPerPage);
  const visibleCerts = CERTIFICATES.slice(startIndex, startIndex + itemsPerPage);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true); setIsAnimating(true);
    const nextIndex = startIndex + itemsPerPage;
    setStartIndex(nextIndex < CERTIFICATES.length ? nextIndex : 0);
    setTimeout(() => { setIsAnimating(false); setTimeout(() => setIsTransitioning(false), 100); }, 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true); setIsAnimating(true);
    const prevIndex = startIndex - itemsPerPage;
    setStartIndex(prevIndex >= 0 ? prevIndex : Math.max(0, CERTIFICATES.length - itemsPerPage));
    setTimeout(() => { setIsAnimating(false); setTimeout(() => setIsTransitioning(false), 100); }, 500);
  };

  const goToPage = (pageIndex) => {
    if (isTransitioning || pageIndex === currentPage) return;
    setIsTransitioning(true); setIsAnimating(true);
    setStartIndex(pageIndex * itemsPerPage);
    setTimeout(() => { setIsAnimating(false); setTimeout(() => setIsTransitioning(false), 100); }, 500);
  };

  return (
    <div className="certs-carousel-container">
      <div className="cert-grid-wrapper">
        <div className="cert-grid" style={{ transition: isAnimating ? 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none' }}>
          {visibleCerts.map((c, i) => (<CertCard key={c.id} cert={c} index={i} onClick={(selected) => setCertModal(selected)} />))}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="cert-slider-controls">
          <button onClick={prevSlide} className="slider-nav-btn" disabled={isTransitioning}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="slider-dots">
            {Array.from({ length: totalPages }).map((_, idx) => (<button key={idx} className={`slider-dot ${currentPage === idx ? 'active' : ''}`} onClick={() => goToPage(idx)} disabled={isTransitioning} />))}
          </div>
          <button onClick={nextSlide} className="slider-nav-btn" disabled={isTransitioning}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      )}
      {certModal && <CertModal cert={certModal} onClose={() => setCertModal(null)} />}
    </div>
  );
};

// ============================================
// LANGUAGE TOGGLE BUTTON
// ============================================
const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button className="lang-toggle" onClick={toggleLanguage}>
      <span className={`lang-option ${language === 'id' ? 'active' : ''}`}>ID</span>
      <span className="lang-separator">|</span>
      <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
    </button>
  );
};

// ============================================
// CONTACT FORM
// ============================================
const ContactForm = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }
    setStatus("sending");
    try {
      const templateParams = { name: form.name, email: form.email, subject: form.subject || "Pesan dari Portfolio Website", message: form.message };
      const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      if (response.status === 200) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error("Gagal mengirim email");
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">{t("fullName")} <span className="req">*</span></label>
          <input id="name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email <span className="req">*</span></label>
          <input id="email" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="subject">{t("subject")}</label>
        <input id="subject" name="subject" type="text" placeholder={t("subjectPlaceholder")} value={form.subject} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="message">{t("message")} <span className="req">*</span></label>
        <textarea id="message" name="message" placeholder={t("messagePlaceholder")} rows={5} value={form.message} onChange={handleChange} required />
      </div>
      <button type="submit" className={`form-submit ${status}`} disabled={status === "sending"}>
        {status === "idle" && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>{t("sendMessage")}</>)}
        {status === "sending" && (<><span className="spinner" />{t("sending")}</>)}
        {status === "success" && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>{t("successMessage")}</>)}
        {status === "error" && (<><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>{t("errorMessage")}</>)}
      </button>
      {status === "success" && <p className="form-hint success">✅ {t("successHint")}</p>}
      {status === "error" && <p className="form-hint error">⚠️ {t("errorHint")}</p>}
    </form>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const AppContent = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { emailjs.init(EMAILJS_PUBLIC_KEY); }, []);

  const scrollTo = (id) => { setActive(id); setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const navItems = [{ id: "home", label: t("home") }, { id: "about", label: t("about") }, { id: "portfolio", label: t("portfolio") }, { id: "sertifikat", label: t("certificates") }];

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => scrollTo("home")}><span className="brand-dot" /><span>Dev<strong>Folio</strong></span></div>
          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>{navItems.map((n) => (<li key={n.id}><button className={`nav-btn ${active === n.id ? "active" : ""}`} onClick={() => scrollTo(n.id)}>{n.label}</button></li>))}</ul>
          <LanguageToggle />
          <button className="nav-contact-btn" onClick={() => scrollTo("contact")}>{t("contactMe")}</button>
          <button className="hamburger" onClick={() => setMenuOpen((v) => !v)}><span /><span /><span /></button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="hero">
        <div className="hero-bg-grid" /><div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">{t("hiImA")}</div>
          <h1 className="hero-title"><span className="gradient-text">{t("fullStack")}</span><br />{t("developer")}</h1>
          <p className="hero-sub">{t("heroDesc")}</p>
          <div className="hero-actions"><button className="btn-primary" onClick={() => scrollTo("portfolio")}>{t("viewMyWork")}</button><button className="btn-ghost" onClick={() => scrollTo("sertifikat")}>{t("certification")}</button></div>
        </div>
        <div className="hero-visual">
          <div className="avatar-glow-ring" /><div className="avatar-glow-ring ring2" />
          <div className="avatar-photo-wrap"><img src={profilePhoto} alt="Foto Profil" className="avatar-photo" /></div>
          <div className="floating-badge fb1">Laravel 🟠</div><div className="floating-badge fb2">MySQL 🟢</div><div className="floating-badge fb3">GitHub 🐙</div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-bento">
            {/* Profile Card */}
            <div className="bento-card bento-profile">
              <div className="bento-profile-glow" />
              <div className="bento-photo-wrap"><img src={profilePhoto} alt="Foto Profil" className="bento-photo" /><div className="bento-status-dot" /></div>
              <h3 className="bento-name">Mochamad Ikhsyan Kamil</h3>
              <div className="bento-role-pill"><span className="bento-role-dot" />{t("fullStack")} {t("developer")}</div>
              <div className="bento-divider" />
              <div className="bento-social-col">
                <a href="https://github.com/mochamad-ikhsyankamil23" target="_blank" rel="noreferrer" className="bento-social-link"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg><span>GitHub</span></a>
                <a href="www.linkedin.com/in/ikhsyan-kamil-8689272a3" target="_blank" rel="noreferrer" className="bento-social-link"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg><span>LinkedIn</span></a>
              </div>
              <div className="bento-card bento-timeline-inner"><div className="bento-timeline-header" style={{ justifyContent: 'center' }}>{t("pathCareer")}</div><div className="tl-item"><div className="tl-dot" style={{ background: "#10b981" }}></div><div className="tl-body"><div className="tl-role">{t("juniorWebDev")}</div><div className="tl-company">{t("companyName")}</div><div className="tl-year">2025</div></div></div></div>
            </div>

            {/* Bio Card */}
            <div className="bento-card bento-bio"><div className="bento-bio-eyebrow"><span>✨</span> {t("aboutMe")}</div><h3 className="bento-bio-text">{t("aboutText")}</h3></div>

            {/* Info Card */}
            <div className="bento-card bento-info">
              <div className="bento-info-sep"></div>
              <div className="bento-info-tile"><span>💼</span><div><div className="bit-label">{t("status")}</div><div className="bit-val green">{t("readyForWork")}</div></div></div>
              <div className="bento-info-sep"></div>
              <div className="bento-info-tile"><span>🎓</span><div><div className="bit-label">{t("education")}</div><div className="bit-val">{t("educationText")}</div></div></div>
              <div className="bento-info-tile"><span>📍</span><div><div className="bit-label">{t("location")}</div><div className="bit-val">{t("locationText")}</div></div></div>
            </div>

            {/* Tech Stack Card */}
            <div className="bento-card bento-stack"><div className="bento-stack-header"><div className="bento-stack-title"><span>⚡</span> {t("techStack")}</div></div><SkillCarousel /></div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section id="portfolio" className="section portfolio-section"><div className="container"><div className="section-label">— {t("portfolio")}</div><h2 className="section-title">{t("featuredProjects")}</h2><ProjectCarousel /></div></section>

      {/* CERTIFICATES SECTION */}
      <section id="sertifikat" className="section cert-section"><div className="container"><div className="section-label">— {t("certAndMicro")}</div><h2 className="section-title">{t("professionalCredentials")}</h2><CertificateCarousel /></div></section>

      {/* CONTACT SECTION */}
      <section id="contact" className="section contact-section">
        <div className="contact-left">
          <div className="section-label">— {t("contact")}</div>
          <h2 className="contact-title">{t("letsCollaborate")}</h2>
          <p className="contact-desc">{t("contactDesc")}</p>
          <div className="contact-info-list">
            <div className="contact-info-item"><div className="ci-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="22" y1="7" x2="12" y2="13" /><line x1="2" y1="7" x2="12" y2="13" /></svg></div><div><div className="ci-label">{t("email")}</div><div className="ci-val">mochamadikhsyankamil@gmail.com</div></div></div>
            <div className="contact-info-item"><div className="ci-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" /></svg></div><div><div className="ci-label">{t("phone")}</div><div className="ci-val">+62 89538 3385 800</div></div></div>
            <div className="contact-info-item"><div className="ci-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="4" ry="4" /><circle cx="12" cy="12" r="4" /><line x1="18" y1="6" x2="18.01" y2="6" /></svg></div><div><div className="ci-label">{t("instagram")}</div><div className="ci-val">@itsyan__</div></div></div>
          </div>
        </div>
        <ContactForm />
      </section>

      {/* FOOTER */}
      <footer className="footer"><div className="footer-inner"><div className="footer-left"><div className="footer-brand">Dev<span className="gradient-text">Folio</span></div><p>&copy; 2026 Mochamad Ikhsyan Kamil. {t("allRights")}</p></div><div className="footer-right"><a href="https://github.com/mochamad-ikhsyankamil23">GitHub</a><a href="https://www.linkedin.com/in/ikhsyan-kamil-8689272a3" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://www.instagram.com/itsyan__" target="_blank" rel="noreferrer">Instagram</a></div></div></footer>
    </div>
  );
};

// ============================================
// APP EXPORT (with Language Provider)
// ============================================
export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}