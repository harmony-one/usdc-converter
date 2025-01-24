import { useState, useEffect } from 'react';
import { ViewState } from '@/types';

export function useViewport(): ViewState {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobileView,
    step,
    setStep
  };
}