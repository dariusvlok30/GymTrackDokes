'use client'

import { useState, useEffect } from 'react'

export function useTheme(): 'dark' | 'light' {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const get = () =>
      (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark'

    setTheme(get())

    const observer = new MutationObserver(() => setTheme(get()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  return theme
}
