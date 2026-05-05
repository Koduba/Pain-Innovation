import { useEffect } from 'react'

export default function Investors() {
  useEffect(() => {
    window.location.href = '/investors.html'
  }, [])

  return (
    <div>
      <p>Redirecting to investors page...</p>
    </div>
  )
}
