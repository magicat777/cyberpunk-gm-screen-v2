import React, { useEffect } from 'react';
import { usePreferences } from '@/store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { preferences } = usePreferences();
  
  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', preferences.theme);
    
    // Apply font size
    document.documentElement.setAttribute('data-font-size', preferences.fontSize);
    
    // Apply reduced motion
    document.documentElement.setAttribute(
      'data-reduced-motion',
      preferences.reducedMotion.toString()
    );
    
    // Apply theme color to meta tag for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      const colors = {
        cyberpunk: '#00ff41',
        dark: '#1a1a1a',
        light: '#ffffff',
        'high-contrast': '#000000',
      };
      themeColorMeta.setAttribute('content', colors[preferences.theme]);
    }
  }, [preferences.theme, preferences.fontSize, preferences.reducedMotion]);
  
  // Initialize theme on mount
  useEffect(() => {
    // Check system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !preferences.reducedMotion) {
      // Could update the preference here if needed
    }
    
    // Check system preference for color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // You could auto-set theme based on system preferences here
    if (prefersHighContrast && preferences.theme !== 'high-contrast') {
      // Could update to high-contrast theme
    } else if (prefersDark && preferences.theme === 'light') {
      // Could update to dark theme
    }
  }, []);
  
  return <>{children}</>;
};