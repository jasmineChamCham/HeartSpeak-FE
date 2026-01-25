import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Forbidden = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center space-y-5">
                <h1 className="text-9xl font-bold text-gray-900">403</h1>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Access Forbidden</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
                    </p>
                </div>
                <Button asChild className="mt-8">
                    <Link to="/">Return Home</Link>
                </Button>
            </div>
        </div>
    );
};

export default Forbidden;
