import React from 'react';

const QuickStartChecklist = ({ steps }) => {
  return (
    <ul className="checklist mt-4">
      {steps.map((step, index) => (
        <li key={index} className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>{step}</span>
        </li>
      ))}
    </ul>
  );
};

export default QuickStartChecklist;