export type RestaurantDetail = {
  slug: string
  name: string
  category: string
  location: string
  rating: string
  distance: string
  price: string
  description: string
  longDescription: string
  imageUrl: string
  phone: string
  address: string
  hours: Array<{
    day: string
    time: string
  }>
  specialties: string[]
}

export const restaurantDetails: RestaurantDetail[] = [
  {
    slug: 'pitiona-cocina-de-autor',
    name: 'Pitiona Cocina de Autor',
    category: 'Cocina oaxaquena',
    location: 'Centro historico',
    rating: '4.8',
    distance: '1.2 km',
    price: '$$$',
    description: 'Terraza con vista al centro, menu local y cocina de autor.',
    longDescription:
      'Restaurante de cocina oaxaquena contemporanea con terraza, vista al centro y una propuesta ideal para comidas especiales, cenas tranquilas o visitas con invitados.',
    imageUrl: '/images/restaurants/restaurant%204.jpg',
    phone: '951 123 4567',
    address: 'Calle 5 de Mayo 311, Centro, Oaxaca',
    hours: [
      { day: 'Lunes a jueves', time: '13:00 - 22:00' },
      { day: 'Viernes y sabado', time: '13:00 - 23:30' },
      { day: 'Domingo', time: '13:00 - 20:00' },
    ],
    specialties: ['Mole negro', 'Tostadas de temporada', 'Mezcaleria', 'Terraza'],
  },
  {
    slug: 'tlayudas-del-centro',
    name: 'Tlayudas del Centro',
    category: 'Antojitos locales',
    location: 'Mercado 20 de Noviembre',
    rating: '4.7',
    distance: '850 m',
    price: '$$',
    description: 'Tlayudas, moles y comida tradicional para visitar en grupo.',
    longDescription:
      'Lugar casual para probar antojitos oaxaquenos, tlayudas al carbon y platillos tradicionales en un ambiente movido y cercano al centro.',
    imageUrl: '/images/restaurants/restaurant%202.jpg',
    phone: '951 222 9080',
    address: 'Mercado 20 de Noviembre, Centro, Oaxaca',
    hours: [
      { day: 'Lunes a sabado', time: '09:00 - 22:00' },
      { day: 'Domingo', time: '09:00 - 18:00' },
    ],
    specialties: ['Tlayuda sencilla', 'Tlayuda con tasajo', 'Mole rojo', 'Chocolate'],
  },
  {
    slug: 'cafe-santo-domingo',
    name: 'Cafe Santo Domingo',
    category: 'Cafe y pan artesanal',
    location: 'Santo Domingo',
    rating: '4.6',
    distance: '1.8 km',
    price: '$',
    description: 'Cafe de especialidad, postres y mesas tranquilas para platicar.',
    longDescription:
      'Cafe tranquilo para desayunar, trabajar un rato o cerrar la tarde cerca de Santo Domingo con pan artesanal y bebidas de especialidad.',
    imageUrl: '/images/restaurants/restaurant%203.jpg',
    phone: '951 456 1100',
    address: 'Alcala 204, Santo Domingo, Oaxaca',
    hours: [
      { day: 'Lunes a viernes', time: '08:00 - 21:00' },
      { day: 'Sabado y domingo', time: '08:00 - 22:00' },
    ],
    specialties: ['Cafe de olla', 'Pan artesanal', 'Postres', 'Desayunos'],
  },
  {
    slug: 'la-mesa-del-valle',
    name: 'La Mesa del Valle',
    category: 'Comida regional',
    location: 'Jalatlaco',
    rating: '4.5',
    distance: '2.1 km',
    price: '$$',
    description: 'Platillos regionales, desayunos y ambiente casual.',
    longDescription:
      'Restaurante regional de ambiente relajado, pensado para desayunos largos, comida familiar y platillos caseros de Oaxaca.',
    imageUrl: '/images/restaurants/restaurant%205.jpg',
    phone: '951 300 7711',
    address: 'Aldama 18, Jalatlaco, Oaxaca',
    hours: [
      { day: 'Martes a domingo', time: '08:30 - 18:30' },
      { day: 'Lunes', time: 'Cerrado' },
    ],
    specialties: ['Enmoladas', 'Memelas', 'Caldo de piedra', 'Aguas frescas'],
  },
]

export function getRestaurantBySlug(slug: string) {
  return restaurantDetails.find((restaurant) => restaurant.slug === slug)
}
