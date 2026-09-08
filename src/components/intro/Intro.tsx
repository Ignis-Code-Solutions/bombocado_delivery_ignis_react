import { useEffect } from 'react'

interface IntroProps {
  onComplete: () => void
}

function Intro({
  onComplete,
}: IntroProps) {
  useEffect(() => {
    const prefereMenosAnimacao =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    const tempo =
      prefereMenosAnimacao
        ? 300
        : 3200

    const timer =
      window.setTimeout(
        onComplete,
        tempo,
      )

    return () => {
      window.clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <main
      className="bombocado-intro fixed inset-0 z-9999 flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4"
      aria-label="Apresentação BOMbocado"
    >
      <div className="intro-circle intro-circle-one" />
      <div className="intro-circle intro-circle-two" />
      <div className="intro-circle intro-circle-three" />

      <section className="relative z-10 flex flex-col items-center text-center">

        {/* Logo */}
        <div className="intro-leaf">
        <span className="intro-bom font-headline text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
            BOM
        </span>

        <span className="intro-bocado font-headline text-4xl font-extrabold text-primary-soft sm:text-5xl lg:text-6xl">
            bocado
        </span>
        </div>

        {/* Linha */}
        <div className="intro-line mt-6 h-0.5 bg-white/60" />

        {/* Slogan */}
        <p className="intro-slogan mt-5 max-w-md text-sm font-medium leading-6 text-white/90 sm:text-base">
          Bom para quem vende.
          <br />
          Bom para quem compra.
        </p>

        {/* Loading */}
        <div className="intro-loading mt-8 flex gap-2">
          <span />
          <span />
          <span />
        </div>
      </section>

      <p className="intro-footer absolute bottom-6 left-0 right-0 text-center text-xs font-medium tracking-[0.16em] text-white/60">
        DELIVERY DE ALIMENTOS
      </p>
    </main>
  )
}

export default Intro