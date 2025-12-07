import React from 'react'
import Create_company from './ui/create_company'
import Create_user from './ui/create_user'

function page() {
  return (
    <div className='min-h-screen min-w-min bg-amber-300'>
      <Create_company/>
      <Create_user/>
    </div>
  )
}

export default page