import React from 'react'

interface Prop {
  text_type : string;
  size : number;
}

function Loader({ text_type, size } : Prop) {
  return (
    <div className={`spinner-border text-${text_type}`} style={{scale:`${size}%`}}>
    {` `}
    </div>
  );
}

Loader.defaultProps = {
  text_type : 'warning',
  size : 100
}

export default Loader