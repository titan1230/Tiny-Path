import { auth } from '@/auth'
import React from 'react'

const DashboardPage = async () => {

  const session = await auth();

  return (
    <div>{session?.user.username}</div>
  )
}

export default DashboardPage