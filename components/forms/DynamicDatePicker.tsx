'use client';

import React from 'react';
// Correcting to DatePickerProps based on the latest build error
import DatePicker, { DatePickerProps } from 'react-datepicker';

// ForwardRef is important if the DatePicker component itself uses refs internally
// or if you need to pass a ref to it from SimpleContactForm.
// For now, a simple wrapper. If ref issues arise, this can be augmented.
const DynamicDatePicker: React.FC<DatePickerProps> = (props) => {
  // The 'typeof DatePicker' for the ref might need to be 'HTMLInputElement' or 'ReactDatePicker'
  // depending on what kind of ref the DatePicker component actually exposes.
  // For now, this is a basic forwardRef. If DatePicker doesn't support ref forwarding in this way or expects a specific type,
  // this might need adjustment or the ref forwarding might be removed if not strictly needed by the parent.
  // However, DatePicker internally has an input, so an HTMLInputElement ref might be what it passes up.
  // Let's try without explicit ref type for DatePicker first or assume DatePicker handles it.

  // If DatePicker is a class component, ref will be an instance of it.
  // If it's a functional component using forwardRef, it will be the underlying element (e.g., input).
  // The DatePicker from 'react-datepicker' might actually be a class component.
  
  // Let's simplify and not use forwardRef initially unless proven necessary, 
  // as the original code in SimpleContactForm does not seem to pass a ref TO DatePicker itself,
  // but rather gets a ref to an HTML element it *thinks* is the DatePicker input.
  
  // Re-simplifying to a basic functional component wrapper:
  return <DatePicker {...props} />;
};

DynamicDatePicker.displayName = 'DynamicDatePicker';

export default DynamicDatePicker; 