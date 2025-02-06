import React from 'react'

const Thead = (props) => {

  const content = (
    <th className={`mx-auto text-start px-8 py-1 sm:py-3 bg-[#F1F1F1] text-xs font-normal text-gray-500 uppercase tracking-wider` }>
      {props.thName}
    </th>
  )

  return content
}

export default Thead