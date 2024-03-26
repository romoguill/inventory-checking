'use client';

import { useEffect, useState } from 'react';

const useDebouncedSearch = (input: string) => {
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounced(input);
    }, 300);

    return () => clearTimeout(timerId);
  }, [input]);

  return debounced;
};

export default useDebouncedSearch;
