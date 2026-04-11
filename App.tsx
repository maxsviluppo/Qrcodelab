
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { QRConfig, QRType, DotType, CornerType } from './types';
import QRCodeDisplay from './components/QRCodeDisplay';

const App: React.FC = () => {
  const [activeType, setActiveType] = useState<QRType>('url');
  const [showDevTools, setShowDevTools] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('qr_labs_dark_mode');
    if (saved === null) return true;
    return saved === 'true';
  });

  // Form States
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [vcard, setVcard] = useState({ 
    name: '', org: '', job: '', tel: '', email: '', address: '', url: '', logo: '', note: '' 
  });
  const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [sms, setSms] = useState({ phone: '', message: '' });
  
  // States for other types
  const [fbUrl, setFbUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [mp3Url, setMp3Url] = useState('');
  const [appStoreUrl, setAppStoreUrl] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');

  const [config, setConfig] = useState<QRConfig>({
    value: '',
    size: 512,
    fgColor: '#0047FF',
    bgColor: '#FFFFFF',
    level: 'H',
    includeMargin: true,
    dotType: 'square',
    cornerType: 'square'
  });

  const generateVCardString = (data: typeof vcard) => {
    if (!data.name.trim()) return '';
    const nameParts = data.name.trim().split(' ');
    const lastName = nameParts.length > 1 ? nameParts.pop() : '';
    const firstName = nameParts.join(' ');
    return [
      'BEGIN:VCARD', 'VERSION:3.0', `FN:${data.name.trim()}`, `N:${lastName};${firstName};;;`,
      data.job ? `TITLE:${data.job}` : '', data.org ? `ORG:${data.org}` : '',
      data.tel ? `TEL;TYPE=CELL:${data.tel}` : '', data.email ? `EMAIL:${data.email}` : '',
      data.address ? `ADR;TYPE=WORK:;;${data.address}` : '', data.url ? `URL:${data.url}` : '',
      data.logo ? `PHOTO;VALUE=URI:${data.logo}` : '', data.note ? `NOTE:${data.note}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');
  };

  const computedValue = useMemo(() => {
    switch (activeType) {
      case 'url': return url.trim();
      case 'text': return text.trim();
      case 'wifi': return wifi.ssid ? `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};;` : '';
      case 'email': return email.to ? `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}` : '';
      case 'sms': return sms.phone ? `SMSTO:${sms.phone}:${sms.message}` : '';
      case 'vcard': return generateVCardString(vcard);
      case 'facebook': return fbUrl.trim();
      case 'pdf': return pdfUrl.trim();
      case 'mp3': return mp3Url.trim();
      case 'appstore': return appStoreUrl.trim();
      case 'images': return imgUrl.trim();
      case 'tiktok': return tiktokUrl.trim();
      default: return '';
    }
  }, [activeType, url, text, wifi, email, sms, vcard, fbUrl, pdfUrl, mp3Url, appStoreUrl, imgUrl, tiktokUrl]);

  useEffect(() => {
    setConfig(prev => ({ ...prev, value: computedValue }));
  }, [computedValue]);

  useEffect(() => {
    localStorage.setItem('qr_labs_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);



  const types: { id: QRType; label: string; icon: React.ReactNode }[] = [
    { id: 'url', label: 'Link', icon: <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /> },
    { id: 'facebook', label: 'Facebook', icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
    { id: 'tiktok', label: 'TikTok', icon: <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" /> },
    { id: 'vcard', label: 'Contatto', icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
    { id: 'wifi', label: 'WiFi', icon: <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0" /> },
    { id: 'appstore', label: 'Apps', icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /> },
    { id: 'pdf', label: 'PDF', icon: <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /> },
    { id: 'mp3', label: 'Audio', icon: <path d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" /> },
    { id: 'images', label: 'Gallery', icon: <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { id: 'sms', label: 'SMS', icon: <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> },
    { id: 'email', label: 'E-Mail', icon: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
    { id: 'text', label: 'Testo', icon: <path d="M4 6h16M4 12h16M4 18h7" /> },
  ];

  const dotTypes: { id: DotType; label: string }[] = [
    { id: 'square', label: 'Netto' }, { id: 'rounded', label: 'Round' }, { id: 'dots', label: 'Punti' }, { id: 'classy', label: 'Futur' }
  ];

  const cornerTypes: { id: CornerType; label: string }[] = [
    { id: 'square', label: 'Netto' }, { id: 'extra-rounded', label: 'Soft' }, { id: 'dot', label: 'Dot' }
  ];

  return (
    <div className={`min-h-screen transition-all duration-700 ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans overflow-x-hidden`}>
      <nav className={`fixed top-0 w-full z-50 border-b h-14 transition-colors duration-500 ${darkMode ? 'bg-slate-950/80 border-slate-900' : 'bg-white/80 border-slate-100'} glass-morphism`}>
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => setShowDevTools(false)}>
              <div className="w-7 h-7 bg-blue-informatica rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3" /></svg>
              </div>
              <span className="text-base font-black tracking-tighter uppercase italic">QR<span className="text-blue-informatica">LABS</span></span>
            </div>
            <div className="hidden sm:flex items-center space-x-1 border-l border-slate-800/20 pl-6 h-5">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-md text-blue-informatica bg-blue-500/10">Generator Engine</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowDevTools(!showDevTools)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-300 ${showDevTools ? 'bg-blue-informatica border-blue-400 text-white' : darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}
              title="DevTools Info"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-300 ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400 shadow-lg shadow-amber-400/5' : 'bg-white border-slate-200 text-slate-500 shadow-sm'}`}
              title={darkMode ? "Attiva Light Mode" : "Attiva Dark Mode"}
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="space-y-6">
          {showDevTools ? (
            <div className="max-w-2xl mx-auto py-12 animate-fade-in">
              <div className={`rounded-[2rem] border shadow-2xl p-10 space-y-8 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic">Dev<span className="text-blue-informatica">Tools</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">BY CASTRO MASSIMO</p>
                </div>
                
                <div className={`p-8 rounded-2xl leading-relaxed text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                  Questa App è realizzata da <span className="font-bold text-blue-informatica">DevTools by Castro Massimo</span>.
                  <br /><br />
                  Se hai bisogno di supporto, segnalazioni o di WebApp personalizzate contattaci direttamente per una consulenza tecnica.
                </div>

                <div className="flex justify-center pt-4">
                  <a 
                    href="mailto:castromassimo@gmail.com"
                    className="flex items-center space-x-3 px-8 py-4 bg-blue-informatica text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>E-MAIL CONTATTO</span>
                  </a>
                </div>

                <div className="flex justify-center pt-8 border-t border-slate-800/10">
                   <button 
                    onClick={() => setShowDevTools(false)}
                    className="text-[9px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
                   >
                     CHIUDI PANNELLO
                   </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <section className="relative">
                <div className="flex overflow-x-auto gap-2 pb-2 px-1 no-scrollbar">
                  {types.map((t) => (
                    <button key={t.id} onClick={() => setActiveType(t.id)} className={`flex-none flex items-center h-9 px-4 rounded-xl border transition-all duration-300 ${activeType === t.id ? 'bg-blue-informatica border-blue-400 text-white shadow-md' : darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500 hover:text-slate-900'}`}>
                      <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">{t.icon}</svg>
                      <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
                <div className="w-full lg:col-span-7">
                  <div className={`rounded-[1.5rem] p-6 border shadow-lg ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="space-y-4">
                      {['url', 'facebook', 'tiktok', 'appstore', 'pdf', 'mp3', 'images'].includes(activeType) && (
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 px-1">
                            {activeType === 'url' ? 'Link Web' : activeType.toUpperCase() + ' URL'}
                          </label>
                          <input 
                            type="url" 
                            value={activeType === 'url' ? url : activeType === 'facebook' ? fbUrl : activeType === 'tiktok' ? tiktokUrl : activeType === 'appstore' ? appStoreUrl : activeType === 'pdf' ? pdfUrl : activeType === 'mp3' ? mp3Url : imgUrl}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (activeType === 'url') setUrl(val);
                              else if (activeType === 'facebook') setFbUrl(val);
                              else if (activeType === 'tiktok') setTiktokUrl(val);
                              else if (activeType === 'appstore') setAppStoreUrl(val);
                              else if (activeType === 'pdf') setPdfUrl(val);
                              else if (activeType === 'mp3') setMp3Url(val);
                              else setImgUrl(val);
                            }} 
                            placeholder={`Inserisci link ${activeType}...`}
                            className={`w-full px-4 py-2.5 border rounded-lg outline-none text-sm font-semibold ${darkMode ? 'bg-slate-950/50 border-slate-800 focus:border-blue-informatica text-white' : 'bg-slate-50 border-slate-200 focus:border-blue-informatica text-slate-900'}`} 
                          />
                        </div>
                      )}
                      {activeType === 'vcard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            {key:'name',label:'Nominativo',full:true},
                            {key:'org',label:'Azienda'},
                            {key:'job',label:'Ruolo'},
                            {key:'tel',label:'Tel'},
                            {key:'email',label:'Email'},
                            {key:'url',label:'Sito Web'},
                            {key:'logo',label:'Logo / Foto URL'},
                            {key:'address',label:'Indirizzo',full:true},
                            {key:'note',label:'Note e Info Extra',full:true}
                          ].map(f => (
                            <div key={f.key} className={f.full ? 'md:col-span-2' : ''}>
                              <label className="text-[8px] font-black uppercase tracking-[0.1em] ml-1 opacity-50">{f.label}</label>
                              <input 
                                value={(vcard as any)[f.key]} 
                                onChange={e => setVcard({...vcard, [f.key]: e.target.value})} 
                                placeholder={f.key === 'logo' ? 'https://link-a-immagine.png' : ''}
                                className={`w-full px-3 py-2 border rounded-lg text-xs font-semibold ${darkMode ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`} 
                              />
                            </div>
                          ))}
                          {/* AI Magic Fill Removed for Stability */}
                        </div>
                      )}
                      {activeType === 'wifi' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><label className="text-[8px] font-black opacity-50 ml-1">SSID</label><input value={wifi.ssid} onChange={e=>setWifi({...wifi, ssid:e.target.value})} className={`w-full px-4 py-2 border rounded-lg text-xs font-semibold ${darkMode ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`} /></div>
                          <div className="space-y-1"><label className="text-[8px] font-black opacity-50 ml-1">PASS</label><input type="password" value={wifi.password} onChange={e=>setWifi({...wifi, password:e.target.value})} className={`w-full px-4 py-2 border rounded-lg text-xs font-semibold ${darkMode ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`} /></div>
                        </div>
                      )}
                      {activeType === 'text' && (
                        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Inserisci testo libero..." className={`w-full h-32 px-4 py-2 border rounded-xl outline-none resize-none text-xs font-semibold ${darkMode ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`} />
                      )}
                      {activeType === 'email' && (
                        <div className="space-y-3">
                          <input value={email.to} onChange={e=>setEmail({...email, to:e.target.value})} placeholder="Email" className={`w-full px-4 py-2 border rounded-lg text-xs ${darkMode ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`} />
                          <input value={email.subject} onChange={e=>setEmail({...email, subject:e.target.value})} placeholder="Oggetto" className={`w-full px-4 py-2 border rounded-lg text-xs ${darkMode ? 'bg-slate-950/50 border-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:col-span-5 space-y-6">
                  <div className={`p-6 rounded-[1.5rem] border shadow-lg ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-50'}`}>
                    <QRCodeDisplay config={config} />
                  </div>
                  <div className={`p-5 rounded-[1.5rem] border ${darkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-100'} space-y-4`}>
                    <div className="grid grid-cols-2 gap-2">
                      {dotTypes.map(d => (
                        <button key={d.id} onClick={() => setConfig({...config, dotType: d.id})} className={`py-2 rounded-md text-[8px] font-black uppercase tracking-[0.1em] ${config.dotType === d.id ? 'bg-blue-informatica text-white' : 'bg-slate-800/10 text-slate-500'}`}>{d.label}</button>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/5">
                      <label className="text-[8px] font-black uppercase opacity-60">Engine Color</label>
                      <input type="color" value={config.fgColor} onChange={e=>setConfig({...config, fgColor:e.target.value})} className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="max-w-6xl mx-auto px-8 py-8 border-t border-slate-900/10 flex flex-col sm:flex-row justify-between items-center text-[8px] font-black uppercase tracking-[0.4em] opacity-30">
        <span>STABLE_BUILD_4.0</span>
        <span className="text-blue-informatica">LABS_PRECISION_UNIT</span>
      </footer>
    </div>
  );
};

export default App;
