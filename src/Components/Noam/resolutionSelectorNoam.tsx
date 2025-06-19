import React from 'react'

interface ResolutionSelectorProps {
  onSelect: (resolution: number) => void
  onCancel: () => void
}

const resolutions = [50, 100, 200, 300]

export const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({ onSelect, onCancel }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 6,
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
      }}
    >
      <h4>בחר רזולוציה לטעינת הנתונים</h4>
      {resolutions.map((r) => (
        <button
          key={r}
          style={{ margin: '5px' }}
          onClick={() => onSelect(r)}
        >
          {r} x {r}
        </button>
      ))}
      <button style={{ marginTop: 10, color: 'red' }} onClick={onCancel}>
        ביטול
      </button>
    </div>
  )
}
