import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="pt-24 pb-20 min-h-screen bg-beige-50 flex items-center">
      <div className="container text-center">
        <h1 className="font-serif text-6xl text-brown-800 mb-6">404</h1>
        <h2 className="font-serif text-2xl text-brown-700 mb-4">Page Not Found</h2>
        <p className="text-brown-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}