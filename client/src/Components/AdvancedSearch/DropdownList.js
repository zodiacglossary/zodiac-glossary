import React, { useState, useEffect } from 'react';
import styles from './AdvancedSearch.module.css';
import { IoIosAddCircle, IoIosTrash } from 'react-icons/io';
const DropdownList = ({ options, onChange }) => {
  const [dropdowns, setDropdowns] = useState(['']); // Initialize with one empty dropdown

  const handleChange = (index, value) => {
    const newDropdowns = [...dropdowns];
    newDropdowns[index] = value; // Update the selected value for the specific dropdown
    setDropdowns(newDropdowns);
    onChange(newDropdowns); // Call the onChange prop to update the selected items
  };

  const addDropdown = () => {
    setDropdowns([...dropdowns, '']); // Add a new empty dropdown
  };

  const removeDropdown = (index) => {
    const newDropdowns = dropdowns.filter((_, idx) => idx !== index); // Remove the dropdown at the specified index
    setDropdowns(newDropdowns);
    onChange(newDropdowns); // Update the selected items
  };

  // Effect to call onChange when the component mounts or dropdowns change
  useEffect(() => {
    onChange(dropdowns);
  }, [dropdowns, onChange]);

  return (
    <div>
      {dropdowns.map((value, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            className={styles.delete}
            onClick={() => removeDropdown(index)}
          >
            <IoIosTrash />
          </button>
          <select
            className={styles.input}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
          >
            <option value="">Select an option</option>
            {options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button className={styles.add} onClick={addDropdown}>
        <IoIosAddCircle />
      </button>
    </div>
  );
};

export default DropdownList;
