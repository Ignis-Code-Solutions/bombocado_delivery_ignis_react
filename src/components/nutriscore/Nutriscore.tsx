interface NutriscoreProps {
  valor: string | null
}

const niveis = ['A', 'B', 'C', 'D', 'E']

function Nutriscore({ valor }: NutriscoreProps) {
  const nivelAtual = valor
    ?.trim()
    .toUpperCase()

  if (
    !nivelAtual ||
    !niveis.includes(nivelAtual)
  ) {
    return (
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
          Nutriscore
        </p>

        <span className="inline-flex rounded-full bg-neutral-light px-3 py-1.5 text-xs font-bold text-ink-muted">
          Não informado
        </span>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
        Nutriscore
      </p>

      <div
        className="flex items-center gap-1"
        aria-label={`Nutriscore ${nivelAtual}`}
      >
        {niveis.map((nivel) => {
          const ativo = nivel === nivelAtual

          return (
            <span
              key={nivel}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold transition ${
                ativo
                  ? 'scale-110 bg-primary text-white shadow-sm'
                  : 'bg-neutral-light text-ink-muted'
              }`}
            >
              {nivel}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default Nutriscore