// import { useState } from 'react';
// import { useLocation } from 'wouter';
// import LoginForm from '../components/login-form.jsx';
// import RegisterForm from '../components/register-form.jsx';
// import { isAuthenticated } from '../api/auth';
//
// const AuthPage = () => {
//   const [, setLocation] = useLocation();
//   const [isLogin, setIsLogin] = useState(true);
//
//   // Redirect if already authenticated
//   if (isAuthenticated()) {
//     setLocation('/dashboard');
//     return null;
//   }
//
//   const handleLoginSuccess = () => {
//     setLocation('/dashboard');
//   };
//
//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'var(--gradient-secondary)',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: 'var(--spacing-xl)'
//     }}>
//       {/* Header */}
//       <div className="text-center mb-xl">
//         <h1 style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
//           BACKTRACKER
//         </h1>
//         <p style={{
//           fontSize: '1.25rem',
//           color: 'var(--text-secondary)',
//           maxWidth: '600px',
//           lineHeight: 1.6
//         }}>
//           Your ultimate platform for managing and sharing Data Structures & Algorithms problem sheets
//         </p>
//       </div>
//
//       {/* Auth Form */}
//       <div style={{ width: '100%', maxWidth: '500px' }}>
//         {isLogin ? (
//           <LoginForm
//             onSuccess={handleLoginSuccess}
//             onSwitchToRegister={() => setIsLogin(false)}
//           />
//         ) : (
//           <RegisterForm
//             onSuccess={handleLoginSuccess}
//             onSwitchToLogin={() => setIsLogin(true)}
//           />
//         )}
//       </div>
//
//       {/* Footer */}
//       <div className="text-center mt-xl">
//         <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
//           Built for Competitive Programmers • Secure • Fast • Collaborative
//         </p>
//       </div>
//     </div>
//   );
// };
//
// export default AuthPage;
import { useState } from 'react';
import { useLocation } from 'wouter';
import LoginForm from '../components/login-form.jsx';
import RegisterForm from '../components/register-form.jsx';
import { isAuthenticated } from '../api/auth';
import ScreenshotSlideshow from '../components/ScreenshotSlideshow';

import dash11 from '/images/p1.1.png';
import dash12 from '/images/p1.2.png';
import dash13 from '/images/p1.3.png';

import dash21 from '/images/p21.png';
import dash22 from '/images/p22.png';
import dash23 from '/images/p23.png';

import dash31 from '/images/p31.png';
import dash32 from '/images/p32.png';
import dash33 from '/images/p33.png';
import icon from '/images/icon.png';


