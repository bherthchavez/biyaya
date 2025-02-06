import React from 'react'

const Tbody = (props) => {
    const content = (
        <tbody  className="divide-y divide-gray-200">{props.tbName}</tbody>
    )
  return content
}

export default Tbody