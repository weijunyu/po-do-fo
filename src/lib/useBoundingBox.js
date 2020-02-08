import { useRef, useEffect, useState } from "react";

export default function useBoundingBox(dimensions) {
  const ref = useRef();
  const [bbox, setBbox] = useState({});

  const set = () =>
    setBbox(ref && ref.current ? ref.current.getBoundingClientRect() : {});

  useEffect(() => {
    set();
    window.addEventListener("scroll", set);
    return () => window.removeEventListener("scroll", set);
  }, [dimensions]);

  return [bbox, ref];
}
