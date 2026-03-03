import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-5">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">{t('not_found.title')}</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {t('not_found.message')}
          </p>
        </div>
        <Button asChild className="mt-8">
          <Link to="/">{t('not_found.return_home')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
