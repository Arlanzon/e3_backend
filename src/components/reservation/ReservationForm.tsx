'use client'

import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { mockRestaurants } from '@/features/restaurants/data/restaurants'

const initialRestaurantId = mockRestaurants[0]?.id ?? ''

export default function ReservationForm() {
  const [restaurantId, setRestaurantId] = useState(initialRestaurantId)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [numPersons, setNumPersons] = useState('2')
  const [notes, setNotes] = useState('')

  const selectedRestaurant = useMemo(
    () => mockRestaurants.find((restaurant) => restaurant.id === restaurantId),
    [restaurantId]
  )

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form className="space-y-5 rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <label
            htmlFor="restaurantId"
            className="text-sm font-medium text-[#1C1C1C]"
          >
            Restaurante
          </label>
          <select
            id="restaurantId"
            name="restaurantId"
            value={restaurantId}
            onChange={(event) => setRestaurantId(event.target.value)}
            className="w-full rounded-lg border border-[#E8E4DE] bg-white px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#1A3A2A]"
          >
            {mockRestaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="date"
            name="date"
            type="date"
            label="Fecha"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <Input
            id="time"
            name="time"
            type="time"
            label="Hora"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </div>

        <Input
          id="numPersons"
          name="numPersons"
          type="number"
          min={1}
          max={20}
          label="Numero de personas"
          value={numPersons}
          onChange={(event) => setNumPersons(event.target.value)}
        />

        <div className="space-y-1">
          <label htmlFor="notes" className="text-sm font-medium text-[#1C1C1C]">
            Notas opcionales
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ejemplo: mesa cerca de ventana, celebracion especial..."
            className="w-full rounded-lg border border-[#E8E4DE] bg-white px-4 py-2.5 text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#1A3A2A]"
          />
        </div>

        <Button type="button" size="lg" className="w-full">
          Confirmar reservacion
        </Button>
      </form>

      <aside className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#C4622D]">
          Resumen
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#1A3A2A]">
          Vista previa
        </h2>

        <div className="mt-5 space-y-3 text-sm text-[#6B6B6B]">
          <p>
            <span className="font-medium text-[#1C1C1C]">Restaurante:</span>{' '}
            {selectedRestaurant?.name ?? 'Selecciona un restaurante'}
          </p>
          <p>
            <span className="font-medium text-[#1C1C1C]">Fecha:</span>{' '}
            {date || 'Por definir'}
          </p>
          <p>
            <span className="font-medium text-[#1C1C1C]">Hora:</span>{' '}
            {time || 'Por definir'}
          </p>
          <p>
            <span className="font-medium text-[#1C1C1C]">Personas:</span>{' '}
            {numPersons || '0'}
          </p>
          <p>
            <span className="font-medium text-[#1C1C1C]">Notas:</span>{' '}
            {notes.trim() || 'Sin notas'}
          </p>
        </div>
      </aside>
    </section>
  )
}
