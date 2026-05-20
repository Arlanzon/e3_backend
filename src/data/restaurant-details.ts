export type RestaurantDetail = {
  slug: string
  id: string
  name: string
  category: string
  location: string
  rating: string
  distance: string
  price: string
  imageUrl?: string
  featured?: boolean
  description: string
  longDescription: string
  phone: string
  address: string
  hours: Array<{
    day: string
    time: string
  }>
  specialties: string[]
  services: string[]
  reviews: Array<{
    author: string
    rating: string
    comment: string
  }>
}

export const restaurantDetails: RestaurantDetail[] = [
  {
    slug: 'pitiona-cocina-de-autor',
    id: 'pitiona-cocina-de-autor',
    name: 'Pitiona Cocina de Autor',
    category: 'Cocina oaxaquena',
    location: 'Centro historico',
    rating: '4.8',
    distance: '1.2 km',
    price: '$$$',
    imageUrl: '/images/mejores-restaurantes-oaxaca-pitiona.jpg',
    featured: true,
    description: 'Terraza con vista al centro, menu local y cocina de autor.',
    longDescription:
      'Restaurante de cocina oaxaquena contemporanea con terraza, vista al centro y una propuesta ideal para comidas especiales, cenas tranquilas o visitas con invitados.',
    phone: '951 123 4567',
    address: 'Calle 5 de Mayo 311, Centro, Oaxaca',
    hours: [
      { day: 'Lunes a jueves', time: '13:00 - 22:00' },
      { day: 'Viernes y sabado', time: '13:00 - 23:30' },
      { day: 'Domingo', time: '13:00 - 20:00' },
    ],
    specialties: ['Mole negro', 'Tostadas de temporada', 'Mezcaleria', 'Terraza'],
    services: ['Reservacion', 'Terraza', 'Barra de mezcal', 'Menu de temporada'],
    reviews: [
      {
        author: 'Mariana C.',
        rating: '4.9',
        comment: 'La terraza y el mole fueron lo mejor de la noche.',
      },
      {
        author: 'Luis R.',
        rating: '4.7',
        comment: 'Buen servicio, ideal para una cena tranquila en el centro.',
      },
    ],
  },
  {
    slug: 'tlayudas-del-centro',
    id: 'tlayudas-del-centro',
    name: 'Tlayudas del Centro',
    category: 'Antojitos locales',
    location: 'Mercado 20 de Noviembre',
    rating: '4.7',
    distance: '850 m',
    price: '$$',
    imageUrl: '/images/mejores-restaurantes-oaxaca-pitiona.jpg',
    description: 'Tlayudas, moles y comida tradicional para visitar en grupo.',
    longDescription:
      'Lugar casual para probar antojitos oaxaquenos, tlayudas al carbon y platillos tradicionales en un ambiente movido y cercano al centro.',
    phone: '951 222 9080',
    address: 'Mercado 20 de Noviembre, Centro, Oaxaca',
    hours: [
      { day: 'Lunes a sabado', time: '09:00 - 22:00' },
      { day: 'Domingo', time: '09:00 - 18:00' },
    ],
    specialties: ['Tlayuda sencilla', 'Tlayuda con tasajo', 'Mole rojo', 'Chocolate'],
    services: ['Para llevar', 'Mesas familiares', 'Pago en efectivo', 'Abierto temprano'],
    reviews: [
      {
        author: 'Andrea M.',
        rating: '4.8',
        comment: 'Sabor muy local y porciones grandes para compartir.',
      },
      {
        author: 'Diego P.',
        rating: '4.6',
        comment: 'Perfecto para comer rapido cerca del mercado.',
      },
    ],
  },
  {
    slug: 'cafe-santo-domingo',
    id: 'cafe-santo-domingo',
    name: 'Cafe Santo Domingo',
    category: 'Cafe y pan artesanal',
    location: 'Santo Domingo',
    rating: '4.6',
    distance: '1.8 km',
    price: '$',
    imageUrl: '/images/mejores-restaurantes-oaxaca-pitiona.jpg',
    description: 'Cafe de especialidad, postres y mesas tranquilas para platicar.',
    longDescription:
      'Cafe tranquilo para desayunar, trabajar un rato o cerrar la tarde cerca de Santo Domingo con pan artesanal y bebidas de especialidad.',
    phone: '951 456 1100',
    address: 'Alcala 204, Santo Domingo, Oaxaca',
    hours: [
      { day: 'Lunes a viernes', time: '08:00 - 21:00' },
      { day: 'Sabado y domingo', time: '08:00 - 22:00' },
    ],
    specialties: ['Cafe de olla', 'Pan artesanal', 'Postres', 'Desayunos'],
    services: ['Cafe de especialidad', 'Postres', 'Wifi', 'Pet friendly'],
    reviews: [
      {
        author: 'Sofia G.',
        rating: '4.7',
        comment: 'Buen cafe y ambiente calmado para una tarde larga.',
      },
      {
        author: 'Pablo N.',
        rating: '4.5',
        comment: 'El pan artesanal vale mucho la vuelta.',
      },
    ],
  },
  {
    slug: 'la-mesa-del-valle',
    id: 'la-mesa-del-valle',
    name: 'La Mesa del Valle',
    category: 'Comida regional',
    location: 'Jalatlaco',
    rating: '4.5',
    distance: '2.1 km',
    price: '$$',
    featured: true,
    imageUrl: '/images/mejores-restaurantes-oaxaca-pitiona.jpg',
    description: 'Platillos regionales, desayunos y ambiente casual.',
    longDescription:
      'Restaurante regional de ambiente relajado, pensado para desayunos largos, comida familiar y platillos caseros de Oaxaca.',
    phone: '951 300 7711',
    address: 'Aldama 18, Jalatlaco, Oaxaca',
    hours: [
      { day: 'Martes a domingo', time: '08:30 - 18:30' },
      { day: 'Lunes', time: 'Cerrado' },
    ],
    specialties: ['Enmoladas', 'Memelas', 'Caldo de piedra', 'Aguas frescas'],
    services: ['Desayunos', 'Comida familiar', 'Menu regional', 'Reservacion sugerida'],
    reviews: [
      {
        author: 'Valeria T.',
        rating: '4.6',
        comment: 'Muy buena opcion para desayunar sin prisas.',
      },
      {
        author: 'Mateo S.',
        rating: '4.4',
        comment: 'Casero, amable y con buenos precios.',
      },
    ],
  },
]

export function getRestaurantBySlug(slug: string) {
  return restaurantDetails.find((restaurant) => restaurant.slug === slug)
}
