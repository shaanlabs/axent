import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SignUp } from '@clerk/clerk-react';

export function SignUpPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* macOS-style Auth Card Container */}
            <div className="w-full max-w-md">
                {/* Toolbar */}
                <div className="toolbar mb-6" style={{ position: 'relative', background: 'var(--surface)' }}>
                    <Link to="/" className="list-item" style={{ width: 'auto', padding: '0 12px', height: '32px' }}>
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back</span>
                    </Link>
                    <div className="toolbar-title mx-auto">
                        A<span style={{ color: 'var(--primary)' }}>X</span>ENT
                    </div>
                </div>

                {/* Clerk SignUp Component */}
                <div className="flex justify-center flex-col items-center">
                    <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" forceRedirectUrl="/role-selection" />
                </div>
            </div>
        </div>
    );
}
