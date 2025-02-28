import React, { useEffect, useState } from 'react';
import AppRouter from './router/AppRouter';

function App() {
  const [hasScrollbar, setHasScrollbar] = useState(false);

  // 检测是否需要显示滚动条
  useEffect(() => {
    const checkScrollbar = () => {
      const hasVerticalScrollbar = document.body.scrollHeight > window.innerHeight;
      setHasScrollbar(hasVerticalScrollbar);
    };

    checkScrollbar();
    window.addEventListener('resize', checkScrollbar);
    window.addEventListener('load', checkScrollbar);

    return () => {
      window.removeEventListener('resize', checkScrollbar);
      window.removeEventListener('load', checkScrollbar);
    };
  }, []);

  return (
    <div className={`App ${hasScrollbar ? 'has-scrollbar' : ''}`}>
      <AppRouter />
      
      {/* 化学元素装饰 */}
      {hasScrollbar && (
        <div className="chemical-scrollbar-decoration">
          <div className="chemical-element">Si</div>
          <div className="chemical-element">Al</div>
          <div className="chemical-element">Na</div>
          <div className="chemical-element">O</div>
          <div className="chemical-element">H</div>
        </div>
      )}
    </div>
  );
}

export default App;
