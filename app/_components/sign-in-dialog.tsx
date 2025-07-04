import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import Image from "next/image"

const SignInDialog = () => {
  const handleLoginWithGoogleClick = () => signIn("google")

  return (
    <>
      {/* Desktop Style */}
      <div className="hidden w-full items-center justify-center p-5 md:flex">
        <DialogHeader className="flex w-full flex-col items-center">
          <DialogTitle className="w-full text-center text-lg font-bold">
            Faça login na plataforma
          </DialogTitle>
          <DialogDescription className="w-full text-center text-sm text-gray-500">
            Conecte-se usando sua conta do Google.
          </DialogDescription>
        </DialogHeader>
      </div>

      <DialogHeader className="md:hidden">
        <DialogTitle>Faça login na plataforma</DialogTitle>
        <DialogDescription>
          Conecte-se usando sua conta do Google.
        </DialogDescription>
      </DialogHeader>

      <Button
        variant="outline"
        className="gap-1 font-bold"
        onClick={handleLoginWithGoogleClick}
      >
        <Image
          alt="Fazer login com o Google"
          src="/google.svg"
          width={18}
          height={18}
        />
        Google
      </Button>
    </>
  )
}

export default SignInDialog