const AuthPage = () => {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  // Redirect if already authenticated
  if (isAuthenticated()) {
    setLocation('/dashboard');
    return null;
  }

  const handleLoginSuccess = () => {
    setLocation('/dashboard');
  };

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 10%, #2a1b5e 0%, #0f0f23 60%)', // Deep space bg
      overflowX: 'hidden'
    }}>

      {/* ================= HERO SECTION ================= */}
      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between" style={{ minHeight: '90vh' }}>

        {/* Left Side: Text & Hook */}
        <div className="lg:w-1/2 text-left mb-12 lg:mb-0 z-10 fade-in">
            {/* Logo & Brand Name Header */}
            <div className="flex items-center gap-6 mb-8 fade-in">
              {/* Logo Image */}
              <img
                src={icon}
                alt="Backtracker Logo"
                className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(109,73,232,0.6)]"
              />

              {/* H1 Title */}
              <h1
                className="gradient-text font-bold"
                style={{ fontSize: '4rem', lineHeight: 1, margin: 0 }}
              >
                Backtracker
              </h1>
            </div>

          <p className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
            Stop losing track of your problems. Backtracker is the
            collaborative sheet manager designed for saving your favourite question url in sheets. Explore our Features!
          </p>


          <div className="flex gap-4">
            <button onClick={scrollToFeatures} className="btn-secondary">
              Explore Features ↓
            </button>
            <a href="https://github.com/kowshikdontu/Backtracker" target="_blank" className="text-gray-400 hover:text-white flex items-center px-4">
              View on GitHub ↗
            </a>
          </div>
        </div>
         {/* ... inside the Left Side div, after the buttons div ... */}

            <div className="mt-10 p-5 rounded-xl bg-white bg-opacity-5 border border-purple-500/30 backdrop-blur-md max-w-md shadow-lg">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="bg-purple-600/20 p-3 rounded-lg text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 19l-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-1 1-1-1-5-5m0 0l5 5m0-5v5" />
                  </svg>
                </div>

                {/* Text */}
                <div>
                  <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-1">
                    Recruiter / Demo Access
                  </p>
                  <div className="flex flex-col gap-1">
                    Email:
                    <code className="text-sm text-white font-mono bg-black/30 px-2 py-1 rounded select-all cursor-pointer hover:bg-black/50 transition-colors">
                      kowshikdontu@gmail.com
                    </code>
                    password:
                    <code className="text-sm text-white font-mono bg-black/30 px-2 py-1 rounded select-all cursor-pointer hover:bg-black/50 transition-colors">
                      password123
                    </code>
                  </div>
                </div>
              </div>
            </div>
        {/* Right Side: Glass Login Card */}
        <div className="lg:w-1/3 w-full relative z-10 slide-up">
          {/* Decorative glowing orb behind the card */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '300px', height: '300px', background: 'var(--primary-color)',
            filter: 'blur(100px)', opacity: 0.4, zIndex: -1
          }}></div>

          <div className="card" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-center mb-6 text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Join the Elite'}</h2>
            {isLogin ? (
              <LoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSuccess={handleLoginSuccess} onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>


      {/* ================= OVERVIEW ICONS ================= */}
      <div id="features" className="py-20 bg-opacity-30 bg-black">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: "Smart Tracking", icon: "📊", desc: "Visualize your progress with dynamic bar graphs and metrics." },
            { title: "Collaborative Sheets", icon: "🤝", desc: "Share your curated sheets with peers using secure access codes." },
            { title: "Instant Extension", icon: "⚡", desc: "Add problems directly from LeetCode or Codeforces with one click." }
          ].map((f, i) => (
            <div key={i} className="glass-feature-box hover:translate-y-2 transition-transform duration-300">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.5rem' }}>{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>


      {/* ================= FEATURE PACK 1: DASHBOARD ================= */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left: Auto Slideshow */}
            <div className="lg:w-1/2 w-full">
              <ScreenshotSlideshow images={[dash11, dash12, dash13]} />
            </div>

          {/* Right: Text */}
          <div className="lg:w-1/2 glass-feature-box">
            <h3>Your Personal Command Center</h3>
            <p className="text-gray-300 mb-6">A clutter-free environment to track what matters. Focus on solving, not organizing.</p>

            <div className="feature-list-item"><span className="feature-icon">✓</span> One-click Status Updates</div>
            <div className="feature-list-item"><span className="feature-icon">✓</span> Filter by Tags & Difficulty</div>
            <div className="feature-list-item"><span className="feature-icon">✓</span> Visual Bar Graphs of Progress</div>
          </div>

        </div>
      </section>


      {/* ================= FEATURE PACK 2: COLLABORATION ================= */}
      <section className="py-24 bg-opacity-20 bg-black">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">

          {/* Left: Auto Slideshow */}
            <div className="lg:w-1/2 w-full">
              <ScreenshotSlideshow images={[dash21, dash22, dash23]} />
            </div>

          {/* Right: Text */}
          <div className="lg:w-1/2 glass-feature-box">
            <h3>Collaborate & Compete</h3>
            <p className="text-gray-300 mb-6">See what your friends are solving. Import their best problems directly to your sheet.</p>

            <div className="feature-list-item"><span className="feature-icon">✓</span> Secure Access Codes</div>
            <div className="feature-list-item"><span className="feature-icon">✓</span> "View-Only" Mode for Peers</div>
            <div className="feature-list-item"><span className="feature-icon">✓</span> One-Tap Import to My Sheet</div>
          </div>

        </div>
      </section>


      {/* ================= FEATURE PACK 3: EXTENSION ================= */}
      <section className="py-24 container mx-auto px-6 mb-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left: Auto Slideshow */}
            <div className="lg:w-1/2 w-full">
              <ScreenshotSlideshow images={[dash31, dash32, dash33]} />
            </div>

          {/* Right: Text */}
          <div className="lg:w-1/2 glass-feature-box" style={{ borderColor: 'var(--primary-color)' }}>
            <div className="inline-block px-3 py-1 mb-4 text-xs font-bold text-white bg-purple-600 rounded-full">
              POWER USER TOOL
            </div>
            <h3>The Browser Extension</h3>
            <p className="text-gray-300 mb-6">Never switch tabs again. Add problems to your sheet the moment you solve them.</p>

            <div className="feature-list-item"><span className="feature-icon">✓</span> Auto-detects Problem Name</div>
            <div className="feature-list-item"><span className="feature-icon">✓</span> Grabs Current URL</div>
            <div className="feature-list-item"><span className="feature-icon">✓</span> 2-Click Add to Sheet</div>

            <div className="mt-8 p-6 rounded-xl bg-gray-900 bg-opacity-60 border border-gray-700 backdrop-blur-sm">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="bg-purple-600 text-xs px-2 py-1 rounded"></span>
                Installation Guide
              </h4>

              <ol className="text-sm text-gray-400 space-y-3 mb-6 list-decimal list-inside">
                <li>
                  Go to our <strong className="text-gray-200">GitHub Repository</strong> (button below).
                </li>
                <li>
                  Download the extension ZIP and <strong className="text-gray-200">extract/unzip</strong> it.
                </li>
                <li>
                  Open Chrome and go to <code className="bg-gray-800 px-1 py-0.5 rounded text-purple-400">chrome://extensions</code>
                </li>
                <li>
                  Toggle <strong className="text-gray-200">Developer mode</strong> (top right corner).
                </li>
                <li>
                  Click <strong className="text-gray-200">Load unpacked</strong> and select the <code className="text-purple-300">backtracker_extension</code> folder inside the unzipped files.
                </li>
                <li>
                  Enable it and <strong className="text-gray-200">Log in with our website Credentials</strong> and can use it in any <code className="text-purple-300">Platforms</code> as shown.
                </li>
              </ol>

              {/* GITHUB REPO BUTTON */}
              <a
                href="https://github.com/kowshikdontu/Backtracker"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-center no-underline hover:brightness-110 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Get Extension on GitHub
              </a>
              </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-800 text-gray-500 text-sm">
        <p>Built with ❤️ by Dontu Kowshik • Backtracker © 2025</p>
      </div>

    </div>
  );
};

export default AuthPage;
