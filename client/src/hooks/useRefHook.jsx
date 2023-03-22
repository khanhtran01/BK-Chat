// useRefHook.js

import { useRef } from 'react';

const useRefHook = () => {
  const ref = useRef(null);
  return ref;
};

export default useRefHook;
