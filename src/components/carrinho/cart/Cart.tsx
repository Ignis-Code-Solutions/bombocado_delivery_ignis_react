import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCartIcon, LeafIcon } from '@phosphor-icons/react'
import { CartContext } from '../../../contexts/CartContext'
import CardCart from '../cardcart/CardCart'

function Cart() {
	const { items, quantidadeItems, valorTotal, limparCart } = useContext(CartContext)

	return (
		<div className="min-h-screen bg-[#FDF1E9] py-8">
			<div className="container mx-auto px-4">
				{/* Cabeçalho */}
				<div className="flex items-center gap-1.5 text-xs font-semibold text-[#EA4B22] mb-2">
					<LeafIcon size={14} weight="fill" />
					<span>COMBATE AO DESPERDÍCIO</span>
				</div>
				<h1 className="text-3xl md:text-4xl font-bold text-[#2E241C] mb-8">
					Seu carrinho
				</h1>

				{/* Carrinho Vazio */}
				{items.length === 0 && (
					<div className="bg-white rounded-3xl border border-[#F1E1D3] p-12 text-center flex flex-col items-center">
						<div className="w-16 h-16 rounded-full bg-[#FFF3E8] flex items-center justify-center mb-4">
							<ShoppingCartIcon size={32} className="text-[#EA4B22]" />
						</div>
						<h2 className="text-xl font-semibold text-[#2E241C] mb-2">
							Seu carrinho está vazio
						</h2>
						<p className="text-[#8A7A6C] mb-6">
							Adicione sacolas surpresas e comece a economizar!
						</p>
						<Link
							to="/produtos"
							className="bg-[#EA4B22] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
						>
							Ver produtos
						</Link>
					</div>
				)}

				{/* Layout Principal: Lista de Produtos + Resumo */}
				{items.length > 0 && (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Coluna Esquerda: Lista de Produtos */}
						<div className="lg:col-span-2 space-y-4">
							{items.map((item) => (
								<CardCart key={item.id} item={item} />
							))}
						</div>

						{/* Coluna Direita: Resumo da Compra */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-3xl border border-[#F1E1D3] p-6 sticky top-4">
								<h2 className="text-lg font-bold text-[#2E241C] mb-4 pb-4 border-b border-[#F1E1D3]">
									Resumo da compra
								</h2>

								<div className="space-y-3 mb-6">
									<div className="flex justify-between text-[#8A7A6C]">
										<span>Produtos ({quantidadeItems})</span>
										<span className="font-semibold text-[#2E241C]">
											{new Intl.NumberFormat('pt-BR', {
												style: 'currency',
												currency: 'BRL',
											}).format(valorTotal)}
										</span>
									</div>

									<div className="flex justify-between text-[#8A7A6C]">
										<span>Frete</span>
										<span className="font-semibold text-[#4B8B5F]">
											Grátis
										</span>
									</div>

									<div className="flex justify-between text-[#8A7A6C]">
										<span>Desconto</span>
										<span className="font-semibold text-[#2E241C]">
											{new Intl.NumberFormat('pt-BR', {
												style: 'currency',
												currency: 'BRL',
											}).format(0.0)}
										</span>
									</div>
								</div>

								<div className="flex justify-between items-center text-lg font-bold py-4 mb-6 border-t border-[#F1E1D3]">
									<span className="text-[#2E241C]">Total</span>
									<span className="text-2xl text-[#EA4B22]">
										{new Intl.NumberFormat('pt-BR', {
											style: 'currency',
											currency: 'BRL',
										}).format(valorTotal)}
									</span>
								</div>

								{/* Formas de Pagamento */}
								<div className="mb-4 pb-4 border-b border-[#F1E1D3]">
									<p className="text-sm text-[#8A7A6C] mb-3">Formas de pagamento:</p>
									<div className="flex flex-wrap gap-2 justify-center">
										<div className="flex flex-row bg-[#FFF3E8] p-2 rounded-lg text-xs font-semibold text-[#2E241C]">
											<img
												src='https://ik.imagekit.io/vzr6ryejm/ecommerce/credit-card.png'
												alt='Logo Cartão de Crédito'
												className='w-10'
											></img>
										</div>
										<div className="flex flex-row items-center gap-1 bg-[#FFF3E8] p-2 rounded-lg text-xs font-semibold text-[#2E241C]">
											<img
												src='https://ik.imagekit.io/vzr6ryejm/ecommerce/pix-svgrepo-com.svg'
												alt='Logo do PIX'
												className='w-4'
											></img>
											<span>PIX</span>
										</div>
										<div className="flex flex-row bg-[#FFF3E8] p-2 rounded-lg text-xs font-semibold text-[#2E241C]">
											<img
												src='https://ik.imagekit.io/vzr6ryejm/ecommerce/google-pay-svgrepo-com.svg'
												alt='Logo do Google Pay'
												className='w-8'
											></img>
										</div>
										<div className="flex flex-row bg-[#FFF3E8] p-2 rounded-lg text-xs font-semibold text-[#2E241C]">
											<img
												src='https://ik.imagekit.io/vzr6ryejm/ecommerce/apple-pay-svgrepo-com.svg'
												alt='Logo do Apple Pay'
												className='w-8'
											></img>
										</div>
										<div className="bg-[#FFF3E8] p-2 rounded-lg text-xs font-semibold text-[#2E241C]">
											<img
												src='https://ik.imagekit.io/vzr6ryejm/ecommerce/boleto-logo.svg'
												alt='Logo do Boleto Bancáriao'
												className='w-10'
											></img>
										</div>
									</div>
								</div>

								<button
									onClick={limparCart}
									className="w-full bg-[#EA4B22] hover:opacity-90 text-white font-semibold py-3 rounded-full transition-opacity"
									type="button"
								>
									Finalizar compra
								</button>

								<p className="text-xs text-[#8A7A6C] text-center mt-4">
									Frete grátis para todo o Brasil
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Cart