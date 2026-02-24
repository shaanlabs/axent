import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SignUp } from '@clerk/clerk-react';

export function SignUpPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* macOS-style Auth Card Container */}
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 p-4 bg-surface rounded-xl border border-border">
                    <Link to="/" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <div className="text-lg font-bold">
                        A<span className="text-primary">X</span>ENT
                    </div>
                    <div className="w-16"></div> {/* Spacer for centering */}
                </div>

                {/* Clerk SignUp Component */}
                <div className="flex justify-center flex-col items-center">
                    <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/role-selection" />
                </div>
            </div>
        </div>
    );
}
