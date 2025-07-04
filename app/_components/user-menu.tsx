"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { UserIcon } from "lucide-react"
import SignInDialog from "./sign-in-dialog"
import { Button } from "./ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog"
import UserInfo from "./user-info"

const UserMenu = () => {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLoggedIn = !!session?.user

  if (!mounted || status === "loading") {
    return null
  }

  const userButton = (
    <Button
      variant="ghost"
      size="icon"
      className={`hover:bg-primary/10 flex items-center gap-2 ${isLoggedIn ? "text-green-600" : ""}`}
    >
      <UserIcon
        className="h-5 w-5"
        fill={isLoggedIn ? "currentColor" : "none"}
      />
    </Button>
  )

  if (isLoggedIn) {
    return (
      <Popover>
        <PopoverTrigger asChild>{userButton}</PopoverTrigger>
        <PopoverContent className="mt-2 w-64">
          {session?.user && <UserInfo user={session.user} />}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{userButton}</DialogTrigger>
      <DialogContent className="w-[90%]">
        <SignInDialog />
      </DialogContent>
    </Dialog>
  )
}

export default UserMenu
