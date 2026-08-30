import Footer from "@/app/_components/footer"

/**
 * Chrome do app do cliente. O Header continua em cada página porque algumas
 * passam `specialSearchElements` para a busca contextual.
 */
const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default CustomerLayout
