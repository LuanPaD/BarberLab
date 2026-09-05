import { Button } from "./ui/button"
import { signOut } from "next-auth/react"
import { Avatar, AvatarImage } from "./ui/avatar"
import Link from "next/link"

interface UserProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

const UserInfo = ({ user }: UserProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        {user && (
          <>
            <div className="mb-2 flex justify-center">
              <Avatar>
                <AvatarImage src={user?.image ?? "./default-avatar.png"} />
              </Avatar>
            </div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </>
        )}
      </div>
      <div className="w-full space-y-2">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/perfil">Meus dados</Link>
        </Button>

        <Button
          variant="destructive"
          className="w-full font-semibold"
          onClick={() => signOut()}
        >
          Sair
        </Button>
      </div>
    </div>
  )
}

export default UserInfo
