import { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  ExternalLink, 
  Cpu, 
  Layers, 
  Terminal, 
  Code, 
  Server, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Menu, 
  X,
  FileText,
  MapPin,
  Clock,
  Compass,
  Zap
} from 'lucide-react';
import DotField from './components/DotField';
import './components/DotField.css';

// Custom inline SVG icons for Github and Linkedin (removed from modern lucide-react due to trademark)
const Github = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


// Import local project assets
import projectIncidentAgent from './assets/project_incident_agent.png';
import projectAirDrawing from './assets/project_air_drawing.png';
import projectGsocChat from './assets/project_gsoc_chat.png';
import projectDronePath from './assets/project_drone_path.png';
import projectWirelessRobot from './assets/project_wireless_robot.png';
import projectDeliveryGame from './assets/project_delivery_game.png';
import projectAutonomousNav from './assets/project_autonomous_nav.png';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isNavHidden, setIsNavHidden] = useState(false);

  // Contact form submission handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      try {
        const response = await fetch('http://localhost:8000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formState),
        });
        if (response.ok) {
          setFormSubmitted(true);
          setTimeout(() => {
            setFormSubmitted(false);
            setFormState({ name: '', email: '', message: '' });
          }, 4000);
        } else {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.message || 'Failed to submit contact message to backend.';
          alert(errMsg);
          console.error(errMsg);
        }
      } catch (err) {
        console.warn('Backend offline, using fallback submission mechanism:', err);
        alert(`Network Error: ${err.message || err}`);
        // Fallback to mock state if backend server is not running
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setFormState({ name: '', email: '', message: '' });
        }, 4000);
      }
    }
  };

  // Section Observer to update active navigation item
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }, []);
  // Reveal-on-scroll animation observer (IntersectionObserver Fallback style)
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => revealElements.forEach((el) => observer.unobserve(el));
  }, []);

  // Hide/Show navbar on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavHidden(true);
      } else {
        setIsNavHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'tech', label: 'Tech Stack' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  const stats = [
    { value: '8.55', label: 'B.Tech (Honours) CGPA' },
    { value: '6+', label: 'Tech Projects' },
    { value: 'GSoC\'26', label: 'Proposal Writer' },
    { value: 'Round 1', label: 'Hackathon Qualifier' }
  ];

  const skillGroups = [
    {
      title: 'Languages',
      icon: <Code className="w-6 h-6 text-amber-500" style={{ color: '#f59e0b' }} />,
      color: 'amber',
      skills: ['C / C++', 'Python', 'Java', 'JavaScript', 'HTML / CSS', 'Bash Scripting']
    },
    {
      title: 'Frameworks & Tools',
      icon: <Cpu className="w-6 h-6 text-amber-500" style={{ color: '#f59e0b' }} />,
      color: 'amber',
      skills: ['ReactJS', 'Django', 'LangChain', 'OpenCV & MediaPipe', 'Docker', 'Git & GitHub', 'Pygame', 'Arduino IDE']
    },
    {
      title: 'Hardware & Simulation',
      icon: <Layers className="w-6 h-6 text-red-500" style={{ color: '#ef4444' }} />,
      color: 'red',
      skills: ['ROS (Robot OS)', 'Gazebo & RViz', 'Arduino Microcontrollers', 'Breadboard Prototyping', 'Motor Drivers / Actuators', 'CRO, AFO & DMM']
    },
    {
      title: 'Interests & Focus',
      icon: <Terminal className="w-6 h-6 text-amber-500" style={{ color: '#f59e0b' }} />,
      color: 'amber',
      skills: ['Full Stack Development', 'Backend Systems', 'System Design & APIs', 'Cloud & DevOps', 'Applied ML', 'Computer Vision / Robotics']
    }
  ];

  const projects = [
    {
      title: 'Incident Response Agent',
      category: 'Artificial Intelligence / Hackathon',
      image: projectIncidentAgent,
      description: 'An AI-powered incident response system that monitors incoming alerts, classifies severity, correlates logs across systems, and generates suggested remediation actions. Features a rule-based and LLM-assisted decision workflow to escalate, query context, or propose fixes. Scaler x Meta Hackathon Round 1 Qualifier.',
      tags: ['Python', 'LangChain', 'LLM Agents', 'REST APIs', 'JSON Output'],
      githubLink: 'https://github.com/sainihal-chimata/incident-response-agent'
    },
    {
      title: 'Gesture-Based Air Drawing',
      category: 'Computer Vision / Motion Tracking',
      image: projectAirDrawing,
      description: 'A real-time gesture-controlled virtual drawing canvas using hand landmark detection. Supports multi-color drawing, erase mode, and canvas clear via keyboard shortcuts and gesture-based mode switching overlaid on live webcam feeds.',
      tags: ['Python', 'OpenCV', 'MediaPipe', 'Motion Tracking'],
      githubLink: 'https://github.com/sainihal-chimata/Gesture-Tracking-Air-Drawing-System'
    },
    {
      title: 'Autonomous Navigation Simulation',
      category: 'ROBOTICS / AUTONOMOUS SYSTEMS',
      image: projectAutonomousNav,
      description: 'Completed an autonomous navigation and obstacle avoidance simulation in Gazebo/RViz, implementing path planning and obstacle detection for a wheeled robot.',
      tags: ['ROS', 'Gazebo', 'RViz', 'Path Planning', 'Simulation'],
      demoLink: 'https://drive.google.com/file/d/127mRIYfrz5XYsOyPodBZWNhdcGtKJTvf/view?usp=sharing',
      githubLink: 'https://github.com/sainihal-chimata/Autonomous-Robot-Simulation-ROS'
    },
    {
      title: 'GSoC Honeynet Integration',
      category: 'Open Source / Threat Intelligence',
      image: projectGsocChat,
      description: 'Google Summer of Code 2026 proposal to integrate a self-deployed LLM chatbot into the IntelOwl threat intelligence platform. Proposed a RAG pipeline architecture using LangChain, locally hosted Ollama, a ReactJS sidebar, and a Django API backend.',
      tags: ['ReactJS', 'Django', 'LangChain', 'Ollama', 'Docker', 'RAG']
    },
    {
      title: 'Drone Path Optimization',
      category: 'Graph Algorithms & Simulation',
      image: projectDronePath,
      description: 'Designed a waypoint route optimization system on a weighted directed graph. Employs Depth-First Search (DFS) for route traversal calculation and a multi-factor cost function (distance, energy, time, penalty weights). Includes a Pygame animator.',
      tags: ['Python', 'Pygame', 'Graph Theory', 'DFS', 'Algorithms'],
      demoLink: 'https://drive.google.com/file/d/1JQ9kQmvVxiq5nx2zSVuVhGXrgJLd-7qz/view?usp=sharing',
      githubLink: 'https://github.com/sainihal-chimata/Path-Finding-Drone-Simulation'
    },
    {
      title: 'Wireless Robot',
      category: 'Robotics & Hardware Integration',
      image: projectWirelessRobot,
      description: 'Designed and assembled a tracked tank robot chassis controlled wirelessly over Bluetooth. Programmed motor driver logic in Embedded C, and wired up sensor/motor interfaces to allow real-time control via an Arduino microcontroller.',
      tags: ['Arduino', 'Bluetooth HC-05', 'Motor Drivers', 'Embedded C'],
      demoLink: 'https://drive.google.com/file/d/1-yQSI6ndjdAgWDHVxRseUBS_K07k8-91/view?usp=sharing'
    },
    {
      title: 'Delivery Van Simulator 3D',
      category: 'GAME DEVELOPMENT / 3D SIMULATION',
      image: projectDeliveryGame,
      description: 'A 3D simulation game developed in Unity featuring vehicle physics, waypoint navigation, and courier task scheduling. Modeled under active development.',
      tags: ['Unity 3D', 'C#', 'Game Physics', '3D Modeling'],
      isUnderProgress: true,
      githubLink: 'https://github.com/sainihal-chimata'
    }
  ];

  const experiences = [
    {
      role: 'Google Summer of Code (GSoC) Proposal Writer',
      company: 'The Honeynet Project',
      duration: '2026',
      location: 'Open Source Contribution',
      points: [
        'Submitted a detailed proposal to integrate a self-deployed LLM chatbot into IntelOwl, a major open-source threat intelligence platform.',
        'Proposed a technical integration plan detailing a RAG (Retrieval-Augmented Generation) pipeline structure utilizing LangChain, local LLM execution via Ollama, a ReactJS sidebar, and Django REST APIs.',
        'Coordinated with organization mentors to align system interface and RAG constraints.'
      ]
    },
    {
      role: 'Electronics & Computer Engineering Student',
      company: 'Manipal Institute of Technology, Bangalore',
      duration: '2024 - Present',
      location: 'Bangalore, India',
      points: [
        'Currently pursuing B.Tech in Electronics and Computer Engineering (ECM) with Honours, holding a cumulative CGPA of 8.55/10.',
        'Studying core courses in microprocessors, computer network protocols, operating systems, embedded systems, and software architectures.',
        'Actively participating in robotics clubs and engineering research initiatives.'
      ]
    },
    {
      role: 'Hackathon Round 1 Qualifier',
      company: 'Scaler x Meta Hackathon',
      duration: '2025',
      location: 'Bangalore, India',
      points: [
        'Designed and built an AI-based Incident Response Agent that logs, categorizes, and correlates alert severity across containerized services.',
        'Programmed structured LLM JSON outputs and alert loops, qualifying successfully for Round 1 evaluation.'
      ]
    },
    {
      role: 'Certified Robotics Workshop Participant',
      company: 'ART-PARK, IISc Bangalore',
      duration: 'Workshop Project',
      location: 'Bangalore, India',
      points: [
        'Independently enrolled in an intensive, hands-on robotics certification workshop at IISc Bangalore.',
        'Wired up breadboard microcontrollers, sensor nodes, and motor actuators to assemble line-following and Bluetooth-controlled vehicles.',
        'Awarded a course completion certificate by ART-PARK upon successful project presentation.'
      ]
    }
  ];

  return (
    <div className="relative min-h-screen text-[#f8fafc] overflow-hidden selection:bg-purple-500 selection:text-white">
      <DotField
        dotRadius={1.5}
        dotSpacing={14}
        bulgeStrength={67}
        glowRadius={180}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom="rgba(245, 158, 11, 0.35)"
        gradientTo="rgba(239, 68, 68, 0.15)"
        glowColor="#14100e"
      />

      {/* Sticky Premium Floating Navbar */}
      <header className={`fixed-header navigation-bar-container transition-all duration-300 ${isNavHidden ? 'nav-hidden' : ''}`}>
        <div className="glass-card px-4 py-2.5 flex items-center gap-3.5 border-amber-500/20 shadow-xl shadow-black/40">
          <a href="#hero" className="flex items-center gap-2 text-base font-extrabold tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-amber-500/10">
              CSN
            </span>
            <span className="hidden sm:inline bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Sai Nihal
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 border-l border-white/10 pl-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                  activeSection === link.id ? 'text-[#f59e0b]' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Hire Me / Socials (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 border-l border-white/10 pl-4 nav-social-links">
            <a 
              href="https://github.com/sainihal-chimata" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#94a3b8] hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="mailto:sainihal.chimata@gmail.com" 
              className="text-[#94a3b8] hover:text-white transition-colors"
              aria-label="Email Me"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 text-[#94a3b8] hover:text-white focus:outline-none flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 glass-card border-amber-500/20 p-4 flex flex-col gap-3 shadow-2xl animate-fade-in z-50">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold transition-colors ${
                  activeSection === link.id ? 'text-[#f59e0b]' : 'text-[#94a3b8]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-3 border-t border-white/10 mt-1 justify-center">
              <a href="https://github.com/sainihal-chimata" target="_blank" rel="noopener noreferrer" className="text-[#94a3b8] hover:text-white" aria-label="GitHub">
                <Github className="w-4.5 h-4.5" />
              </a>
              <a href="mailto:sainihal.chimata@gmail.com" className="text-[#94a3b8] hover:text-white" aria-label="Email">
                <Mail className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero-section-isolated">
        
        {/* LEFT WRAPPER: Typography & Metrics */}
        <div className="hero-left-column">
          <h1 className="hero-title">Building <span className="highlight-text">Full-Stack</span> Solutions & Intelligent Systems</h1>
          <p className="hero-desc">Hi, I'm Chimata Sai Nihal. I'm an Electronics & Computer Engineering student (B.Tech with Honours) at MIT Bangalore, focused on full-stack development, embedded systems, and AI-driven software projects.</p>
          
          <div className="hero-actions" style={{ display: 'inline-flex', flexDirection: 'row', gap: '1rem', width: 'auto', justifyContent: 'flex-start', alignItems: 'center' }}>
            <button 
              className="btn-primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </button>
            <button 
              className="btn-secondary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Touch
            </button>
          </div>

          <div className="hero-metric">
            <h2 className="metric-number">8.55</h2>
            <span className="metric-label">B.Tech (Honours) CGPA</span>
          </div>
        </div>

        {/* RIGHT WRAPPER: Rigid Profile Card */}
        <div className="hero-right-column">
          <div className="profile-vertical-card">
            <div className="avatar-row">
              <div className="avatar-circle-badge">CSN</div>
            </div>
            <h3 className="profile-name">Chimata Sai Nihal</h3>
            <span className="profile-title">Electronics & Computer Engineering Developer</span>
            
            <div className="profile-tags">
              <span className="tag">Robotics</span>
              <span className="tag">Embedded Systems</span>
              <span className="tag">AI Systems</span>
            </div>

            <p className="profile-quote">"I enjoy building software that combines web technologies, AI, and embedded systems to solve practical engineering problems."</p>
            
            <a 
              href="http://localhost:8000/api/resume/download" 
              download
              className="btn-resume"
              style={{ display: 'block', textDecoration: 'none', textAlign: 'center', boxSizing: 'border-box' }}
            >
              Download CV / Resume
            </a>
          </div>
        </div>

      </section>

      {/* About Section */}
      <section id="about" className="about-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', padding: '6rem 2rem 4rem 2rem', width: '100%', boxSizing: 'border-box' }}>
        <div className="about-header-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '1.5rem', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>About Me</h2>
          <p style={{ color: '#e4e4e7', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '720px', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            I focus on exploring scalable software architectures. My interest lies in learning how web applications process data efficiently, optimize routing logic, and integrate automation workflows.
          </p>
        </div>

        <h3 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#fff', marginBottom: '2rem', textAlign: 'left', marginLeft: 0 }}>Technical Focus</h3>
        
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(20, 16, 17, 0.55)', border: '1px solid rgba(245, 158, 11, 0.15)', backdropFilter: 'blur(16px)' }}>
            <h4 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>Full-Stack Web Architectures</h4>
            <p style={{ color: '#e4e4e7', fontSize: '0.95rem', lineHeight: '1.5' }}>Prototyping responsive user interfaces with component-driven systems like ReactJS, tightly integrated with backend wrappers and API endpoints utilizing Python, Django, and FastAPI.</p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(20, 16, 17, 0.55)', border: '1px solid rgba(245, 158, 11, 0.15)', backdropFilter: 'blur(16px)' }}>
            <h4 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>Intelligent Automation & ML</h4>
            <p style={{ color: '#e4e4e7', fontSize: '0.95rem', lineHeight: '1.5' }}>Built projects involving event parsing, log analysis, and LLM-assisted workflows that generate structured JSON outputs for automated processing.</p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(20, 16, 17, 0.55)', border: '1px solid rgba(245, 158, 11, 0.15)', backdropFilter: 'blur(16px)' }}>
            <h4 style={{ color: '#f59e0b', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>Spatial Computing & Vision</h4>
            <p style={{ color: '#e4e4e7', fontSize: '0.95rem', lineHeight: '1.5' }}>Interfacing hardware microcontrollers with motor actuators, implementing coordinate path routing graph algorithms, and building computer vision applications using OpenCV and MediaPipe.</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-24 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Technology Stack</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full mb-6" />
            <p className="text-[#e4e4e7] text-lg">
              Languages and tools I've used across software, AI, and embedded engineering projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillGroups.map((group, index) => (
              <div 
                key={index} 
                className="glass-card p-6 border-[#201538] hover:border-purple-500/30 flex flex-col h-full reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#22163c]">
                  {group.icon}
                  <h3 className="text-lg font-bold text-white">{group.title}</h3>
                </div>
                
                <ul className="space-y-3.5 flex-1">
                  {group.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2.5 text-[#94a3b8] text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Projects</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full mb-6" />
            <p className="text-[#e4e4e7] text-lg">
              Practical implementations of applied AI systems, computer vision loops, route planning optimizations, and embedded robotics integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <article 
                key={index} 
                className="glass-card flex flex-col h-full overflow-hidden border-[#25193d] group reveal"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Image Container with Zoom effect */}
                <div className="relative overflow-hidden aspect-video border-b border-[#22163c]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c061a] to-transparent z-10 opacity-60" />
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ aspectRatio: '16 / 9', objectFit: 'cover', width: '100%' }}
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#f59e0b] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#e4e4e7] mb-6 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="bg-[#120a24] text-[#94a3b8] border border-[#23153d] px-2.5 py-1 rounded text-xs font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-auto">
                    {project.isUnderProgress ? (
                      <span className="text-xs text-amber-400 font-bold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        In Progress
                      </span>
                    ) : (
                      <>
                        {project.demoLink && (
                          <a 
                            href={project.demoLink} 
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[#f59e0b] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                        {project.githubLink && (
                          <a 
                            href={project.githubLink} 
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#94a3b8] hover:text-white transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            Source Code
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 relative">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Professional Experience</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full mb-6" />
            <p className="text-[#e4e4e7] text-lg">
              A timeline of academic milestones, open-source proposal development, and hands-on laboratory certifications.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative border-l-2 border-[#2c1d4a] pl-6 md:pl-8 ml-4 w-full" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {experiences.map((exp, index) => (
              <div 
                key={index} 
                className="relative reveal w-full"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-[#080312] border-2 border-purple-500 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>

                <div className="glass-card p-6 md:p-8 border-[#251740] hover:border-purple-500/20 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                      <p className="text-purple-400 font-semibold">{exp.company}</p>
                    </div>
                    <div className="flex flex-col md:items-end text-sm text-[#64748b] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {exp.duration}
                      </span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {exp.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex gap-2.5 text-[#e4e4e7] text-sm leading-relaxed">
                        <ChevronRight className="w-4 h-4 text-purple-500 shrink-0 mt-1" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get In Touch</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full mb-6" />
            <p className="text-[#e4e4e7] text-lg">
              Have an opening, a project collaboration, or a technical inquiry? Send a direct dispatch below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Contact Details Card */}
            <div className="lg:col-span-5 reveal flex flex-col justify-between">
              <div className="glass-card p-8 border-[#271942] h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                  <p className="text-sm text-[#e4e4e7] mb-8 leading-relaxed">
                    Feel free to reach out directly through the form or using the social channels below. I'm always open to discuss modern engineering architectures and opportunities.
                  </p>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mt-1">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs text-[#64748b] font-semibold uppercase tracking-wider mb-1">EMAIL</span>
                        <a href="mailto:sainihal.chimata@gmail.com" className="block text-sm text-[#f8fafc] hover:text-[#f59e0b] transition-colors font-medium">
                          sainihal.chimata@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mt-1">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-xs text-[#64748b] font-semibold uppercase tracking-wider mb-1">LOCATION</span>
                        <span className="block text-sm text-[#f8fafc] font-medium">
                          Hyderabad, India
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-[#22163c] mt-8">
                  <h4 className="text-xs text-[#64748b] font-semibold uppercase tracking-wider mb-4">Connect with Me</h4>
                  <div className="flex gap-3">
                    <a href="https://github.com/sainihal-chimata" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white/5 border border-white/5 text-[#94a3b8] hover:text-white hover:border-purple-500/20 transition-all" aria-label="GitHub Profile">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="mailto:sainihal.chimata@gmail.com" className="p-3 rounded-lg bg-white/5 border border-white/5 text-[#94a3b8] hover:text-[#a855f7] hover:border-purple-500/20 transition-all" aria-label="Email Me">
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="lg:col-span-7 reveal">
              <div className="glass-card p-8 border-[#271942] h-full">
                {formSubmitted ? (
                  <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 animate-bounce">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                    <p className="text-sm text-[#e4e4e7] max-w-sm">
                      Thank you for reaching out, Sai Nihal will get back to you shortly!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Send a Message</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="form-name" className="text-xs text-[#94a3b8] font-semibold uppercase tracking-wider">
                          Your Name
                        </label>
                        <input 
                          type="text" 
                          id="form-name"
                          required
                          placeholder="John Doe"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="form-email" className="text-xs text-[#94a3b8] font-semibold uppercase tracking-wider">
                          Your Email
                        </label>
                        <input 
                          type="email" 
                          id="form-email"
                          required
                          placeholder="john@example.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-6">
                      <label htmlFor="form-message" className="text-xs text-[#94a3b8] font-semibold uppercase tracking-wider">
                        Message
                      </label>
                      <textarea 
                        id="form-message"
                        required
                        rows="5"
                        placeholder="Hi Sai Nihal, I'd like to talk about..."
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="form-input resize-none"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn-primary w-full justify-center py-3.5 font-semibold glow-primary mt-6"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 relative z-10 text-center text-sm text-[#64748b]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              CSN
            </span>
            <span className="font-semibold text-[#f8fafc]">Chimata Sai Nihal Portfolio</span>
          </div>

          <p>© {new Date().getFullYear()} Chimata Sai Nihal. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a href="https://github.com/sainihal-chimata" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
              GitHub
            </a>
            <a href="mailto:sainihal.chimata@gmail.com" className="hover:text-white transition-colors" aria-label="Email">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
