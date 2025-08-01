// src/components/SidebarContainer.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SidebarContent from './SidebarContent';

export default function SidebarContainer() {
  const width = 320;
  const peek = 16;
  const [expanded, setExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const collapse = () => {
    if (!profileOpen) setExpanded(false);
  };

  return (
    <motion.div
      className="fixed top-0 left-0 h-full z-50 shadow-lg"
      animate={{ x: expanded ? 0 : -width + peek }}
      transition={{ type: 'tween', duration: 0.3 }}
      style={{ width, overflow: 'hidden' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={collapse}
    >
      <SidebarContent onProfileToggle={open => setProfileOpen(open)} profileOpen={profileOpen} />
    </motion.div>
  );
}