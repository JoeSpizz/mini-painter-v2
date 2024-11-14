// src/components/CollapsiblePanel.js
import React, { useState } from 'react';

function CollapsiblePanel({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-panel mb-2 p-2 border border-gray-300 rounded shadow">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer font-semibold">
        {title} {isOpen ? '▼' : '▲'}
      </div>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default CollapsiblePanel;
