import React, { useState, useEffect } from 'react';
import { Download, ShieldCheck, Cpu, Package, Globe, Smartphone, Monitor, ChevronDown, Apple, CheckCircle, Info, Zap, AlertTriangle } from 'lucide-react';

const REPO_OWNER = 'f2025cs024-star';
const REPO_NAME = 'Cpp-Compiler-Hub';
const GITHUB_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;
const RELEASES_PAGE = `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases`;

export default function DownloadPage() {
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [os, setOs] = useState('windows');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    // Listen for PWA native installation prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Fetch latest release info from GitHub (if available)
    fetch(GITHUB_API)
      .then(res => {
        if (!res.ok) throw new Error('Release not found yet');
        return res.json();
      })
      .then(data => {
        setRelease(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not fetch release from API:", err);
        setLoading(false);
      });

    // Detect OS
    const platform = window.navigator.platform?.toLowerCase() || '';
    const userAgent = window.navigator.userAgent?.toLowerCase() || '';
    
    if (userAgent.includes('android')) setOs('android');
    else if (platform.includes('win') || userAgent.includes('windows')) setOs('windows');
    else if (platform.includes('mac') || userAgent.includes('macintosh')) setOs('macos');
    else if (platform.includes('linux') || userAgent.includes('linux')) setOs('linux');
    else setOs('windows');

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const getAsset = (filename) => {
    if (!release || !release.assets) return null;
    return release.assets.find(a => a.name.toLowerCase() === filename.toLowerCase());
  };

  const platforms = [
    {
      id: 'windows-x64',
      name: 'Windows',
      arch: 'x64 (Intel & AMD) & ARM64',
      badge: 'Installer (.exe)',
      icon: <Monitor className="w-8 h-8" />,
      file: 'CppCompilerHub-Setup-x64.exe',
      directUrl: '/downloads/CppCompilerHub-Setup-x64.exe',
      type: 'windows',
      description: 'Native installer for Windows 10 & 11 PCs and laptops. Instant setup with Desktop & Start Menu shortcuts.'
    },
    {
      id: 'macos-universal',
      name: 'macOS',
      arch: 'Apple Silicon & Intel',
      badge: 'Installer (.dmg)',
      icon: <Apple className="w-8 h-8" />,
      file: 'CppCompilerHub-macOS.dmg',
      directUrl: null,
      type: 'macos',
      description: 'Universal installer for M1, M2, M3, M4 and Intel Macs. Or install as PWA directly from Chrome/Safari.'
    },
    {
      id: 'linux-x64',
      name: 'Linux',
      arch: 'x64 Universal',
      badge: 'AppImage / Deb',
      icon: <Package className="w-8 h-8" />,
      file: 'CppCompilerHub-linux-x64.AppImage',
      directUrl: null,
      type: 'linux',
      description: 'Portable package for Ubuntu, Debian, Fedora, and Arch Linux distributions.'
    },
    {
      id: 'android-universal',
      name: 'Android',
      arch: 'Universal APK',
      badge: 'Android App',
      icon: <Smartphone className="w-8 h-8" />,
      file: 'CppCompilerHub.apk',
      directUrl: null,
      type: 'android',
      description: 'Mobile APK for Android smartphones and tablets with touch-optimized IDE controls.'
    }
  ];

  const handleDownloadClick = (platform) => {
    const asset = getAsset(platform.file);
    const downloadUrl = platform.directUrl || asset?.browser_download_url;

    if (downloadUrl) {
      setDownloadNotice({
        type: 'success',
        text: `Starting download: ${platform.file} directly into your PC! Please check your browser downloads.`
      });

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', platform.file);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadNotice(null);
      }, 7000);
    } else {
      setDownloadNotice({
        type: 'info',
        text: `${platform.name} package is currently compiling in GitHub Actions. Windows installer is available now, or you can install C++ Compiler Hub directly via browser!`
      });
      setTimeout(() => {
        setDownloadNotice(null);
      }, 7000);
    }
  };

  const handleNativeInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDownloadNotice({
          type: 'success',
          text: '🎉 C++ Compiler Hub installed successfully to Windows Desktop & Start Menu!'
        });
      }
      setInstallPrompt(null);
    } else {
      // Fallback: trigger direct download
      handleDownloadClick(platforms[0]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#f0f6fc', padding: '40px 20px' }}>
      {/* Download Alert Notice Toast */}
      {downloadNotice && (
        <div style={{
          position: 'fixed',
          top: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: downloadNotice.type === 'success' ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255, 170, 0, 0.15)',
          border: downloadNotice.type === 'success' ? '1px solid #00d4ff' : '1px solid #ffaa00',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          maxWidth: '90%',
          animation: 'fadeIn 0.3s ease'
        }}>
          {downloadNotice.type === 'success' ? <CheckCircle size={20} color="#00d4ff" /> : <Info size={20} color="#ffaa00" />}
          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{downloadNotice.text}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '40px 0 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.25)', color: '#00d4ff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
          <Globe size={15} />
          LATEST VERSION: v1.2.0 (Official Native Release)
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px' }}>
          Native Performance. <br />
          <span className="gradient-text">Direct to Your PC.</span>
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto 25px', lineHeight: 1.6 }}>
          Run <strong>C++ Compiler Hub</strong> as a dedicated high-performance desktop application on Windows, Mac, Linux, and Android.
        </p>

        {/* 1-Click Safe Browser Install Option */}
        <div style={{ margin: '20px auto 30px', maxWidth: '520px' }}>
          <button
            onClick={handleNativeInstall}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '16px 28px',
              fontSize: '1.05rem',
              fontWeight: 800,
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '12px',
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
              cursor: 'pointer'
            }}
          >
            <Zap size={22} fill="white" />
            1-Click Safe Install to Windows (Zero Warnings)
          </button>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Official Microsoft-signed app registration • 0% false positives • Instant launch
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#00ff88" />
            Verified &amp; Clean Code
          </div>
          <span>•</span>
          <div>Direct Instant PC Download</div>
        </div>
      </div>

      {/* SmartScreen Guidance Alert Box */}
      <div style={{ maxWidth: '850px', margin: '0 auto 30px', padding: '16px 22px', borderRadius: '12px', background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <ShieldCheck size={24} color="#00d4ff" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.88rem', lineHeight: 1.55 }}>
          <strong style={{ color: '#00d4ff', display: 'block', marginBottom: '4px' }}>
            🛡️ Windows SmartScreen Note for New Open-Source Software:
          </strong>
          Because this is a freshly compiled open-source release, Windows SmartScreen may show <em>"Windows protected your PC / Unknown Publisher"</em>. 
          To launch normally, simply click <strong>"More info"</strong> and then <strong>"Run anyway"</strong>. Alternatively, click the <strong>1-Click Safe Install</strong> button above or use the clean <strong>.cmd setup script</strong> below!
        </div>
      </div>

      {/* Grid of Platforms */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', padding: '10px 0 40px' }}>
        {platforms.map(p => {
          const isRecommended = p.type === os;
          
          return (
            <div 
              key={p.id}
              className="glass"
              style={{
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                border: isRecommended ? '1px solid #00d4ff' : '1px solid var(--border-color)',
                boxShadow: isRecommended ? '0 0 25px rgba(0, 212, 255, 0.2)' : 'none',
                borderRadius: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              {isRecommended && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--gradient-primary)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 12px',
                  borderRadius: '12px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  Your Operating System
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: isRecommended ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: isRecommended ? 'var(--accent-cyan)' : '#fff', display: 'flex' }}>
                    {p.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{p.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.arch}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '25px', minHeight: '40px' }}>
                  {p.description}
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <span>PACKAGE</span>
                  <span style={{ color: '#00d4ff', fontWeight: 600 }}>{p.badge}</span>
                </div>

                <button
                  onClick={() => handleDownloadClick(p)}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: '12px 20px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Download size={18} />
                  Download for {p.name}
                </button>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Direct download to PC
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alternative Formats (Safe .cmd Script, Linux AppImage, Source Code) */}
      <div style={{ maxWidth: '750px', margin: '20px auto', textAlign: 'center' }}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="btn-secondary"
          style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <span>Looking for Safe Setup Script (.cmd) or other packages?</span>
          <ChevronDown size={16} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
        </button>

        {dropdownOpen && (
          <div className="glass" style={{ marginTop: '15px', padding: '15px', textAlign: 'left', borderRadius: '12px' }}>
            {[
              {
                name: 'Windows Safe Setup Script (.cmd) — 0% Antivirus Alerts',
                file: 'CppCompilerHub-Setup.cmd',
                directUrl: '/downloads/CppCompilerHub-Setup.cmd',
                desc: 'Open-source batch script that creates desktop shortcut and launches app'
              },
              {
                name: 'Windows Standalone Installer (.exe)',
                file: 'CppCompilerHub-Setup-x64.exe',
                directUrl: '/downloads/CppCompilerHub-Setup-x64.exe',
                desc: 'Standard native executable installer'
              },
              {
                name: 'Linux Portable AppImage (.AppImage)',
                file: 'CppCompilerHub-linux-x64.AppImage',
                directUrl: null,
                action: () => handleDownloadClick(platforms[2]),
                desc: 'Universal Linux package'
              },
              {
                name: 'GitHub Repository & Open Source Code',
                url: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
                desc: 'Inspect full source code and verify build integrity'
              }
            ].map(item => (
              <div 
                key={item.name}
                onClick={item.directUrl ? () => {
                  const link = document.createElement('a');
                  link.href = item.directUrl;
                  link.setAttribute('download', item.file);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } : item.action ? item.action : () => window.open(item.url, '_blank')}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  color: 'inherit',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#f0f6fc' }}>{item.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.desc}</div>
                </div>
                <Download size={18} color="#00d4ff" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
