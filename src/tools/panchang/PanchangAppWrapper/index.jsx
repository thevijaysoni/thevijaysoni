import React, { useEffect } from 'react';
import PanchangApp from '../PanchangApp';

export default function PanchangAppWrapper() {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Kalachakra - Hindu Panchang Calendar";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  return <PanchangApp />;
}
