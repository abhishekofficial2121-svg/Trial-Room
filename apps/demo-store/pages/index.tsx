import Link from "next/link";

const products = [
  {
    id: "product_001",
    name: "Black Oversized T-Shirt",
    category: "clothing",
    subcategory: "tshirt",
    color: "black",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
  },
  {
    id: "product_002",
    name: "White Button-Down Shirt",
    category: "clothing",
    subcategory: "shirt",
    color: "white",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e3b47b1a4?w=600&h=800&fit=crop",
  },
  {
    id: "product_003",
    name: "Navy Striped T-Shirt",
    category: "clothing",
    subcategory: "tshirt",
    color: "navy",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1585573704707-27222513e49a?w=600&h=800&fit=crop",
  },
];

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Trial Room</h1>
        <p className="text-gray-600 text-lg">
          Virtual try-on for ecommerce — see yourself wearing the products you love.
        </p>
        <p className="text-sm text-gray-400 mt-2">Demo Mode • Founder Demonstration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <article
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="h-64 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <span className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium uppercase">
                {product.color}
              </span>
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500 text-sm">
                {product.category} • {product.subcategory}
              </p>
              <p className="text-gray-900 font-medium mt-2">${product.price.toFixed(2)}</p>
              <Link
                href={`/product/${product.id}`}
                className="mt-6 block py-3 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition"
              >
                View Product →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-200 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">How it works</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          1. Select a garment from our demo catalog
          2. Click "View Product" then "Try It On With Trial Room"
          3. Upload your photograph (adult confirmation required)
          4. See your AI-generated virtual try-on result
          5. Images are temporarily processed and deleted after your session
        </p>
      </div>
    </main>
  );
}