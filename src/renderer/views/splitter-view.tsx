/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';

function Splitter({ id, dir, isDragging, label, ...props }: any) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      id={id}
      data-testid={id}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-label={label}
      className={`drag-bar ${dir === 'horizontal' && 'drag-bar--horizontal'} ${(isDragging || isFocused) && 'drag-bar--dragging'} focus-visible:outline-primary focus-visible:outline-offset-2`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
}

export default Splitter;
