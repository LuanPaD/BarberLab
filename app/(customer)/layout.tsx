import Footer from "@/app/_components/footer"

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default CustomerLayout
