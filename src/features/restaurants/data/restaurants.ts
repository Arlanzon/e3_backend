import type { Restaurant } from '../types'

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Sabores de Oaxaca',
    category: 'Cocina tradicional',
    location: 'Centro, Oaxaca',
    rating: 4.8,
    priceRange: '$$',
    description: 'Platillos locales, ingredientes frescos y ambiente familiar.',
    imageUrl: '/images/restaurants/restaurant%201.jpg',
  },
  {
    id: '2',
    name: 'La Mesa del Valle',
    category: 'Comida regional',
    location: 'Tlacolula, Oaxaca',
    rating: 4.6,
    priceRange: '$$',
    description: 'Especialidad en tlayudas, moles y desayunos oaxaquenos.',
    imageUrl: '/images/restaurants/restaurant%202.jpg',
  },
  {
    id: '3',
    name: 'Cafe Nube',
    category: 'Cafe y postres',
    location: 'Jalatlaco, Oaxaca',
    rating: 4.7,
    priceRange: '$',
    description: 'Cafe de especialidad, pan artesanal y postres de temporada.',
    imageUrl: '/images/restaurants/restaurant%203.jpg',
  },
]
