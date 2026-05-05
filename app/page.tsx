import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    window.location.href = '/landing.html'
  }, [])

  return (
    <div>
      <p>Redirecting to landing page...</p>
    </div>
  )
}
