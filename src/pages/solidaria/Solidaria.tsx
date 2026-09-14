import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BarcodeIcon,
  BasketIcon,
  CheckCircleIcon,
   CoinsIcon,
  CreditCardIcon,
  GlobeIcon,
  HandHeartIcon,
  HeartIcon,
  QrCodeIcon,
  StorefrontIcon,
  XIcon,
} from '@phosphor-icons/react'

type Etapa =
  | 'inicio'
  | 'entidadeCadastro'
  | 'doadorTipo'
  | 'doadorEntidade'
  | 'doadorPagamento'
  | 'doadorConfirmacao'
type TipoDoacao = 'cesta' | 'cash'

interface Entidade {
  id: number
  nome: string
  categoria: string
  descricao: string
  endereco: string
  site: string
}

const entidadesIniciais: Entidade[] = [
  {
    id: 1,
    nome: 'Instituto Mesa Cheia',
    categoria: 'Segurança alimentar',
    descricao: 'Redistribui alimentos arrecadados para famílias em situação de vulnerabilidade na região metropolitana.',
    endereco: 'Rua das Palmeiras, 120 - São Paulo, SP',
    site: 'https://www.institutomesacheia.org.br',
  },
  {
    id: 2,
    nome: 'Casa Acolher',
    categoria: 'Assistência social',
    descricao: 'Oferece abrigo e refeições diárias para pessoas em situação de rua.',
    endereco: 'Av. das Nações, 480 - São Paulo, SP',
    site: 'https://www.casaacolher.org.br',
  },
  {
    id: 3,
    nome: 'Amigos do Bem',
    categoria: 'Combate à fome',
    descricao: 'Atua em comunidades carentes do sertão nordestino com programas de segurança alimentar.',
    endereco: 'Rua do Sertão, 45 - Recife, PE',
    site: 'https://www.amigosdobem.org',
  },
]

interface FormaPagamento {
  id: string
  nome: string
  descricao: string
  Icone: typeof QrCodeIcon
}

const FORMAS_PAGAMENTO: FormaPagamento[] = [
  { id: 'pix', nome: 'Pix', descricao: 'Aprovação imediata, sem taxas.', Icone: QrCodeIcon },
  { id: 'cartao', nome: 'Cartão de crédito', descricao: 'Parcele em até 3x sem juros.', Icone: CreditCardIcon },
  { id: 'boleto', nome: 'Boleto', descricao: 'Compensação em até 2 dias úteis.', Icone: BarcodeIcon },
]

const CHAVE_ENTIDADES = '@BOMbocado:solidaria:entidades'
const CHAVE_DOACOES = '@BOMbocado:solidaria:doacoes'

function carregarEntidades(): Entidade[] {
  try {
    const salvo = localStorage.getItem(CHAVE_ENTIDADES)
    return salvo ? JSON.parse(salvo) : entidadesIniciais
  } catch {
    return entidadesIniciais
  }
}

function carregarDoacoes(): number {
  try {
    const salvo = localStorage.getItem(CHAVE_DOACOES)
    return salvo ? JSON.parse(salvo) : 0
  } catch {
    return 0
  }
}

/**
 * Anima um número inteiro de seu valor atual até `valorFinal`.
 * Usada nos números do bloco de estatísticas (contagem crescente).
 */
function useContagem(valorFinal: number, duracaoMs = 1200): number {
  const [valorAnimado, setValorAnimado] = useState(0)
  const valorAnterior = useRef(0)

  useEffect(() => {
    const inicio = valorAnterior.current
    const diferenca = valorFinal - inicio

    if (diferenca === 0) {
      setValorAnimado(valorFinal)
      return
    }

    const inicioTempo = performance.now()
    let frameId: number

    function animar(agora: number) {
      const progresso = Math.min((agora - inicioTempo) / duracaoMs, 1)
      const valorAtual = Math.round(inicio + diferenca * progresso)
      setValorAnimado(valorAtual)

      if (progresso < 1) {
        frameId = requestAnimationFrame(animar)
      } else {
        valorAnterior.current = valorFinal
      }
    }

    frameId = requestAnimationFrame(animar)
    return () => cancelAnimationFrame(frameId)
  }, [valorFinal, duracaoMs])

  return valorAnimado
}

const CORES_FOGOS = ['#ff6b6b', '#ffd166', '#06d6a0', '#4cc9f0', '#f72585']

