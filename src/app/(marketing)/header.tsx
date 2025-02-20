import { Button } from "@/components/ui/button"
import { ClerkLoaded, ClerkLoading, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Loader } from "lucide-react"
import Image from "next/image"

export const Header = () => {
    return (
        <header className="w-full h-20 border-b-2 border-slate-200 px-4">
            <div className="lg:max-w-screen-lg h-full flex items-center mx-auto justify-between">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/mascot.svg" height={40} width={40} alt="bird" />
                    <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">WizLing</h1>
                </div>
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal" afterSignInUrl="/learn"
                            afterSignUpUrl="/learn" >
                            <Button size="lg" variant="ghost">
                                Login
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    )
}

