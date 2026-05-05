import React, { useState, useEffect } from 'react';
import { Download, ShieldCheck, Cpu, Package, Globe, Smartphone, Monitor, ChevronDown } from 'lucide-react';

const REPO_OWNER = 'f2025cs024-star';
const REPO_NAME = 'nexcpp-deploy';
const GITHUB_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`;

export default function DownloadPage() {
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [os, setOs] = useState('unknown');
  const [showSha, setShowSha] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch latest release info from GitHub
    fetch(GITHUB_API)
      .then(res => res.json())
      .then(data => {
        setRelease(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching release:", err);
        setLoading(false);
      });

    // Detect OS
    const platform = window.navigator.platform.toLowerCase();
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) setOs('android');
    else if (platform.includes('win')) setOs('windows');
    else if (platform.includes('linux')) setOs('linux');
    else if (platform.includes('mac')) setOs('macos');
  }, []);

  const getAsset = (filename) => {
    if (!release) return null;
    return release.assets.find(a => a.name === filename);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '--- MB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const platforms = [
    {
      id: 'windows-x64',
      name: 'Windows',
      arch: 'x64',
      badge: 'Intel / AMD 64-bit',
      icon: <Monitor className="w-8 h-8" />,
      file: 'NexCPP-Setup-x64.exe',
      type: 'windows',
      description: 'Standard installer for most PCs'
    },
    {
      id: 'windows-arm64',
      name: 'Windows',
      arch: 'ARM64',
      badge: 'ARM 64-bit',
      icon: <Cpu className="w-8 h-8" />,
      file: 'NexCPP-Setup-arm64.exe',
      type: 'windows',
      description: 'Optimized for Surface & ARM laptops'
    },
    {
      id: 'android-arm64',
      name: 'Android',
      arch: 'ARM64',
      badge: 'ARM 64-bit',
      icon: <Smartphone className="w-8 h-8" />,
      file: 'NexCPP-arm64.apk',
      type: 'android',
      description: 'Best for modern Android phones'
    },
    {
      id: 'linux-x64',
      name: 'Linux',
      arch: 'x64',
      badge: 'AppImage',
      icon: <Package className="w-8 h-8" />,
      file: 'NexCPP-linux-x64.AppImage',
      type: 'linux',
      description: 'Universal Linux portable package'
    }
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#e6edf3]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans selection:bg-cyan-500/30">
      {/* Dynamic Header */}
      <div className="relative pt-24 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,212,255,0.1),transparent_70%)] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold mb-6 animate-fade-in">
          <Globe size={14} />
          LATEST VERSION: {release?.tag_name || 'v1.0.0'}
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
          Native Power. <br className="hidden md:block" /> Everywhere.
        </h1>
        
        <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          The NexCPP experience you love, now as a high-performance native application for all your devices.
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-500" />
            Verified & Secure
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-700" />
          <div>Released: {release ? new Date(release.created_at).toLocaleDateString() : '---'}</div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map(p => {
            const asset = getAsset(p.file);
            const isRecommended = p.type === os;
            
            return (
              <div 
                key={p.id}
                className={`relative group bg-[#161b22]/50 border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 ${
                  isRecommended ? 'border-cyan-500/50 ring-1 ring-cyan-500/20 bg-cyan-500/[0.03]' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                    Recommended
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${isRecommended ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}`}>
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <span className="text-xs text-gray-500 font-mono">{p.arch}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-8 line-clamp-2 h-10">
                  {p.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono px-1">
                    <span>SIZE</span>
                    <span>{formatSize(asset?.size)}</span>
                  </div>

                  <a
                    href={asset?.browser_download_url || '#'}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                      asset 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={(e) => !asset && e.preventDefault()}
                  >
                    <Download size={18} />
                    {asset ? 'Download Now' : 'Build Pending'}
                  </a>

                  <button 
                    onClick={() => setShowSha(prev => ({...prev, [p.id]: !prev[p.id]}))}
                    className="w-full text-[10px] text-gray-600 hover:text-gray-400 uppercase tracking-widest font-bold transition-colors"
                  >
                    {showSha[p.id] ? 'Hide' : 'Verify'} SHA256
                  </button>

                  {showSha[p.id] && (
                    <div className="p-3 bg-black/40 rounded-lg border border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-[9px] font-mono text-gray-500 break-all leading-relaxed">
                        {/* In a real app, you'd fetch the .sha256 file content */}
                        Available on Release Page
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* All Platforms Dropdown */}
        <div className="mt-20 flex flex-col items-center">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            Looking for other platforms? <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="mt-4 w-full max-w-lg bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2">
                {[
                  { name: 'Windows ARM64', file: 'NexCPP-Setup-arm64.exe' },
                  { name: 'Android x86_64', file: 'NexCPP-x86_64.apk' },
                  { name: 'Linux ARM64', file: 'NexCPP-linux-arm64.AppImage' },
                  { name: 'Ubuntu (.deb)', file: 'NexCPP-linux-x64.deb' }
                ].map(item => (
                  <a 
                    key={item.file}
                    href={getAsset(item.file)?.browser_download_url || '#'}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-gray-300 group-hover:text-white">{item.name}</span>
                    <Download size={14} className="text-gray-600 group-hover:text-cyan-500" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
