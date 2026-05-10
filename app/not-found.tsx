import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-bold text-navy mb-4">404</p>
      <h1 className="text-2xl font-bold text-navy mb-2">Stran ni najdena</h1>
      <p className="text-warm-muted mb-8">
        Strani, ki jo iščeš, ni mogoče najti. Morda je bila odstranjena ali pa je bila povezava napačna.
      </p>
      <Link
        href="/"
        className="inline-block bg-terra text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
      >
        Nazaj na domačo stran
      </Link>
    </div>
  )
}
