import React, { createContext, useContext, useState, useEffect } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [muted, setMuted] = useState(() => {
    const stored = localStorage.getItem('muted');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('muted', muted);
  }, [muted]);

  return (
    <SoundContext.Provider value={{ muted, setMuted }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundControl = () => useContext(SoundContext);
