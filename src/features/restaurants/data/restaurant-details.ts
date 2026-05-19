import type { Restaurant, Review } from '../types'
import { mockRestaurants } from './restaurants'

const fallbackPhotoUrl = '/images/restaurants/fallback-restaurant.png'
const firstRestaurant = mockRestaurants[0]

export const mockRestaurantDetails: Record<string, Restaurant> = {
  [firstRestaurant.id]: {
    ...firstRestaurant,
    photos: [
      {
        id: `${firstRestaurant.id}-photo-1`,
        url: fallbackPhotoUrl,
        isPrimary: true,
        order: 0,
      },
      {
        id: `${firstRestaurant.id}-photo-2`,
        url: fallbackPhotoUrl,
        isPrimary: false,
        order: 1,
      },
      {
        id: `${firstRestaurant.id}-photo-3`,
        url: fallbackPhotoUrl,
        isPrimary: false,
        order: 2,
      },
    ],
    businessHours: [
      {
        id: `${firstRestaurant.id}-hours-monday`,
        dayOfWeek: 'MONDAY',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        id: `${firstRestaurant.id}-hours-tuesday`,
        dayOfWeek: 'TUESDAY',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        id: `${firstRestaurant.id}-hours-wednesday`,
        dayOfWeek: 'WEDNESDAY',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        id: `${firstRestaurant.id}-hours-thursday`,
        dayOfWeek: 'THURSDAY',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        id: `${firstRestaurant.id}-hours-friday`,
        dayOfWeek: 'FRIDAY',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        id: `${firstRestaurant.id}-hours-saturday`,
        dayOfWeek: 'SATURDAY',
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      },
      {
        id: `${firstRestaurant.id}-hours-sunday`,
        dayOfWeek: 'SUNDAY',
        openTime: '00:00',
        closeTime: '00:00',
        isClosed: true,
      },
    ],
  },
}

export const mockReviews: Record<string, Review[]> = {
  [firstRestaurant.id]: [
    {
      id: `${firstRestaurant.id}-review-1`,
      userId: 'user-rosario-mendez',
      userName: 'Rosario Mendez',
      rating: 5,
      comment:
        'El mole negro tiene un sabor profundo y las tortillas salen calientitas. Se siente como comer en una casa oaxaquena de verdad.',
      createdAt: '2026-05-03T20:10:00.000Z',
      response: {
        id: `${firstRestaurant.id}-response-1`,
        content:
          'Muchas gracias por visitarnos, Rosario. Nos alegra que hayas disfrutado el mole y el sabor de nuestra cocina.',
        createdAt: '2026-05-04T15:00:00.000Z',
        isEdited: false,
      },
    },
    {
      id: `${firstRestaurant.id}-review-2`,
      userId: 'user-carlos-hernandez',
      userName: 'Carlos Hernandez',
      rating: 5,
      comment:
        'Pedimos tasajo, memelas y chocolate de agua. Todo llego bien servido y con ese sazoncito tradicional que uno busca en Oaxaca.',
      createdAt: '2026-05-06T18:45:00.000Z',
      response: null,
    },
    {
      id: `${firstRestaurant.id}-review-3`,
      userId: 'user-lucia-santiago',
      userName: 'Lucia Santiago',
      rating: 4,
      comment:
        'Muy buena comida y atencion amable. Las enmoladas estaban excelentes; solo nos hubiera gustado mas variedad de aguas frescas.',
      createdAt: '2026-05-09T21:20:00.000Z',
      response: null,
    },
  ],
}

export function getRestaurantById(id: string): Restaurant | null {
  return mockRestaurantDetails[id] ?? mockRestaurants.find((restaurant) => restaurant.id === id) ?? null
}

export function getReviewsByRestaurantId(id: string): Review[] {
  return mockReviews[id] ?? []
}

type RestaurantSchedule = {
  day: string
  time: string
}
