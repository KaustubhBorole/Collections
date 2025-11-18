import React, { useEffect } from "react";

export function IndeterminateCheckbox({ 
  indeterminate, 
  ...rest 
}: React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }) {
  const ref = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return <input ref={ref} type="checkbox" className="h-4 w-4" {...rest} />;
}
