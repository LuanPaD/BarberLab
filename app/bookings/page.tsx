"use server"

import { getServerSession } from "next-auth"
import Header from "../_components/header"
import { authOptions } from "../_lib/auth"
import BookingItem from "../_components/booking-item"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { getConcludedBookings } from "../_data/get-concluded-bookings"
import { Key } from "react"

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return (
      <>
        <Header />
        <div className="space-y-3 p-5">
          <h1 className="text-xl font-bold">Agendamentos</h1>
          <p className="text-gray-400">
            Você precisa estar logado para ver seus agendamentos.
          </p>
        </div>
      </>
    )
  }

  const confirmedBookings = await getConfirmedBookings()
  const concludedBookings = await getConcludedBookings()

  return (
    <>
      <Header />
      <div className="space-y-3 p-5">
        <h1 className="text-xl font-bold">Agendamentos</h1>
        {confirmedBookings.length === 0 && concludedBookings.length === 0 && (
          <p className="text-gray-400">Você não tem agendamentos.</p>
        )}
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
              Confirmados
            </h2>
            {confirmedBookings.map(
              (booking: { id: Key | null | undefined }) => (
                <BookingItem
                  key={booking.id}
                  booking={JSON.parse(JSON.stringify(booking))}
                />
              ),
            )}
          </>
        )}
        {concludedBookings.length > 0 && (
          <>
            <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
              Finalizados
            </h2>
            {concludedBookings.map(
              (booking: { id: Key | null | undefined }) => (
                <BookingItem
                  key={booking.id}
                  booking={JSON.parse(JSON.stringify(booking))}
                />
              ),
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Bookings
