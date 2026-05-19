import Link from 'next/link'
import Image from 'next/image'
import PageContainer from '@/components/layout/PageContainer'
import { getRestaurantById } from '@/features/restaurants/data/restaurant-details'
import { mockRestaurants } from '@/features/restaurants/data/restaurants'
import type { Restaurant } from '@/features/restaurants/types'

type RestaurantDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

type RestaurantSchedule = {
  day: string
  time: string
}

type RestaurantDetailView = {
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
  hours: RestaurantSchedule[]
  specialties: string[]
}

const fallbackPhotoUrl = '/images/restaurants/fallback-restaurant.png'

function getPriceRange(restaurant: Restaurant): string {
  return restaurant.cuisineType === 'Cafeteria' || restaurant.cuisineType === 'Fonda' ? '$' : '$$'
}

function toRestaurantDetailView(restaurant: Restaurant): RestaurantDetailView {
  return {
    name: restaurant.name,
    category: restaurant.cuisineType,
    location: restaurant.address,
    rating: (restaurant.ratingAvg ?? 0).toFixed(1),
    distance: '1.2 km',
    price: getPriceRange(restaurant),
    description: restaurant.description ?? '',
    longDescription:
      restaurant.description ??
      'Restaurante oaxaqueno con cocina local, atencion cercana y una propuesta pensada para disfrutar el centro de la ciudad.',
    imageUrl: restaurant.photos?.[0]?.url ?? fallbackPhotoUrl,
    phone: restaurant.phone ?? 'Sin telefono registrado',
    address: restaurant.address,
    hours: [
      { day: 'Lunes a sabado', time: '08:00 - 22:00' },
      { day: 'Domingo', time: 'Cerrado' },
    ],
    specialties: ['Mole de la casa', 'Tortillas hechas a mano', 'Chocolate de agua'],
  }
}

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { id } = await params
  const restaurantById = getRestaurantById(id)
  const restaurantBySlug = mockRestaurants.find((item) => item.slug === id)
  const fallbackRestaurant = mockRestaurants[0]
  const restaurant = toRestaurantDetailView(
    restaurantById ?? restaurantBySlug ?? fallbackRestaurant
  )

  return (
    <PageContainer className="space-y-8">
      <Link
        href="/restaurants"
        className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-900"
      >
        Volver a restaurantes
      </Link>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="relative min-h-96 overflow-hidden rounded-lg bg-stone-100 p-6 text-white shadow-sm">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1A3A2A]/35" />
          <div className="relative flex h-full min-h-80 flex-col justify-end rounded-lg border border-white/30 p-6">
            <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-900">
              {restaurant.price}
            </span>
            <h1 className="mt-5 text-4xl font-bold">{restaurant.name}</h1>
            <p className="mt-2 text-white/85">
              {restaurant.category} - {restaurant.location}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Detalle del restaurante
            </p>
            <h2 className="text-3xl font-bold text-stone-950">
              {restaurant.name}
            </h2>
            <p className="leading-8 text-stone-600">
              {restaurant.longDescription}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">Rating</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">
                {restaurant.rating}
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">Precio</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">
                {restaurant.price}
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-sm text-stone-500">Zona</p>
              <p className="mt-1 text-xl font-semibold text-stone-950">
                {restaurant.location}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
              <p className="text-sm font-semibold text-stone-950">Contacto</p>
              <p className="mt-2 text-stone-600">{restaurant.phone}</p>
              <p className="mt-1 text-stone-600">{restaurant.address}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
              <p className="text-sm font-semibold text-stone-950">Distancia</p>
              <p className="mt-2 text-stone-600">{restaurant.distance}</p>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold text-stone-950">Horario</p>
            <div className="mt-3 space-y-2">
              {restaurant.hours.map((schedule) => (
                <div
                  key={`${schedule.day}-${schedule.time}`}
                  className="flex justify-between gap-4 text-sm text-stone-600"
                >
                  <span>{schedule.day}</span>
                  <span className="font-medium text-stone-800">
                    {schedule.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {restaurant.specialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800"
              >
                {specialty}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
          >
            Reservar
          </button>
        </div>
      </section>
    </PageContainer>
  )
}
