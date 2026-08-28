import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getProduct, type ProductId } from '../data/products'

export interface CartLine {
  productId: ProductId
  qty: number
}

interface FlyingImage {
  productId: ProductId
  from: DOMRect
  to: DOMRect
  stamp: number
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  total: number
  isOpen: boolean
  flying: FlyingImage | null
  cartButtonRef: React.RefObject<HTMLButtonElement | null>
  openCart: () => void
  closeCart: () => void
  /** Launches the fly-to-cart animation, then adds the product. */
  addToCart: (productId: ProductId, fromEl: HTMLElement) => void
  changeQty: (productId: ProductId, delta: number) => void
  clearCart: () => void
  clearFlight: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [flying, setFlying] = useState<FlyingImage | null>(null)
  const cartButtonRef = useRef<HTMLButtonElement | null>(null)
  const flightTimer = useRef<number | undefined>(undefined)

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines])
  const total = useMemo(
    () => lines.reduce((sum, l) => sum + getProduct(l.productId).price * l.qty, 0),
    [lines],
  )

  const addToCart = useCallback((productId: ProductId, fromEl: HTMLElement) => {
    const cartBtn = cartButtonRef.current
    if (!cartBtn) return
    const from = fromEl.getBoundingClientRect()
    const to = cartBtn.getBoundingClientRect()
    setFlying({ productId, from, to, stamp: Date.now() })

    // the item lands in the cart when the flight completes (≈950ms)
    window.clearTimeout(flightTimer.current)
    flightTimer.current = window.setTimeout(() => {
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === productId)
        if (existing)
          return prev.map((l) =>
            l.productId === productId ? { ...l, qty: l.qty + 1 } : l,
          )
        return [...prev, { productId, qty: 1 }]
      })
      setFlying(null)
    }, 950)
  }, [])

  const changeQty = useCallback((productId: ProductId, delta: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.productId === productId ? { ...l, qty: Math.max(0, l.qty + delta) } : l,
        )
        .filter((l) => l.qty > 0),
    )
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const clearFlight = useCallback(() => setFlying(null), [])

  const value = useMemo(
    () => ({
      lines,
      count,
      total,
      isOpen,
      flying,
      cartButtonRef,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart,
      changeQty,
      clearCart,
      clearFlight,
    }),
    [lines, count, total, isOpen, flying, addToCart, changeQty, clearCart, clearFlight],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
