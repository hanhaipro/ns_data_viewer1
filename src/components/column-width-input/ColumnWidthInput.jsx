import { useEffect, useState } from 'react';

export const ColumnWidthInput = ({ colId, width, onUpdate }) => {
  const [tempValue, setTempValue] = useState(width);

  useEffect(() => {
    setTempValue(width);
  }, [width]);

  const handleChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleBlur = () => {
    const val = parseInt(tempValue);
    if (!isNaN(val) && val > 0) {
      onUpdate(colId, val);
    } else {
      setTempValue(width);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
      e.target.blur();
    }
  };

  return (
    <input
      type="number"
      value={tempValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-14 p-1 border border-slate-200 rounded text-right text-[10px] focus:ring-1 ring-indigo-500 outline-none"
    />
  );
};
