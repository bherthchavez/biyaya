import React from 'react'

const Image = ({ data, size , rounded }) => {

  return (
    <>
          {/* <img src={`data:image/jpeg;base64,${data}`} alt="uploaded" className={` ${size} ${rounded} border border-slate-300  object-cover`} /> */}
          <img src={data} alt="uploaded" className={` ${size} ${rounded} border border-slate-300  object-cover`} />

    </>
  )
}

export default Image



