import { MinusIcon, PlusIcon, TrashIcon, LeafIcon } from "@phosphor-icons/react"
import { useContext } from "react"
import { CartContext, type ItemCarrinho } from "../../../contexts/CartContext"

interface CardCartProps {
    item: ItemCarrinho
}

function CardCart({ item }: CardCartProps) {
    const { adicionarItem, removerItem, removerProduto } = useContext(CartContext)

    const preco = Number(item.preco)

    return (
        <div className="flex gap-4 bg-white rounded-3xl p-4 border border-[#F1E1D3]">
            {/* Imagem do Produto */}
            <div className="w-28 h-28 shrink-0 bg-[#FFF3E8] rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                    src={item.imagem ?? undefined}
                    className="max-h-full max-w-full object-contain"
                    alt={item.nome}
                />
            </div>

            {/* Informações do Produto */}
            <div className="grow flex flex-col justify-between min-w-0">
                <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A7A6C] mb-1">
                        <LeafIcon size={13} weight="fill" className="text-[#4B8B5F]" />
                        <span>{item.categoria?.nome}</span>
                    </div>
                    <h3 className="font-semibold text-[#2E241C] mb-1 truncate">
                        {item.nome}
                    </h3>
                    <p className="text-xl font-bold text-[#EA4B22]">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(preco)}
                    </p>
                </div>

                {/* Controles de Quantidade */}
                <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center rounded-full border border-[#EA4B22]/30 bg-[#FFF3E8]">
                        <button
                            onClick={() => removerItem(item.id)}
                            className="p-1.5 pl-2.5 text-[#EA4B22] hover:opacity-70 transition-opacity"
                            aria-label="Diminuir quantidade"
                        >
                            <MinusIcon size={16} weight="bold" />
                        </button>

                        <span className="px-2.5 font-semibold text-[#2E241C] min-w-[1.75rem] text-center text-sm">
                            {item.quantidade}
                        </span>

                        <button
                            onClick={() => adicionarItem(item.id)}
                            className="p-1.5 pr-2.5 text-[#EA4B22] hover:opacity-70 transition-opacity"
                            aria-label="Aumentar quantidade"
                        >
                            <PlusIcon size={16} weight="bold" />
                        </button>
                    </div>

                    <button
                        onClick={() => removerProduto(item.id)}
                        className="p-1.5 text-[#B8A796] hover:text-[#EA4B22] rounded-lg transition-colors"
                        title="Remover produto"
                    >
                        <TrashIcon size={18} />
                    </button>
                </div>
            </div>

            {/* Subtotal */}
            <div className="flex flex-col items-end justify-end shrink-0">
                <p className="text-lg font-bold text-[#2E241C]">
                    {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(preco * item.quantidade)}
                </p>
            </div>
        </div>
    )
}

export default CardCart