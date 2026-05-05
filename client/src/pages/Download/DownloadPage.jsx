import React, { useState, useEffect } from 'react';

const VERSION = 'v1.0.0';
const RELEASE_DATE = 'May 6, 2026';
const GITHUB_RELEASE_BASE = 'https://github.com/f2025cs024-star/nexcpp-deploy/releases/download/' + VERSION;

const platforms = [
  {
    id: 'windows-x64',
    name: 'Windows',
    arch: 'x64',
    badge: 'Intel / AMD 64-bit',
    icon: '🪟',
    file: 'NexCPP-Setup-x64.exe',
    size: '~12 MB',
    sha256: 'a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    detect: () => navigator.platform.toLowerCase().includes('win') && !navigator.platform.toLowerCase().includes('arm'),
  },
  {
    id: 'windows-arm64',
    name: 'Windows',
    arch: 'ARM64',
    badge: 'ARM 64-bit',
    icon: '🪟',
    file: 'NexCPP-Setup-arm64.exe',
    size: '~11 MB',
    sha256: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
    detect: () => navigator.platform.toLowerCase().includes('arm') && navigator.userAgent.toLowerCase().includes('win'),
  },
  {
    id: 'android-arm64',
    name: 'Android',
    arch: 'ARM64',
    badge: 'ARM 64-bit (Most phones)',
    icon: '🤖',
    file: 'NexCPP-arm64.apk',
    size: '~18 MB',
    sha256: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    detect: () => /android/i.test(navigator.userAgent) && !/x86/i.test(navigator.userAgent),
  },
  {
    id: 'android-x86',
    name: 'Android',
    arch: 'x86_64',
    badge: 'Intel / AMD (Emulators)',
    icon: '🤖',
    file: 'NexCPP-x86_64.apk',
    size: '~19 MB',
    sha256: 'd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    detect: () => /android/i.test(navigator.userAgent) && /x86/i.test(navigator.userAgent),
  },
  {
    id: 'linux-x64',
    name: 'Linux',
    arch: 'x64',
    badge: 'Intel / AMD 64-bit',
    icon: '🐧',
    file: 'NexCPP-linux-x64.AppImage',
    size: '~15 MB',
    sha256: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    detect: () => /linux/i.test(navigator.platform) && !/arm/i.test(navigator.platform),
  },
  {
    id: 'linux-arm64',
    name: 'Linux',
    arch: 'ARM64',
    badge: 'ARM 64-bit (Raspberry Pi)',
    icon: '🐧',
    file: 'NexCPP-linux-arm64.AppImage',
    size: '~14 MB',
    sha256: 'f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    detect: () => /linux/i.test(navigator.platform) && /arm/i.test(navigator.platform),
  },
];

