import { createContext, useState, type ReactNode } from "react"
import { toast } from "react-toastify"
import type Produto from "../models/Produto"

export interface ItemCarrinho extends Produto {
	quantidade: number
}

interface CartContextProps {
	items: ItemCarrinho[]
	quantidadeItems: number
	valorTotal: number
	adicionarProduto(produto: Produto): void
	adicionarItem(id: number): void
	removerItem(id: number): void
	removerProduto(id: number): void
	limparCart(): void
}

interface CartProviderProps {
	children: ReactNode
}

export const CartContext = createContext({} as CartContextProps)

export function CartProvider({ children }: CartProviderProps) {
	const [items, setItems] = useState<ItemCarrinho[]>([])

	const quantidadeItems = items.reduce((acc, item) => acc + item.quantidade, 0)
	const valorTotal = items.reduce((acc, item) => acc + Number(item.preco) * item.quantidade, 0)

	function adicionarProduto(produto: Produto) {
		const itemIndex = items.findIndex((item) => item.id === produto.id)

		if (itemIndex !== -1) {
			const novoCart = [...items]
			novoCart[itemIndex] = {
				...novoCart[itemIndex],
				...produto,
				quantidade: novoCart[itemIndex].quantidade + 1,
			}
			setItems(novoCart)
		} else {
			setItems((itensAtuais) => [...itensAtuais, { ...produto, quantidade: 1 }])
		}
		toast.success("Produto adicionado ao carrinho!")
	}

	function adicionarItem(id: number) {
		const itemIndex = items.findIndex((item) => item.id === id)

		if (itemIndex !== -1) {
			const novoCart = [...items]
			novoCart[itemIndex] = {
				...novoCart[itemIndex],
				quantidade: novoCart[itemIndex].quantidade + 1,
			}
			setItems(novoCart)
		}
	}

	function removerItem(id: number) {
		const itemIndex = items.findIndex((item) => item.id === id)

		if (itemIndex !== -1) {
			const novoCart = [...items]

			if (novoCart[itemIndex].quantidade > 1) {
				novoCart[itemIndex] = {
					...novoCart[itemIndex],
					quantidade: novoCart[itemIndex].quantidade - 1,
				}
				setItems(novoCart)
			} else {
				novoCart.splice(itemIndex, 1)
				setItems(novoCart)
			}
		}
	}

	function removerProduto(id: number) {
		const novoCart = items.filter((item) => item.id !== id)
		setItems(novoCart)
	}

	function limparCart() {
		toast.success("Compra efetuada com sucesso!")
		setItems([])
	}

	return (
		<CartContext.Provider
			value={{
				items,
				quantidadeItems,
				valorTotal,
				adicionarProduto,
				adicionarItem,
				removerItem,
				removerProduto,
				limparCart,
			}}
		>
			{children}
		</CartContext.Provider>
	)
}