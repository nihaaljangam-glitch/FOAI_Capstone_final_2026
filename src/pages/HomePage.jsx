import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [cursorHover, setCursorHover] = useState(false);
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);
  const scRef = useRef(null);
  
  // Mouse position state for custom cursor
  useEffect(() => {
    let mx = -100, my = -100, rx = -100, ry = -100;
    
    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      
      // Parallax Hero
      if (scRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        scRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-60% + ${y}px))`;
      }
    };

    let reqId;
    const animC = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (cursorDot.current && cursorRing.current) {
        cursorDot.current.style.left = mx + 'px';
        cursorDot.current.style.top = my + 'px';
        cursorRing.current.style.left = rx + 'px';
        cursorRing.current.style.top = ry + 'px';
      }
      reqId = requestAnimationFrame(animC);
    };

    document.addEventListener('mousemove', handleMouseMove);
    reqId = requestAnimationFrame(animC);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(reqId);
    };
  }, []);

  // Set timeout for hero counter
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    let c = 0;
    const target = 12847;
    let reqId;

    const timeout = setTimeout(() => {
      const animC2 = () => {
        c += Math.ceil((target - c) / 18);
        if (c >= target) {
          setCounter(target);
          return;
        }
        setCounter(c);
        reqId = requestAnimationFrame(animC2);
      };
      animC2();
    }, 1200);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(reqId);
    };
  }, []);

  // Scroll Reveal elements
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Bars observer
  useEffect(() => {
    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.acc-bar-fill').forEach(bar => {
            const w = bar.getAttribute('data-width');
            setTimeout(() => { bar.style.width = w + '%'; }, 300);
          });
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    
    const wide = document.querySelector('.feature-card.wide');
    if (wide) barObs.observe(wide);
    return () => barObs.disconnect();
  }, []);

  // Magnetic interaction logic is tricky in React, we'll assign it to elements with specific classes via ref or query as simple hook
  useEffect(() => {
    const els = document.querySelectorAll('.magnetic');
    
    const handleMouseMove = function(e) {
      const r = this.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.25;
      const dy = (e.clientY - r.top - r.height / 2) * 0.25;
      this.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    
    const handleMouseLeave = function() {
      this.style.transform = '';
    };

    els.forEach(el => {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mouseenter', () => setCursorHover(true));
      el.addEventListener('mouseleave', () => setCursorHover(false));
    });

    const hoverEls = document.querySelectorAll('a, button, .feature-card, .process-step, .stat-item');
    const setHover = () => setCursorHover(true);
    const removeHover = () => setCursorHover(false);
    
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', setHover);
      el.addEventListener('mouseleave', removeHover);
    });

    return () => {
      els.forEach(el => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      hoverEls.forEach(el => {
        el.removeEventListener('mouseenter', setHover);
        el.removeEventListener('mouseleave', removeHover);
      });
    };
  }, []);

  // Page entry
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    setTimeout(() => setOpacity(1), 50);
  }, []);

  return (
    <div className={`homepage-wrapper ${cursorHover ? 'cursor-hover' : ''}`} style={{ opacity, transition: 'opacity 0.6s ease' }}>
      <div id="cursor">
        <div id="cursor-ring" ref={cursorRing}></div>
        <div id="cursor-dot" ref={cursorDot}></div>
      </div>

      <nav>
        <div className="nav-logo">Aletheia Lens</div>
        <div className="nav-links">
          <a href="#about" className="magnetic">About</a>
          <a href="#features" className="magnetic">Features</a>
          <a href="#process" className="magnetic">Process</a>
          <button onClick={() => navigate('/playground')} className="magnetic cursor-none" style={{ background: 'none', border: 'none', padding: 0, font: 'inherit' }}>
            Dashboard
          </button>
        </div>
      </nav>

      <section id="hero">
        <div className="grid-bg"></div>
        <div className="scan-circle" ref={scRef}></div>
        <div className="scan-line"></div>
        <div className="hero-index">Est. 2024 &nbsp;/&nbsp; Tokyo & London</div>
        <div className="hero-counter">
          <span className="counter-val" id="heroCounter">{String(counter).padStart(5, '0')}</span>
          CASES ANALYZED
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text">AI-Powered Narrative Intelligence</span>
          </div>
          <h1 className="hero-title glitch" data-text="Aletheia Lens AI">
            <span className="line">Aletheia</span>
            <span className="line">Lens</span>
            <span className="line">AI</span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-tagline">Unveiling the authentic narrative through advanced analytical synthesis. Detect misinformation, trace sources, verify claims in real time.</p>
            <div className="hero-cta">
              <button onClick={() => navigate('/playground')} className="btn-primary magnetic outline-none border-none">Explore Cases →</button>
              <a href="#about" className="btn-ghost magnetic">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker-wrap">
        <div className="ticker-track">
          <span className="ticker-item"><span className="ticker-dot"></span><span className="ticker-highlight">98.4%</span>&nbsp;Detection Accuracy</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Multi-source Verification</span>
          <span className="ticker-item"><span className="ticker-dot"></span><span className="ticker-highlight">Real-time</span>&nbsp;Analysis</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Cross-lingual Support</span>
          <span className="ticker-item"><span className="ticker-dot"></span><span className="ticker-highlight">12,847+</span>&nbsp;Cases Analyzed</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Advanced NLP Models</span>
          <span className="ticker-item"><span className="ticker-dot"></span><span className="ticker-highlight">Tokyo &amp; London</span>&nbsp;Hubs</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Narrative Synthesis</span>
          <span className="ticker-item"><span className="ticker-dot"></span><span className="ticker-highlight">98.4%</span>&nbsp;Detection Accuracy</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Multi-source Verification</span>
          <span className="ticker-item"><span className="ticker-dot"></span><span className="ticker-highlight">Real-time</span>&nbsp;Analysis</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Cross-lingual Support</span>
          <span className="ticker-item"><span className="ticker-dot"></span><span className="ticker-highlight">12,847+</span>&nbsp;Cases Analyzed</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Advanced NLP Models</span>
          <span className="ticker-item"><span className="ticker-dot"></span><span className="ticker-highlight">Tokyo &amp; London</span>&nbsp;Hubs</span>
          <span className="ticker-item"><span className="ticker-dot"></span>Narrative Synthesis</span>
        </div>
      </div>

      <section id="about">
        <div className="reveal">
          <div className="about-label">About Aletheia Lens</div>
          <h2 className="about-heading">Seeing through <em>noise</em> to find the signal</h2>
          <p className="about-body">Aletheia Lens is an advanced AI system engineered to detect misinformation, analyze narrative patterns, and synthesize authentic information across thousands of sources simultaneously.</p>
          <p className="about-body">Built at the intersection of machine learning and investigative journalism, our system provides unprecedented accuracy in identifying manipulated content, fabricated narratives, and coordinated disinformation campaigns.</p>
        </div>
        <div className="about-visual reveal" style={{ transitionDelay: '.2s' }}>
          <div className="av-grid"></div>
          <div className="av-circle av-c1"></div>
          <div className="av-circle av-c2"></div>
          <div className="av-circle av-c3"></div>
          <div className="av-dot av-d1"></div>
          <div className="av-dot av-d2"></div>
          <div className="av-dot av-d3"></div>
          <div className="av-label av-l1">Source Analysis Matrix</div>
          <div className="av-label av-l2">Confidence Score Engine</div>
          <div className="av-score">
            <div className="av-score-num">98</div>
            <div className="av-score-label">Accuracy Score</div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="features-header reveal">
          <h2 className="features-title">What<br/>we detect</h2>
          <p className="features-subtitle">Six core detection modules working in parallel to provide comprehensive narrative analysis.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-num">01</div>
            <div className="feature-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="20" stroke="rgba(196,75,43,0.5)" strokeWidth="1"/>
                <circle cx="24" cy="24" r="12" stroke="rgba(196,75,43,0.8)" strokeWidth="1"/>
                <circle cx="24" cy="24" r="4" fill="#C44B2B"/>
                <line x1="24" y1="4" x2="24" y2="12" stroke="#C44B2B" strokeWidth="1.5"/>
                <line x1="44" y1="24" x2="36" y2="24" stroke="#C44B2B" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="feature-name">Source Tracing</div>
            <div className="feature-desc">Map the origin and propagation path of any narrative across thousands of media outlets, social platforms, and primary sources.</div>
          </div>
          <div className="feature-card reveal" style={{ transitionDelay: '.1s' }}>
            <div className="feature-num">02</div>
            <div className="feature-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="32" height="8" stroke="rgba(196,75,43,0.6)" strokeWidth="1"/>
                <rect x="8" y="20" width="32" height="8" stroke="rgba(196,75,43,0.4)" strokeWidth="1"/>
                <rect x="8" y="32" width="22" height="8" stroke="rgba(196,75,43,0.3)" strokeWidth="1"/>
                <line x1="8" y1="12" x2="40" y2="12" stroke="#C44B2B" strokeWidth="2"/>
                <line x1="8" y1="24" x2="30" y2="24" stroke="#C44B2B" strokeWidth="2"/>
              </svg>
            </div>
            <div className="feature-name">Claim Verification</div>
            <div className="feature-desc">Cross-reference statements against verified databases, academic records, and primary source documents in milliseconds.</div>
          </div>
          <div className="feature-card reveal" style={{ transitionDelay: '.2s' }}>
            <div className="feature-num">03</div>
            <div className="feature-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 36 L18 20 L28 28 L38 10" stroke="#C44B2B" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="8" cy="36" r="3" fill="#C44B2B"/>
                <circle cx="18" cy="20" r="2" fill="rgba(196,75,43,0.5)"/>
                <circle cx="28" cy="28" r="2" fill="rgba(196,75,43,0.5)"/>
                <circle cx="38" cy="10" r="3" fill="rgba(196,75,43,0.8)"/>
              </svg>
            </div>
            <div className="feature-name">Sentiment Mapping</div>
            <div className="feature-desc">Detect emotional manipulation, inflammatory language patterns, and coordinated sentiment distortion across media ecosystems.</div>
          </div>
          <div className="feature-card wide reveal" style={{ transitionDelay: '.1s' }}>
            <div>
              <div className="feature-num">04</div>
              <div className="feature-name">Narrative<br/>Pattern Analysis</div>
              <div className="feature-desc">Identify recurring disinformation templates, coordinated inauthentic behavior, and narrative echo chambers with unprecedented precision.</div>
            </div>
            <div className="feature-visual">
              <div className="acc-bars">
                <div className="acc-row"><span className="acc-label">Politics</span><div className="acc-bar-bg"><div className="acc-bar-fill" data-width="94" style={{ width: 0 }}></div></div><span className="acc-pct">94%</span></div>
                <div className="acc-row"><span className="acc-label">Science</span><div className="acc-bar-bg"><div className="acc-bar-fill" data-width="98" style={{ width: 0 }}></div></div><span className="acc-pct">98%</span></div>
                <div className="acc-row"><span className="acc-label">Finance</span><div className="acc-bar-bg"><div className="acc-bar-fill" data-width="91" style={{ width: 0 }}></div></div><span className="acc-pct">91%</span></div>
                <div className="acc-row"><span className="acc-label">Health</span><div className="acc-bar-bg"><div className="acc-bar-fill" data-width="96" style={{ width: 0 }}></div></div><span className="acc-pct">96%</span></div>
                <div className="acc-row"><span className="acc-label">Culture</span><div className="acc-bar-bg"><div className="acc-bar-fill" data-width="88" style={{ width: 0 }}></div></div><span className="acc-pct">88%</span></div>
              </div>
            </div>
          </div>
          <div className="feature-card reveal" style={{ transitionDelay: '.2s' }}>
            <div className="feature-num">05</div>
            <div className="feature-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="8" stroke="rgba(196,75,43,0.6)" strokeWidth="1"/>
                <circle cx="32" cy="32" r="8" stroke="rgba(196,75,43,0.4)" strokeWidth="1"/>
                <line x1="22" y1="20" x2="26" y2="26" stroke="#C44B2B" strokeWidth="1.5"/>
                <circle cx="16" cy="16" r="3" fill="rgba(196,75,43,0.4)"/>
                <circle cx="32" cy="32" r="3" fill="#C44B2B"/>
              </svg>
            </div>
            <div className="feature-name">Network Mapping</div>
            <div className="feature-desc">Visualize social networks amplifying false narratives and identify key propagation nodes.</div>
          </div>
          <div className="feature-card reveal" style={{ transitionDelay: '.3s' }}>
            <div className="feature-num">06</div>
            <div className="feature-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 8 L40 32 H8 Z" stroke="rgba(196,75,43,0.5)" strokeWidth="1" fill="rgba(196,75,43,0.05)"/>
                <line x1="24" y1="18" x2="24" y2="27" stroke="#C44B2B" strokeWidth="2"/>
                <circle cx="24" cy="30" r="1.5" fill="#C44B2B"/>
              </svg>
            </div>
            <div className="feature-name">Alert Engine</div>
            <div className="feature-desc">Real-time notifications when monitored narratives shift, escalate, or cross verification thresholds.</div>
          </div>
        </div>
      </section>

      <section id="stats">
        <div className="stat-item reveal">
          <div className="stat-num">12,847<span className="stat-sup">+</span></div>
          <div className="stat-label">Cases Analyzed</div>
          <div className="stat-desc">Disinformation events tracked and documented globally</div>
        </div>
        <div className="stat-item reveal" style={{ transitionDelay: '.1s' }}>
          <div className="stat-num">98.4<span className="stat-sup">%</span></div>
          <div className="stat-label">Detection Rate</div>
          <div className="stat-desc">Accuracy across all categories of analyzed content</div>
        </div>
        <div className="stat-item reveal" style={{ transitionDelay: '.2s' }}>
          <div className="stat-num">340<span className="stat-sup">ms</span></div>
          <div className="stat-label">Response Time</div>
          <div className="stat-desc">Average time to full multi-source cross-verification</div>
        </div>
        <div className="stat-item reveal" style={{ transitionDelay: '.3s' }}>
          <div className="stat-num">47<span className="stat-sup">+</span></div>
          <div className="stat-label">Languages</div>
          <div className="stat-desc">Native cross-lingual analysis with no accuracy loss</div>
        </div>
      </section>

      <section id="process">
        <div className="process-top reveal">
          <h2 className="process-h">How it<br/><em style={{ fontStyle: 'italic', color: 'var(--rust)' }}>works</em></h2>
          <p style={{ maxWidth: '280px', fontSize: '14px', color: 'var(--fog)', lineHeight: 1.65, fontWeight: 400 }}>Four analytical stages that transform raw information into verified, actionable narrative intelligence.</p>
        </div>
        <div className="process-steps">
          <div className="process-step reveal">
            <div className="step-num">1</div>
            <div className="step-badge">01</div>
            <div className="step-title">Ingest</div>
            <div className="step-body">Multi-channel content ingestion across 10,000+ sources including news, social media, academic databases, and primary documents.</div>
          </div>
          <div className="process-step reveal" style={{ transitionDelay: '.1s' }}>
            <div className="step-num">2</div>
            <div className="step-badge">02</div>
            <div className="step-title">Parse</div>
            <div className="step-body">Advanced NLP models extract claims, entities, and relationships. Named entity recognition maps people, places, and events to knowledge graphs.</div>
          </div>
          <div className="process-step reveal" style={{ transitionDelay: '.2s' }}>
            <div className="step-num">3</div>
            <div className="step-badge">03</div>
            <div className="step-title">Verify</div>
            <div className="step-body">Each claim is cross-referenced against our curated truth database, primary sources, and real-time fact-checking networks for confidence scoring.</div>
          </div>
          <div className="process-step reveal" style={{ transitionDelay: '.3s' }}>
            <div className="step-num">4</div>
            <div className="step-badge">04</div>
            <div className="step-title">Report</div>
            <div className="step-body">Synthesized reports with source maps, confidence scores, narrative timelines, and recommended corrective actions delivered instantly.</div>
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="reveal">
          <h2 className="cta-h">Ready to see the<br/><em>authentic</em> story?</h2>
        </div>
        <div className="cta-right reveal" style={{ transitionDelay: '.2s' }}>
          <p className="cta-sub">Explore live case studies and see Aletheia Lens intelligence in action.</p>
          <button onClick={() => navigate('/playground')} className="btn-cta magnetic outline-none border-none">Open Dashboard →</button>
        </div>
      </section>

      <footer>
        <div className="footer-logo">Aletheia Lens</div>
        <div className="footer-meta">Est. 2024 · Tokyo & London<br/>All Rights Reserved</div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <button onClick={() => navigate('/playground')} className="outline-none border-none cursor-none bg-transparent" style={{ font: 'inherit', padding: 0 }}>Dashboard</button>
        </div>
      </footer>
    </div>
  );
}
