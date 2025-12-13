import React from 'react'
import HeaderLogo from '@/components/website/header/Logo'

const Loading = () => {
  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-300 dark:bg-slate-900/90'>
      <div className='flex flex-col items-center gap-6'>
        {/* Logo Animation */}
        <div className='animate-pulse scale-110 duration-1000'>
          <HeaderLogo />
        </div>
        
        {/* Custom Spinner */}
        <div className='relative h-12 w-12'>
          {/* Background Ring */}
          <div className='absolute inset-0 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700' />
          {/* Active Ring */}
          <div className='absolute inset-0 animate-spin rounded-full border-t-4 border-global-primary border-t-transparent' />
        </div>
      </div>
    </div>
  )
}

export default Loading
