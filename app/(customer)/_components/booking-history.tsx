"use client"

import BookingItem, {
  type BookingItemData,
} from "@/app/_components/booking-item"
import { Button } from "@/app/_components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"

const PAGE_SIZE = 6

interface BookingHistoryProps {
  bookings: BookingItemData[]
}

const BookingHistory = ({ bookings }: BookingHistoryProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visible = bookings.slice(0, visibleCount)
  const remaining = bookings.length - visible.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3">
        {visible.map((booking) => (
          <BookingItem key={booking.id} booking={booking} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
          >
            <ChevronDownIcon />
            Ver mais {remaining > PAGE_SIZE ? PAGE_SIZE : remaining} de{" "}
            {remaining}
          </Button>
        </div>
      )}
    </div>
  )
}

export default BookingHistory
