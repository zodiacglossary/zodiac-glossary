import React, { useState } from 'react';

const CommaSeparatedInput = ({ onUpdateList, label }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    // Split the input value by commas and trim whitespace
    const updatedList = inputValue.split(',').map(item => item.trim()).filter(item => item);
    // Call the onUpdateList prop with the new list
    onUpdateList(updatedList);
  };

  return (
    <div>
      <label htmlFor="comma-separated-input">{label}</label>
      <input
        id="comma-separated-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur} // Update the list when the input loses focus
        placeholder="Enter items separated by commas"
      />
    </div>
  );
};

export default CommaSeparatedInput;
