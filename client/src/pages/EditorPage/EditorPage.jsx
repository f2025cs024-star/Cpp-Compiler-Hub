import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '../../components/Editor/Editor';
import TerminalComponent from '../../components/Terminal/Terminal';
import { Play, Save, Share2, Code2, Settings } from 'lucide-react';
import useSocket from '../../hooks/useSocket';
import { AuthContext } from '../../context/AuthContext';

const EditorPage = () => {
  const { slug: slugParam } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const templates = {
    'Hello World': `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
    'Interactive Input': `#include <iostream>\n#include <string>\n\nint main() {\n    std::string name;\n    std::cout << "Enter your name: ";\n    std::getline(std::cin, name);\n    std::cout << "Hello, " << name << "!" << std::endl;\n    return 0;\n}`,
    'Linked List': `#include <iostream>\n\nstruct Node {\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};\n\nint main() {\n    Node* head = new Node(1);\n    head->next = new Node(2);\n    std::cout << "Linked List Head: " << head->data << std::endl;\n    return 0;\n}`,
    'Sorting (Bubble)': `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nvoid bubbleSort(std::vector<int>& arr) {\n    for(size_t i = 0; i < arr.size(); i++) {\n        for(size_t j = 0; j < arr.size() - i - 1; j++) {\n            if(arr[j] > arr[j+1]) std::swap(arr[j], arr[j+1]);\n        }\n    }\n}\n\nint main() {\n    std::vector<int> data = {5, 2, 8, 12, 1};\n    bubbleSort(data);\n    for(int x : data) std::cout << x << " ";\n    return 0;\n}`
  };

  const [code, setCode] = useState(templates['Interactive Input']);
  const [title, setTitle] = useState('main.cpp');
  const [programId, setProgramId] = useState(null);
  const [savedSlug, setSavedSlug] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (!slugParam) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`/api/programs/${slugParam}`);
        if (cancelled) return;
        const p = res.data;
        setCode(p.code || '');
        setTitle(p.title || 'main.cpp');
        setProgramId(p.id);
        setSavedSlug(p.slug);
      } catch (err) {
        console.error(err);
        if (!cancelled) setSaveStatus('Could not load program');
      }
    })();
    return () => { cancelled = true; };
  }, [slugParam]);

  const handleRun = () => {
    if (socket) {
      socket.emit('run', { code, language: 'cpp', slug: savedSlug || undefined });
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSaveStatus('Saving…');
    try {
      if (programId) {
        await axios.put(`/api/programs/${programId}`, {
          title: title.trim() || 'main.cpp',
          code,
          is_public: false
        });
        setSaveStatus('Saved');
      } else {
        const res = await axios.post('/api/programs', {
          title: title.trim() || 'main.cpp',
          code,
          language: 'cpp',
          is_public: false
        });
        setProgramId(res.data.id);
        setSavedSlug(res.data.slug);
        navigate(`/code/${res.data.slug}`, { replace: true });
        setSaveStatus('Saved');
      }
      setTimeout(() => setSaveStatus(''), 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus(err.response?.data?.msg || 'Save failed — try logging in again');
    }
  };

  const handleShare = async () => {
    if (!savedSlug) {
      setSaveStatus('Save once to get a share link');
      setTimeout(() => setSaveStatus(''), 2500);
      return;
    }
    const url = `${window.location.origin}/code/${savedSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setSaveStatus('Link copied');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch {
      setSaveStatus(url);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)', padding: '0 20px', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="glass" style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
              <Code2 size={20} />
              <input
                className="nex-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Program title"
                style={{ padding: '6px 12px', width: 'min(220px, 40vw)', fontSize: '0.9rem', fontWeight: 700 }}
              />
            </div>
            <select
              className="nex-input"
              style={{ padding: '4px 10px', width: 'auto', fontSize: '0.8rem' }}
              onChange={(e) => setCode(templates[e.target.value])}
              defaultValue="Interactive Input"
            >
              {Object.keys(templates).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="nex-input" style={{ padding: '4px 10px', width: 'auto', fontSize: '0.8rem' }}>
              <option>C++ 17</option>
              <option>C++ 20</option>
            </select>
            {saveStatus ? <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{saveStatus}</span> : null}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button type="button" className="btn-secondary" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleSave} title="Save to your account">
              <Save size={18} /> Save
            </button>
            <button type="button" className="btn-secondary" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleShare} title="Copy link to this program">
              <Share2 size={18} /> Share
            </button>
            <button type="button" className="btn-primary" onClick={handleRun} style={{ padding: '8px 25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={18} fill="currentColor" /> Run
            </button>
          </div>
        </div>

        <CodeEditor code={code} setCode={setCode} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="glass" style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>OUTPUT</span>
          </div>
          <Settings size={18} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
        </div>
        <div style={{ flex: 1 }}>
          <TerminalComponent socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
