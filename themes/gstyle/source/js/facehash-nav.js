// Facehash avatar navigation component
// Uses bundled Facehash + React from facehash.bundle.js

(function() {
  console.log('facehash-nav.js loaded');

  const faceNames = ['F', 'A', 'B', 'C', 'D', 'E', 'H', 'K'];

  // colors must be array of hex strings - bright colors for visual impact
  const colorPalettes = [
    ['#60a5fa', '#3b82f6'],
    ['#a78bfa', '#8b5cf6'],
    ['#34d399', '#10b981'],
    ['#fb923c', '#f97316'],
    ['#f87171', '#ef4444'],
    ['#22d3ee', '#06b6d4'],
    ['#f472b6', '#ec4899'],
    ['#fbbf24', '#f59e0b'],
  ];

  // Spinner component for "thinker" mouth - half border spinner
  function Spinner() {
    return React.createElement('div', {
      style: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        border: '2px solid transparent',
        borderTop: '2px solid #1f2937',
        borderRight: '2px solid #1f2937',
        animation: 'spin 0.8s linear infinite'
      }
    });
  }

  function initFacehash() {
    console.log('initFacehash called');

    const container = document.getElementById('facehash-avatar-container');
    if (!container) {
      console.error('facehash-avatar-container not found');
      return;
    }

    // Wait for globals to be available
    if (!window.Facehash || !window.React || !window.ReactDOM) {
      console.log('Facehash bundle not ready, waiting...');
      setTimeout(initFacehash, 100);
      return;
    }

    const { Facehash, React, ReactDOM } = window;
    console.log('Bundle globals available:', { Facehash, React, ReactDOM });

    function FacehashAvatar() {
      const [index, setIndex] = React.useState(0);

      const handleClick = function() {
        console.log('Click detected, current index:', index);
        setIndex((prev) => (prev + 1) % faceNames.length);
      };

      const palette = colorPalettes[index % colorPalettes.length];
      const name = faceNames[index];
      var showThinker = Math.random() < 0.2;

      console.log('Rendering Facehash with:', { name, colors: palette, size: 40 });

      return React.createElement('div', {
        onClick: handleClick,
        style: { cursor: 'pointer', display: 'inline-block' }
      }, React.createElement(Facehash, {
        name: name,
        size: 40,
        colors: palette,
        variant: index % 2 === 0 ? 'gradient' : 'solid',
        intensity3d: 'dramatic',
        enableBlink: true,
        showInitial: !showThinker,
        onRenderMouth: showThinker ? function() { return React.createElement(Spinner); } : undefined
      }));
    }

    console.log('Creating root and rendering...');
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(FacehashAvatar));
    console.log('Render complete');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFacehash);
  } else {
    initFacehash();
  }
})();
