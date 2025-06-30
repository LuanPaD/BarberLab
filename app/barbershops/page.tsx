import BarbershopItem from "../_components/barbershop-item"
import Header from "../_components/header"
import Search from "../_components/search"
import { getBarbershopsBySearchParams } from "../_data/getBarbershopsBySearchParams"

// interface BarbershopsPageProps {
//   searchParams: {
//     title?: string
//     service?: string
//   }
// }

// const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BarbershopsPage = async ({ searchParams }: any) => {
  searchParams =
    searchParams instanceof Promise ? await searchParams : searchParams
  const barbershops = await getBarbershopsBySearchParams(searchParams)

  return (
    <div>
      <Header />
      <div className="my-6 px-5">
        <Search />
      </div>
      <div className="px-5">
        <h2 className="mt-6 mb-3 text-xs font-bold text-gray-400 uppercase">
          Resultados para &quot;
          {searchParams?.title || searchParams?.service || searchParams?.tag}
          &quot;
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarbershopsPage
