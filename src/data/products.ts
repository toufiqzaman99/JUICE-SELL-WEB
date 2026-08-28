export type ProductId =
  | 'lemonade'
  | 'strawberry-milkshake'
  | 'chocolate-milkshake'
  | 'classic-coffee'
  | 'strawberry-coffee'
  | 'chocolate-coffee'

export interface Product {
  id: ProductId
  index: string
  name: string
  shortName: string
  tagline: string
  description: string
  price: number
  ingredients: string[]
  accent: string
  accentSoft: string
  glow: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'lemonade',
    index: '01',
    name: 'FRESH LEMONADE',
    shortName: 'LEMONADE',
    tagline: 'Pure lemon energy',
    description:
      'Cold-pressed Sicilian lemons, raw cane sugar and a whisper of garden mint — poured over hand-cracked ice.',
    price: 4.5,
    ingredients: ['LEMON', 'MINT', 'ICE', 'CANE SUGAR'],
    accent: '#e9c33c',
    accentSoft: '#f7e4a0',
    glow: 'rgba(233, 195, 60, 0.16)',
  },
  {
    id: 'strawberry-milkshake',
    index: '02',
    name: 'STRAWBERRY MILKSHAKE',
    shortName: 'STRAWBERRY SHAKE',
    tagline: 'A dream you can sip',
    description:
      'Sun-ripened strawberries folded into vanilla bean cream, crowned with a swirl of whipped silk.',
    price: 6.9,
    ingredients: ['STRAWBERRY', 'CREAM', 'VANILLA', 'ICE'],
    accent: '#e4556e',
    accentSoft: '#f6a3b3',
    glow: 'rgba(228, 85, 110, 0.16)',
  },
  {
    id: 'chocolate-milkshake',
    index: '03',
    name: 'CHOCOLATE MILKSHAKE',
    shortName: 'CHOCOLATE SHAKE',
    tagline: 'Dark, deep, indulgent',
    description:
      '72% single-origin dark chocolate melted into cold milk, finished with cocoa dust and shaved chocolate.',
    price: 6.9,
    ingredients: ['DARK CHOCOLATE', 'MILK', 'COCOA', 'ICE'],
    accent: '#a06a3c',
    accentSoft: '#d8b28c',
    glow: 'rgba(160, 106, 60, 0.18)',
  },
  {
    id: 'classic-coffee',
    index: '04',
    name: 'CLASSIC COLD COFFEE',
    shortName: 'CLASSIC COLD COFFEE',
    tagline: 'Coffee. But colder.',
    description:
      'Double-shot espresso slow-chilled, silkened with whole milk and poured over glacier ice.',
    price: 5.5,
    ingredients: ['ESPRESSO', 'MILK', 'ICE', 'BROWN SUGAR'],
    accent: '#c08a5a',
    accentSoft: '#e8cba4',
    glow: 'rgba(192, 138, 90, 0.16)',
  },
  {
    id: 'strawberry-coffee',
    index: '05',
    name: 'STRAWBERRY COLD COFFEE',
    shortName: 'STRAWBERRY COFFEE',
    tagline: 'Espresso meets the berry patch',
    description:
      'Cold espresso layered over strawberry purée and cream — bright, bold and impossibly smooth.',
    price: 6.2,
    ingredients: ['ESPRESSO', 'STRAWBERRY', 'CREAM', 'ICE'],
    accent: '#e06a5a',
    accentSoft: '#f2b1a6',
    glow: 'rgba(224, 106, 90, 0.16)',
  },
  {
    id: 'chocolate-coffee',
    index: '06',
    name: 'CHOCOLATE COLD COFFEE',
    shortName: 'CHOCOLATE COFFEE',
    tagline: 'Midnight in a glass',
    description:
      'Espresso and dark cocoa fused into a velvet-cold blend, with a slow ribbon of chocolate syrup.',
    price: 6.2,
    ingredients: ['ESPRESSO', 'DARK COCOA', 'MILK', 'ICE'],
    accent: '#b98a4e',
    accentSoft: '#e3c795',
    glow: 'rgba(185, 138, 78, 0.16)',
  },
]

export const getProduct = (id: ProductId): Product => PRODUCTS.find((p) => p.id === id)!