interface Particula {
  x: number
  y: number
  cor: string
  atraso: number
}

interface Explosao {
  left: string
  top: string
  atraso: number
  particulas: Particula[]
}

function gerarExplosoes(): Explosao[] {
  const posicoes = [
    { left: '20%', top: '35%' },
    { left: '50%', top: '20%' },
    { left: '80%', top: '40%' },
  ]

  return posicoes.map((posicao, i) => ({
    ...posicao,
    atraso: i * 0.25,
    particulas: Array.from({ length: 16 }, (_, j) => {
      const angulo = (Math.PI * 2 * j) / 16
      const distancia = 60 + Math.random() * 40

      return {
        x: Math.cos(angulo) * distancia,
        y: Math.sin(angulo) * distancia,
        cor: CORES_FOGOS[Math.floor(Math.random() * CORES_FOGOS.length)],
        atraso: i * 0.25,
      }
    }),
  }))
}

function FogosDeArtificio() {
  const [explosoes] = useState<Explosao[]>(gerarExplosoes)

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes fogo-particula {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(0.2); opacity: 0; }
        }
        .fogo-particula {
          animation: fogo-particula 0.9s ease-out forwards;
        }
      `}</style>

      {explosoes.map((explosao, i) => (
        <div key={i} className="absolute" style={{ left: explosao.left, top: explosao.top }}>
          {explosao.particulas.map((particula, j) => (
            <span
              key={j}
              className="fogo-particula absolute h-2 w-2 rounded-full"
              style={
                {
                  backgroundColor: particula.cor,
                  animationDelay: `${particula.atraso}s`,
                  '--x': `${particula.x}px`,
                  '--y': `${particula.y}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface PassoFluxo {
  icone: ReactNode
  titulo: string
  texto: ReactNode
}

/**
 * Linha conectora entre um card e o próximo.
 * Vertical (empilhada) no mobile, horizontal no desktop.
 */
function Conector() {
  return (
    <div className="flex h-6 w-full items-center justify-center lg:h-auto lg:w-10 lg:shrink-0">
      <div className="h-full w-px rounded-full bg-ink-muted/25 lg:h-px lg:w-full" />
    </div>
  )
}

/**
 * Renderiza um ícone personalizado (imagem enviada pela instituição/BOMbocado).
 * Enquanto a imagem não existir no projeto (ainda não foi enviada), cai
 * automaticamente para o ícone padrão informado em `fallback`.
 */
function IconePersonalizado({
  src,
  alt,
  fallback,
  className,
}: {
  src: string
  alt: string
  fallback: ReactNode
  className?: string
}) {
  const [falhouAoCarregar, setFalhouAoCarregar] = useState(false)

  if (falhouAoCarregar) {
    return <>{fallback}</>
  }

  return <img src={src} alt={alt} className={className} onError={() => setFalhouAoCarregar(true)} />
}

