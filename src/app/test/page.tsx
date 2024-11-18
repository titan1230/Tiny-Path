"use client"

import React from 'react'
import { usePathname } from 'next/navigation'

const TP = () => {

  const p = usePathname()

  return (
    <div>
      {p}
    </div>
  )
}

export default TP;