import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <SignIn
            appearance={{
                elements: {
                    rootBox: "w-full",
                    card: "bg-white/5 border border-white/10 backdrop-blur-xl shadow-none m-0 rounded-2xl w-full",
                    headerTitle: "text-white text-xl",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "border-white/10 hover:bg-white/5 text-white transition-all",
                    socialButtonsBlockButtonText: "text-gray-200 font-medium",
                    dividerLine: "bg-white/10",
                    dividerText: "text-gray-400",
                    formFieldLabel: "text-gray-300",
                    formFieldInput: "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all rounded-lg",
                    formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-none hover:shadow-lg hover:shadow-indigo-500/20 transition-all py-3 rounded-xl",
                    footerActionText: "text-gray-400",
                    footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium",
                    formFieldErrorText: "text-rose-400",
                    identityPreviewText: "text-gray-300",
                    identityPreviewEditButtonIcon: "text-indigo-400",
                },
            }}
        />
    );
}