function MetadeFluxo({
  rotulo,
  tituloExpandido,
  iconePadrao,
  iconePersonalizadoSrc,
  iconePersonalizadoAlt,
  corFundo,
  corCard,
  passos,
  ativo,
  recolhido,
  onClick,
  imagemSrc,
  imagemAlt,
}: {
  rotulo: string
  tituloExpandido: string
  iconePadrao: ReactNode
  iconePersonalizadoSrc: string
  iconePersonalizadoAlt: string
  corFundo: string
  corCard: string
  passos: PassoFluxo[]
  ativo: boolean
  recolhido: boolean
  onClick: () => void
  imagemSrc: string
  imagemAlt: string
}) {
  const classesLargura = recolhido
    ? 'max-h-0 opacity-0 lg:w-0 lg:flex-none lg:opacity-0'
    : ativo
      ? 'max-h-[2000px] opacity-100 lg:w-full lg:flex-none'
      : 'max-h-[2000px] opacity-100 lg:w-1/2 lg:flex-none'

  return (
    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${classesLargura}`}>
      {!ativo ? (
        <button
          type="button"
          onClick={onClick}
          className={`relative flex aspect-square w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl p-8 text-center text-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover ${corFundo}`}
        >
          {/* Imagem preenchendo o card inteiro */}
          <img
            src={imagemSrc}
            alt={imagemAlt}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-in-out"
          />
          {/* Camada de cor por cima da imagem, ocupando todo o card */}
          <div className={`absolute inset-0 ${corFundo} opacity-80 transition-opacity duration-500 ease-in-out`} />

          <div className="relative z-10 flex flex-col items-center gap-3">
            {/* Espaço reservado para o ícone pequeno personalizado.
                Até o ícone definitivo ser enviado, o ícone padrão é exibido no lugar. */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <IconePersonalizado
                src={iconePersonalizadoSrc}
                alt={iconePersonalizadoAlt}
                fallback={iconePadrao}
                className="h-7 w-7 object-contain"
              />
            </div>
            <h3 className="text-xl font-extrabold sm:text-2xl">{rotulo}</h3>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/85">
              Toque para ver como funciona <ArrowRightIcon size={14} weight="bold" />
            </span>
          </div>
        </button>
      ) : (
        <div className="rounded-2xl border border-outline/10 bg-surface-low/40 p-6 sm:p-8">
          {/* Cabeçalho do card expandido: no mobile, o botão "Voltar" fica
              acima do título, com texto e área de toque maior. No desktop,
              volta a ser um ícone compacto ao lado do título. */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={onClick}
              aria-label="Fechar"
              className="inline-flex items-center gap-2 self-start rounded-full border border-outline/30 px-4 py-2 text-xs font-bold text-ink-soft transition hover:border-primary hover:text-primary sm:hidden"
            >
              <XIcon size={16} weight="bold" /> Fechar
            </button>

            <div className={`relative flex-1 overflow-hidden rounded-2xl px-6 py-4 text-center ${corFundo}`}>
              <h3 className="relative z-10 text-2xl font-extrabold text-white sm:text-3xl">{tituloExpandido}</h3>
            </div>

            <button
              type="button"
              onClick={onClick}
              aria-label="Voltar"
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline/30 text-ink-soft transition hover:border-primary hover:text-primary sm:flex"
            >
              <ArrowLeftIcon size={18} weight="bold" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-0 lg:flex-row lg:items-stretch">
            {passos.map((passo, i) => (
              <div key={passo.titulo} className="flex flex-col lg:flex-1 lg:flex-row lg:items-stretch">
                <div
                  className={`flex flex-1 flex-col items-center justify-start gap-3 rounded-2xl border p-6 text-center sm:p-7 lg:aspect-square ${corCard}`}
                >
                  <div className="flex h-16 w-14 items-center justify-center">{passo.icone}</div>
                  <h4 className="text-base font-extrabold text-ink sm:text-lg">{passo.titulo}</h4>
                  <p className="text-sm leading-6 text-ink-soft">{passo.texto}</p>
                </div>

                {i < passos.length - 1 && <Conector />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function obterEtapasDoacao(tipoDoacao: TipoDoacao | null): { chave: Etapa; rotulo: string }[] {
  const etapas: { chave: Etapa; rotulo: string }[] = [
    { chave: 'doadorTipo', rotulo: 'Tipo' },
    { chave: 'doadorEntidade', rotulo: 'Instituição' },
  ]

  if (tipoDoacao === 'cash') {
    etapas.push({ chave: 'doadorPagamento', rotulo: 'Pagamento' })
  }

  etapas.push({ chave: 'doadorConfirmacao', rotulo: 'Confirmação' })

  return etapas
}

/**
 * Indicador de progresso do fluxo de doação.
 * Mostra ao doador em qual etapa ele está e quais já foram concluídas.
 * O passo "Pagamento" só aparece quando a doação escolhida é em dinheiro.
 */
function IndicadorDeProgresso({
  etapaAtual,
  tipoDoacao,
}: {
  etapaAtual: Etapa
  tipoDoacao: TipoDoacao | null
}) {
  const etapasDoacao = obterEtapasDoacao(tipoDoacao)
  const indiceAtual = etapasDoacao.findIndex((etapa) => etapa.chave === etapaAtual)

  return (
    <ol className="mb-8 flex items-center gap-2 sm:gap-3">
      {etapasDoacao.map((etapa, i) => {
        const concluida = i < indiceAtual
        const ativa = i === indiceAtual

        return (
          <li key={etapa.chave} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-colors ${
                  concluida
                    ? 'bg-primary text-white'
                    : ativa
                      ? 'bg-primary text-white'
                      : 'bg-surface-low text-ink-muted'
                }`}
              >
                {concluida ? <CheckCircleIcon size={16} weight="fill" /> : i + 1}
              </span>
              <span
                className={`hidden text-xs font-bold uppercase tracking-wide sm:inline ${
                  ativa ? 'text-ink' : 'text-ink-muted'
                }`}
              >
                {etapa.rotulo}
              </span>
            </div>

            {i < etapasDoacao.length - 1 && (
              <div className={`h-px flex-1 ${concluida ? 'bg-primary' : 'bg-outline/20'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

function ComoFunciona() {
  const [selecionado, setSelecionado] = useState<'doador' | 'instituicao' | null>(null)

  function alternar(chave: 'doador' | 'instituicao') {
    setSelecionado((atual) => (atual === chave ? null : chave))
  }

  const passosDoador: PassoFluxo[] = [
    {
      icone: (
        <img src="cestacashicone.png" alt="Escolha cesta ou dinheiro" className="h-12 w-12 object-contain" />
      ),
      titulo: 'Escolha cesta ou dinheiro',
      texto: 'O doador decide se quer contribuir com uma cesta de alimentos ou um valor em dinheiro.',
    },
    {
      icone: (
        <img src="visibilidadeicone.png" alt="Escolha e conheça a instituição" className="h-12 w-12 object-contain" />
      ),
      titulo: 'Escolha e conheça a instituição',
      texto: 'Veja o perfil breve de cada instituição cadastrada e escolha para quem você vai querer doar. Aproveita e vai lá conhecer melhor o perfil da instituição e sinta-se convidado também para conhecer novas.',
    },
    {
      icone: (
        <img src="confirmacaoicone.png" alt="Confirme a sua doação" className="h-12 w-12 object-contain" />
      ),
     titulo: 'Confirme a sua doação',
texto: (
  <>
    <p>Esse é um ponto importante, é preciso confirmar para que seja validada no sistema.
    A doação é direcionada direto para o perfil da instituição escolhida.</p>
    <p className="mt-1">Pronto! Fácil demais não é?</p>
  </>
),
    },
  ]

  const passosInstituicao: PassoFluxo[] = [
    {
      icone: (
        <img src="formularioicone.png" alt="Cadastro simples" className="h-12 w-12 object-contain" />
      ),
      titulo: 'Cadastro simples',
      texto: 'Se cadastre através do nosso formulário na plataforma com poucos dados, sem burocracia.',
    },
    {
      icone: (
        <img src="visibilidadeicone.png" alt="Maior visibilidade para sua causa" className="h-12 w-12 object-contain" />
      ),
      titulo: 'Maior visibilidade para sua causa',
      texto: 'Aproveite esse espaço para apresentar sua instituição através das informações dos cadastro. Mais pessoas acompanhando, mais pessoas compartilhando! ',
    },
    {
      icone: (
        <img src="cestaicone.png" alt="Receba as doações" className="h-12 w-12 object-contain" />
      ),
      titulo: 'Receba as doações',
      texto: 'Receba cestas alimentícias e doações em dinheiro direcionadas para o seu perfil.',
    },
  ]

  return (
    <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center text-center">
        <span className="inline-flex rounded-full bg-primary-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Nossa Receita
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">E como funciona?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft sm:whitespace-nowrap sm:text-base">
          Veja como é simples participar da BOMbocado Solidária, seja doando ou recebendo.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <MetadeFluxo
            rotulo="Quero doar"
            tituloExpandido="Para quem quer doar"
            iconePadrao={<HandHeartIcon size={26} weight="bold" className="text-white" />}
            iconePersonalizadoSrc="icone-quero-doar.png"
            iconePersonalizadoAlt="Ícone de quero doar"
            corFundo="bg-primary"
            corCard="border-primary/20 bg-primary-soft/40"
            passos={passosDoador}
            ativo={selecionado === 'doador'}
            recolhido={selecionado === 'instituicao'}
            onClick={() => alternar('doador')}
            imagemSrc="teste2doadora.png"
            imagemAlt="Voluntária organizando doações de alimentos"
          />

          <MetadeFluxo
            rotulo="Quero receber"
            tituloExpandido="Para quem quer receber"
            iconePadrao={<StorefrontIcon size={26} weight="bold" className="text-white" />}
            iconePersonalizadoSrc="icone-quero-receber.png"
            iconePersonalizadoAlt="Ícone de quero receber"
            corFundo="bg-emerald-600"
            corCard="border-emerald-200 bg-emerald-50/60"
            passos={passosInstituicao}
            ativo={selecionado === 'instituicao'}
            recolhido={selecionado === 'doador'}
            onClick={() => alternar('instituicao')}
            imagemSrc="donatario.png"
            imagemAlt="Instituição recebendo doações"
          />
        </div>
      </div>
    </section>
  )
}

function Solidaria() {
  const [etapa, setEtapa] = useState<Etapa>('inicio')
  const [tipoDoacao, setTipoDoacao] = useState<TipoDoacao | null>(null)
  const [entidadeSelecionada, setEntidadeSelecionada] = useState<Entidade | null>(null)
  const [formaPagamento, setFormaPagamento] = useState<string | null>(null)
  const [doacaoConfirmada, setDoacaoConfirmada] = useState(false)
  const [cadastroEnviado, setCadastroEnviado] = useState(false)

  const [entidadesCadastradas, setEntidadesCadastradas] = useState<Entidade[]>(carregarEntidades)
  const [totalDoacoes, setTotalDoacoes] = useState<number>(carregarDoacoes)

  const [nomeInstituicao, setNomeInstituicao] = useState('')
  const [emailInstituicao, setEmailInstituicao] = useState('')
  const [senhaInstituicao, setSenhaInstituicao] = useState('')
  const [categoriaInstituicao, setCategoriaInstituicao] = useState('')
  const [descricaoInstituicao, setDescricaoInstituicao] = useState('')
  const [enderecoInstituicao, setEnderecoInstituicao] = useState('')
  const [siteInstituicao, setSiteInstituicao] = useState('')
  const [erroCadastro, setErroCadastro] = useState('')

  const entidadesAnimadas = useContagem(entidadesCadastradas.length)
  const doacoesAnimadas = useContagem(totalDoacoes)

  useEffect(() => {
    localStorage.setItem(CHAVE_ENTIDADES, JSON.stringify(entidadesCadastradas))
  }, [entidadesCadastradas])

  useEffect(() => {
    localStorage.setItem(CHAVE_DOACOES, JSON.stringify(totalDoacoes))
  }, [totalDoacoes])

  function reiniciar() {
    setEtapa('inicio')
    setTipoDoacao(null)
    setEntidadeSelecionada(null)
    setFormaPagamento(null)
    setDoacaoConfirmada(false)
    setCadastroEnviado(false)
    setNomeInstituicao('')
    setEmailInstituicao('')
    setSenhaInstituicao('')
    setCategoriaInstituicao('')
    setDescricaoInstituicao('')
    setEnderecoInstituicao('')
    setSiteInstituicao('')
    setErroCadastro('')
  }

  function enviarCadastro(e: FormEvent) {
    e.preventDefault()

    const nomeJaExiste = entidadesCadastradas.some(
      (entidade) => entidade.nome.trim().toLowerCase() === nomeInstituicao.trim().toLowerCase(),
    )

    if (nomeJaExiste) {
      setErroCadastro('Já existe uma instituição cadastrada com esse nome.')
      return
    }

    const novaEntidade: Entidade = {
      id: Date.now(),
      nome: nomeInstituicao.trim(),
      categoria: categoriaInstituicao.trim() || 'Instituição parceira',
      descricao: descricaoInstituicao.trim() || 'Instituição cadastrada na plataforma BOMbocado.',
      endereco: enderecoInstituicao.trim(),
      site: siteInstituicao.trim(),
    }

    setEntidadesCadastradas((entidades) => [...entidades, novaEntidade])
    setErroCadastro('')
    setCadastroEnviado(true)
  }

  function confirmarDoacao() {
    setTotalDoacoes((total) => total + 1)
    setDoacaoConfirmada(true)
  }

  return (
    <main className="bg-surface">
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] bg-surface-low shadow-card">
          <div className="grid items-center lg:grid-cols-2">
            <div className="flex flex-col items-center px-6 py-14 text-center sm:px-10 lg:items-start lg:py-20 lg:pl-16 lg:pr-10 lg:text-left">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                BOMbocado Solidária
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.25rem]">
                Conheça a BOMbocado solidária
              </h1>

              <p className="mt-6 max-w-lg text-xl font-bold leading-snug text-ink sm:text-2xl">
                Aqui na <span className="text-primary">BOMbocado</span>, acreditamos que a felicidade começa com o prato cheio.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-ink-soft sm:text-base">
                Foi pensando nisso que nasceu a BOMbocado Solidária: aqui, quem quer doar
                encontra quem precisa receber, simples assim. No final das contas,
                compartilhar é uma forma de nutrir o que realmente importa: esperança,
                cuidado e felicidade.
              </p>

              <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:items-center">
                <a
                  href="#opcoes-iniciais"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-soft px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-card"
                >
                  Faça parte
                </a>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft">
                  <HeartIcon size={18} weight="regular" className="text-primary" />
                  Ajudar nunca foi tão fácil!
                </span>
              </div>
            </div>

            <div className="relative h-64 lg:h-full lg:min-h-[420px]">
              <img
                src="teste.jpg"
                alt="Doação de alimentos sendo preparada"
                className="h-full w-full object-cover"
              />

              {/* Degradê que dissolve a borda da imagem no fundo da seção */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface-low to-transparent lg:hidden" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-low to-transparent lg:w-40" />
            </div>
          </div>
        </div>
      </section>

      {etapa === 'inicio' && <ComoFunciona />}

      {etapa === 'inicio' && (
        <section id="opcoes-iniciais" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setEtapa('doadorTipo')}
              className="rounded-2xl bg-primary p-8 text-left text-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <HandHeartIcon size={26} weight="bold" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold text-white">Quero doar</h2>
              <p className="mt-3 text-sm leading-6 text-white/85">
                Escolha entre doar uma cesta de alimentos ou um valor em dinheiro para uma instituição.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                Começar <ArrowRightIcon size={17} weight="bold" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setEtapa('entidadeCadastro')}
              className="rounded-2xl bg-white p-8 text-left shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft">
                <StorefrontIcon size={26} weight="bold" className="text-primary" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold">Sou uma instituição</h2>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                Cadastre sua instituição para receber doações através do BOMbocado.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                Fazer cadastro <ArrowRightIcon size={17} weight="bold" />
              </span>
            </button>
          </div>
        </section>
      )}

      {etapa === 'entidadeCadastro' && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-card sm:p-8">
            <button
              type="button"
              onClick={reiniciar}
              className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition hover:text-primary"
            >
              <ArrowLeftIcon size={16} weight="bold" /> Voltar
            </button>

            {!cadastroEnviado ? (
              <>
                <h2 className="mt-5 text-2xl font-extrabold">Cadastro da instituição</h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Preencha os dados abaixo para cadastrar sua instituição e passar a receber doações.
                </p>

                <form onSubmit={enviarCadastro} className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                      Dados da instituição
                    </h3>

                    <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Nome da instituição
                    </label>
                    <input
                      type="text"
                      required
                      value={nomeInstituicao}
                      onChange={(e) => {
                        setNomeInstituicao(e.target.value)
                        setErroCadastro('')
                      }}
                      className="mt-1 w-full rounded-xl border border-outline/40 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                    {erroCadastro && <p className="mt-1 text-xs font-semibold text-red-600">{erroCadastro}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Área de atuação
                    </label>
                    <input
                      type="text"
                      placeholder="Ex.: Segurança alimentar"
                      value={categoriaInstituicao}
                      onChange={(e) => setCategoriaInstituicao(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-outline/40 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Sobre
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Conte brevemente o que a instituição faz."
                      value={descricaoInstituicao}
                      onChange={(e) => setDescricaoInstituicao(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-outline/40 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Endereço
                    </label>
                    <input
                      type="text"
                      placeholder="Rua, número - cidade, estado"
                      value={enderecoInstituicao}
                      onChange={(e) => setEnderecoInstituicao(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-outline/40 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Site (opcional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://"
                      value={siteInstituicao}
                      onChange={(e) => setSiteInstituicao(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-outline/40 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  </div>

                  <div className="space-y-4 border-t border-outline/15 pt-6">
                    <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                      Acesso
                    </h3>

                    <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">E-mail</label>
                    <input
                      type="email"
                      required
                      value={emailInstituicao}
                      onChange={(e) => setEmailInstituicao(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-outline/40 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">Senha</label>
                    <input
                      type="password"
                      required
                      value={senhaInstituicao}
                      onChange={(e) => setSenhaInstituicao(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-outline/40 px-4 py-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
                  >
                    Cadastrar instituição
                  </button>
                </form>
              </>
            ) : (
              <div className="mt-8 flex flex-col items-center text-center">
                <CheckCircleIcon size={48} weight="fill" className="text-primary" />
                <h2 className="mt-4 text-2xl font-extrabold">Cadastro realizado</h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Sua instituição foi cadastrada e já pode receber doações pelo BOMbocado.
                </p>
                <button
                  type="button"
                  onClick={reiniciar}
                  className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Voltar ao início
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {etapa === 'doadorTipo' && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={reiniciar}
              className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition hover:text-primary"
            >
              <ArrowLeftIcon size={16} weight="bold" /> Voltar
            </button>

            <div className="mt-5">
              <IndicadorDeProgresso etapaAtual="doadorTipo" tipoDoacao={tipoDoacao} />
            </div>

            <h2 className="text-2xl font-extrabold sm:text-3xl">O que você quer doar?</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setTipoDoacao('cesta')}
                className={`rounded-2xl border-2 bg-white p-6 text-left shadow-card transition ${
                  tipoDoacao === 'cesta' ? 'border-primary' : 'border-transparent'
                }`}
              >
                <BasketIcon size={28} weight="bold" className="text-primary" />
                <h3 className="mt-4 text-lg font-extrabold">Cesta de alimentos</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">Doe uma cesta de alimentos para a instituição escolhida.</p>
              </button>

              <button
                type="button"
                onClick={() => setTipoDoacao('cash')}
                className={`rounded-2xl border-2 bg-white p-6 text-left shadow-card transition ${
                  tipoDoacao === 'cash' ? 'border-primary' : 'border-transparent'
                }`}
              >
                <CoinsIcon size={28} weight="bold" className="text-primary" />
                <h3 className="mt-4 text-lg font-extrabold">Doação em dinheiro</h3>
                <p className="mt-2 text-sm leading-6 text-ink-soft">Doe um valor em dinheiro para a instituição escolhida.</p>
              </button>
            </div>

            <button
              type="button"
              disabled={!tipoDoacao}
              onClick={() => setEtapa('doadorEntidade')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar <ArrowRightIcon size={17} weight="bold" />
            </button>
          </div>
        </section>
      )}

      {etapa === 'doadorEntidade' && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => setEtapa('doadorTipo')}
              className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition hover:text-primary"
            >
              <ArrowLeftIcon size={16} weight="bold" /> Voltar
            </button>

            <div className="mt-5">
              <IndicadorDeProgresso etapaAtual="doadorEntidade" tipoDoacao={tipoDoacao} />
            </div>

            <h2 className="text-2xl font-extrabold sm:text-3xl">Escolha a instituição</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">Selecione a instituição que vai receber sua doação.</p>

            <div className="mt-6 space-y-4">
              {entidadesCadastradas.map((entidade) => (
                <div
                  key={entidade.id}
                  className={`rounded-2xl border-2 bg-white p-6 shadow-card transition ${
                    entidadeSelecionada?.id === entidade.id ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setEntidadeSelecionada(entidade)}
                    className="w-full text-left"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">{entidade.categoria}</p>
                    <h3 className="mt-1 text-lg font-extrabold">{entidade.nome}</h3>
                  </button>

                  {entidadeSelecionada?.id === entidade.id && (
                    <div className="mt-4 border-t border-outline/20 pt-4">
                      <p className="text-sm leading-6 text-ink-soft">{entidade.descricao}</p>
                      {entidade.endereco && (
                        <p className="mt-2 text-xs font-semibold text-ink-muted">{entidade.endereco}</p>
                      )}
                      {entidade.site && (
                        <a
                          href={entidade.site}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary"
                        >
                          <GlobeIcon size={16} weight="bold" /> Visitar site da instituição
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={!entidadeSelecionada}
              onClick={() => setEtapa(tipoDoacao === 'cash' ? 'doadorPagamento' : 'doadorConfirmacao')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar <ArrowRightIcon size={17} weight="bold" />
            </button>
          </div>
        </section>
      )}

      {etapa === 'doadorPagamento' && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => setEtapa('doadorEntidade')}
              className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition hover:text-primary"
            >
              <ArrowLeftIcon size={16} weight="bold" /> Voltar
            </button>

            <div className="mt-5">
              <IndicadorDeProgresso etapaAtual="doadorPagamento" tipoDoacao={tipoDoacao} />
            </div>

            <h2 className="text-2xl font-extrabold sm:text-3xl">Escolha a forma de pagamento</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              Simulação apenas para fins acadêmicos — nenhuma cobrança real é feita.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {FORMAS_PAGAMENTO.map((forma) => (
                <button
                  key={forma.id}
                  type="button"
                  onClick={() => setFormaPagamento(forma.id)}
                  className={`rounded-2xl border-2 bg-white p-6 text-left shadow-card transition ${
                    formaPagamento === forma.id ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <forma.Icone size={28} weight="bold" className="text-primary" />
                  <h3 className="mt-4 text-lg font-extrabold">{forma.nome}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{forma.descricao}</p>
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!formaPagamento}
              onClick={() => setEtapa('doadorConfirmacao')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar <ArrowRightIcon size={17} weight="bold" />
            </button>
          </div>
        </section>
      )}

      {etapa === 'doadorConfirmacao' && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-xl overflow-hidden rounded-2xl bg-white p-6 shadow-card sm:p-8">
            {doacaoConfirmada && <FogosDeArtificio />}
            {!doacaoConfirmada ? (
              <>
                <button
                  type="button"
                  onClick={() => setEtapa(tipoDoacao === 'cash' ? 'doadorPagamento' : 'doadorEntidade')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition hover:text-primary"
                >
                  <ArrowLeftIcon size={16} weight="bold" /> Voltar
                </button>

                <div className="mt-5">
                  <IndicadorDeProgresso etapaAtual="doadorConfirmacao" tipoDoacao={tipoDoacao} />
                </div>

                <h2 className="text-2xl font-extrabold">Confirmar doação</h2>

                <div className="mt-6 space-y-3 rounded-xl bg-surface-low px-5 py-4 text-sm text-ink-soft">
                  <p>
                    <span className="font-bold text-ink">Tipo de doação: </span>
                    {tipoDoacao === 'cesta' ? 'Cesta de alimentos' : 'Dinheiro'}
                  </p>
                  <p>
                    <span className="font-bold text-ink">Instituição: </span>
                    {entidadeSelecionada?.nome}
                  </p>
                  {tipoDoacao === 'cash' && formaPagamento && (
                    <p>
                      <span className="font-bold text-ink">Forma de pagamento: </span>
                      {FORMAS_PAGAMENTO.find((forma) => forma.id === formaPagamento)?.nome}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={confirmarDoacao}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Confirmar doação
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-center">
                <CheckCircleIcon size={48} weight="fill" className="text-primary" />
                <h2 className="mt-4 text-2xl font-extrabold">Doação confirmada</h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  Sua doação de {tipoDoacao === 'cesta' ? 'cesta de alimentos' : 'dinheiro'} para{' '}
                  {entidadeSelecionada?.nome} foi registrada
                  {tipoDoacao === 'cash' && formaPagamento
                    ? ` via ${FORMAS_PAGAMENTO.find((forma) => forma.id === formaPagamento)?.nome}.`
                    : '.'}
                </p>
                <button
                  type="button"
                  onClick={reiniciar}
                  className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  Voltar ao início
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] bg-surface-low shadow-card">
          <div className="grid items-center lg:grid-cols-2">
            <div className="flex flex-col items-center gap-5 px-6 py-14 text-center sm:px-10 lg:py-20 lg:px-16">
              <p className="font-mukta text-2xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2.25rem]">
                <span className="block">Juntos já ajudamos</span>
                <span className="block"><span className="text-primary">{entidadesAnimadas}</span> instituições e</span>
                <span className="block">realizamos <span className="text-primary">{doacoesAnimadas}</span> doações</span>
              </p>
              <p className="font-mukta text-base font-semibold uppercase tracking-wide text-ink-soft sm:text-lg">
                através da BOMbocado Solidária
              </p>
              <p className="font-mukta mt-2 text-xl font-bold leading-snug text-ink sm:text-2xl">
                Alimente essa ideia e faça parte da nossa família também!
              </p>
            </div>

            <div className="relative h-64 lg:h-full lg:min-h-[420px]">
              {/* Substitua pela imagem definitiva do bloco de estatísticas */}
              <img
                src="criancabombocado.jpg"
                alt="Pessoas participando da ação solidária BOMbocado"
                className="h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface-low to-transparent lg:hidden" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-low to-transparent lg:w-40" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Solidaria
