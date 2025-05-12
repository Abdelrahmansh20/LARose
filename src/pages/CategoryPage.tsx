import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabase/migrations/supabaseClient';

export function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      let query = supabase.from('perfumes').select('*');

      if (category === 'best-selling') {
        query = query.eq('Is_best_seller', true);
      } else if (category === 'men') {
        query = query.eq('Gender', 'men');
      } else if (category === 'women') {
        query = query.eq('Gender', 'women');
      }

      const { data, error } = await query;
      if (!error) {
        setProducts(data);
        setCurrentPage(1); // Reset to first page on category change
      }
      setLoading(false);
    };

    fetchCategoryData();
  }, [category]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // optional: scroll to top
    }
  };

  return (
    <div className="py-12 mt-5 px-4 container mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 capitalize text-brown-800">
        {category.replace('-', ' ')}
      </h1>

      {loading ? (
        <p className="text-center text-brown-600">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-red-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((item) => (
              <div key={item.id} className="p-4 border rounded shadow bg-white">
                <img
                  src={item.Image_url}
                  alt={item.Name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-semibold">{item.Name}</h3>
                <p className="text-sm text-gray-500">{item.Brand}</p>
                <p className="text-lg font-bold">${item.Price}</p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-10 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? 'bg-brown-700 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
