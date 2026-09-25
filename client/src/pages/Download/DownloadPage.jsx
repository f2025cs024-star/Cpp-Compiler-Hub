import React, { useState, useEffect } from 'react';
import { Download, ShieldCheck, Cpu, Package, Globe, Smartphone, Monitor, ChevronDown, Apple } from 'lucide-react';

const REPO_OWNER = 'f2025cs024-star';
const REPO_NAME = 'Cpp-Compiler-Hub';
const GITHUB_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;
const RELEASES_PAGE = `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases`;

export default function DownloadPage() {
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [os, setOs] = useState('unknown');
  const [showSha, setShowSha] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch latest release info from GitHub
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
  }, []);

  const getAsset = (filename) => {
    if (!release || !release.assets) return null;
    return release.assets.find(a => a.name.toLowerCase() === filename.toLowerCase());
  };

  const formatSize = (bytes) => {
    if (!bytes) return '~15 MB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const platforms = [
    {
      id: 'windows-x64',
      name: 'Windows',
      arch: 'x64 (Intel & AMD)',
      badge: 'Installer (.exe)',
      icon: <Monitor className="w-8 h-8" />,
      file: 'CppCompilerHub-Setup-x64.exe',
      type: 'windows',
      description: 'Standard 64-bit installer for Windows 10 & 11 PCs and laptops'
    },
    {
      id: 'macos-universal',
      name: 'macOS',
      arch: 'Apple Silicon & Intel',
      badge: 'Installer (.dmg)',
      icon: <Apple className="w-8 h-8" />,
      file: 'CppCompilerHub-macOS.dmg',
      type: 'macos',
      description: 'Universal installer for M1, M2, M3, M4 and Intel Macs'
    },
    {
      id: 'linux-x64',
      name: 'Linux',
      arch: 'x64 Universal',
      badge: 'AppImage / Deb',
      icon: <Package className="w-8 h-8" />,
      file: 'CppCompilerHub-linux-x64.AppImage',
      type: 'linux',
      description: 'Portable package for Ubuntu, Debian, Fedora, and Arch'
    },
    {
      id: 'android-universal',
      name: 'Android',
      arch: 'Universal APK',
      badge: 'Android App',
      icon: <Smartphone className="w-8 h-8" />,
      file: 'CppCompilerHub.apk',
      type: 'android',
      description: 'Native mobile app for Android phones and tablets'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#f0f6fc', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '40px 0 30px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.25)', color: '#00d4ff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
          <Globe size={15} />
          LATEST VERSION: {release?.tag_name || 'v1.2.0'}
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px' }}>
          Native Performance. <br />
          <span className="gradient-text">On Every Device.</span>
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto 25px', lineHeight: 1.6 }}>
          Run <strong>C++ Compiler Hub</strong> as a dedicated high-performance desktop or mobile application on Windows, Mac, Linux, and Android.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#00ff88" />
            Verified &amp; Open Source
          </div>
          <span>•</span>
          <div>Direct from GitHub Releases</div>
        </div>
      </div>

      {/* Grid of Platforms */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', padding: '20px 0 40px' }}>
        {platforms.map(p => {
          const asset = getAsset(p.file);
          const isRecommended = p.type === os;
          const downloadUrl = asset ? asset.browser_download_url : `${RELEASES_PAGE}/latest`;
          
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

                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    padding: '12px 20px',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}
                >
                  <Download size={18} />
                  Download for {p.name}
                </a>

                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <a 
                    href={RELEASES_PAGE}
                    target="_blank" 
                    rel="noreferrer"
                    style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
                  >
                    View on GitHub Releases ↗
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Other Architectures (Windows ARM, Ubuntu deb, Linux AppImage) */}
      <div style={{ maxWidth: '700px', margin: '20px auto', textAlign: 'center' }}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="btn-secondary"
          style={{ padding: '10px 24px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <span>Looking for ARM64 or other packages?</span>
          <ChevronDown size={16} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
        </button>

        {dropdownOpen && (
          <div className="glass" style={{ marginTop: '15px', padding: '15px', textAlign: 'left', borderRadius: '12px' }}>
            {[
              { name: 'Windows ARM64 (Surface / Snapdragon)', file: 'CppCompilerHub-Setup-arm64.exe' },
              { name: 'Linux Ubuntu / Debian (.deb)', file: 'CppCompilerHub-linux-x64.deb' },
              { name: 'Linux Portable AppImage (.AppImage)', file: 'CppCompilerHub-linux-x64.AppImage' },
              { name: 'All GitHub Releases & Source Code', file: 'All Releases', url: RELEASES_PAGE }
            ].map(item => (
              <a 
                key={item.name}
                href={item.url || getAsset(item.file)?.browser_download_url || `${RELEASES_PAGE}/latest`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  color: 'inherit',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <span>{item.name}</span>
                <Download size={16} color="#00d4ff" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