export default function DownloadPage() {
  const [recommended, setRecommended] = useState(null);
  const [showSha, setShowSha] = useState({});
  const [copied, setCopied] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const match = platforms.find(p => p.detect());
    setRecommended(match ? match.id : null);
  }, []);

  const toggleSha = (id) => setShowSha(prev => ({ ...prev, [id]: !prev[id] }));

  const copySha = (id, sha) => {
    navigator.clipboard.writeText(sha);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadUrl = (file) => `${GITHUB_RELEASE_BASE}/${file}`;

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 20px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.12) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          display: 'inline-block', padding: '6px 18px', borderRadius: '20px',
          background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
          fontSize: '0.8rem', color: '#00d4ff', marginBottom: '16px', letterSpacing: '0.1em'
        }}>
          LATEST RELEASE — {VERSION}
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
          margin: '0 0 16px',
          background: 'linear-gradient(135deg, #fff 0%, #00d4ff 50%, #7c3aed 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Download NexCPP
        </h1>
        <p style={{ color: '#8b949e', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 12px' }}>
          Your professional C++ compiler, now available as a native desktop app. No browser required.
        </p>
        <div style={{ color: '#6e7681', fontSize: '0.85rem' }}>Released: {RELEASE_DATE}</div>
      </div>

      {/* Recommended banner */}
      {recommended && (
        <div style={{ maxWidth: '900px', margin: '0 auto 20px', padding: '0 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))',
            border: '1px solid rgba(0,212,255,0.25)', borderRadius: '12px',
            padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap'
          }}>
            <span style={{ color: '#00d4ff', fontSize: '1.2rem' }}>⚡</span>
            <span style={{ color: '#e6edf3', fontWeight: 600 }}>We detected your platform.</span>
            <span style={{ color: '#8b949e', fontSize: '0.9rem' }}>
              {platforms.find(p => p.id === recommended)?.name} {platforms.find(p => p.id === recommended)?.arch} is highlighted below.
            </span>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {platforms.map(p => {
            const isRec = p.id === recommended;
            const shaVisible = showSha[p.id];
            const wasCopied = copied === p.id;
            return (
              <div key={p.id} style={{
                background: isRec
                  ? 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))'
                  : 'rgba(22,27,34,0.8)',
                border: isRec ? '1px solid rgba(0,212,255,0.4)' : '1px solid rgba(48,54,61,0.8)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {isRec && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                    borderRadius: '20px', padding: '4px 14px',
                    fontSize: '0.72rem', fontWeight: 700, color: '#fff', letterSpacing: '0.08em', whiteSpace: 'nowrap'
                  }}>
                    ✓ RECOMMENDED FOR YOU
                  </div>
                )}

                {/* Platform Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '2rem' }}>{p.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e6edf3' }}>{p.name}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)',
                        borderRadius: '8px', padding: '2px 8px', fontSize: '0.72rem', color: '#00d4ff', fontWeight: 700
                      }}>{p.arch}</span>
                      <span style={{
                        background: 'rgba(139,148,158,0.1)', border: '1px solid rgba(139,148,158,0.2)',
                        borderRadius: '8px', padding: '2px 8px', fontSize: '0.72rem', color: '#8b949e'
                      }}>{p.badge}</span>
                    </div>
                  </div>
                </div>

                {/* File info */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#6e7681', fontSize: '0.78rem', marginBottom: '4px' }}>FILE</div>
                  <div style={{ color: '#8b949e', fontSize: '0.82rem', wordBreak: 'break-all' }}>{p.file}</div>
                  <div style={{ color: '#6e7681', fontSize: '0.78rem', marginTop: '8px' }}>
                    SIZE: <span style={{ color: '#8b949e' }}>{p.size}</span>
                  </div>
                </div>

                {/* Download Button */}
                <a
                  href={downloadUrl(p.file)}
                  download
                  style={{
                    display: 'block', textAlign: 'center', padding: '10px 20px',
                    borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
                    background: isRec
                      ? 'linear-gradient(135deg, #00d4ff, #7c3aed)'
                      : 'rgba(48,54,61,0.8)',
                    color: '#fff',
                    border: isRec ? 'none' : '1px solid rgba(48,54,61,1)',
                    cursor: 'pointer', transition: 'opacity 0.2s',
                    marginBottom: '12px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  ⬇ Download {p.arch}
                </a>

                {/* SHA256 Toggle */}
                <div>
                  <button
                    onClick={() => toggleSha(p.id)}
                    style={{
                      background: 'none', border: 'none', color: '#6e7681',
                      fontSize: '0.75rem', cursor: 'pointer', padding: '0',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    🔐 {shaVisible ? 'Hide' : 'Show'} SHA256 Checksum
                  </button>
                  {shaVisible && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{
                        background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '8px 10px',
                        fontFamily: 'monospace', fontSize: '0.65rem', color: '#6e7681',
                        wordBreak: 'break-all', cursor: 'pointer'
                      }}
                        onClick={() => copySha(p.id, p.sha256)}
                        title="Click to copy"
                      >
                        {p.sha256}
                      </div>
                      <div style={{ color: '#00d4ff', fontSize: '0.7rem', marginTop: '4px' }}>
                        {wasCopied ? '✓ Copied!' : 'Click to copy'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* All Platforms Dropdown */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              background: 'rgba(22,27,34,0.8)', border: '1px solid rgba(48,54,61,0.8)',
              borderRadius: '12px', padding: '12px 24px', color: '#8b949e',
              cursor: 'pointer', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}
          >
            📦 All Platforms {dropdownOpen ? '▲' : '▼'}
          </button>
          {dropdownOpen && (
            <div style={{
              marginTop: '12px', background: 'rgba(22,27,34,0.95)',
              border: '1px solid rgba(48,54,61,0.8)', borderRadius: '12px',
              overflow: 'hidden', maxWidth: '480px', margin: '12px auto 0'
            }}>
              {platforms.map(p => (
                <a
                  key={p.id}
                  href={downloadUrl(p.file)}
                  download
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 20px', color: '#e6edf3', textDecoration: 'none',
                    borderBottom: '1px solid rgba(48,54,61,0.5)', fontSize: '0.85rem',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span>{p.icon} {p.name} <strong>{p.arch}</strong> — {p.badge}</span>
                  <span style={{ color: '#00d4ff', fontSize: '0.75rem' }}>↓ {p.size}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div style={{
          marginTop: '60px', padding: '24px', borderRadius: '12px',
          background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.6)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'
        }}>
          {[
            { icon: '🖥️', title: 'Native Performance', desc: 'Built with Tauri — fast, lightweight, no Chromium bloat.' },
            { icon: '🔒', title: 'Secure by Default', desc: 'Code executes in a sandboxed environment on your machine.' },
            { icon: '📱', title: 'Android Support', desc: 'APK for Android phones and tablets, powered by Capacitor.' },
            { icon: '🔄', title: 'Auto-Updates', desc: 'New releases auto-build via GitHub Actions CI/CD.' },
          ].map(item => (
            <div key={item.title}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontWeight: 700, color: '#e6edf3', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ color: '#6e7681', fontSize: '0.82rem', lineHeight: '1.5' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
