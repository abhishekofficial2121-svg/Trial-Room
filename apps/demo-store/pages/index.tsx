import { useState } from "react";
import Link from "next/link";

const products = [
  {
    id: "product_001",
    name: "Black Oversized T-Shirt",
    category: "clothing",
    subcategory: "tshirt",
    color: "black",
    price: 29.99,
    image: "/images/products/black-tshirt.jpg",
    variants: [
      { id: "variant_black_s", name: "Black — S" },
      { id: "variant_black_m", name: "Black — M" },
      { id: "variant_black_l", name: "Black — L" },
    ],
  },
  {
    id: "product_002",
    name: "White Button-Down Shirt",
    category: "clothing",
    subcategory: "shirt",
    color: "white",
    price: 49.99,
    image: "/images/products/white-shirt.jpg",
    variants: [
      { id: "variant_white_s", name: "White — S" },
      { id: "variant_white_m", name: "White — M" },
      { id: "variant_white_l", name: "White — L" },
    ],
  },
  {
    id: "product_003",
    name: "Navy Striped T-Shirt",
    category: "clothing",
    subcategory: "tshirt",
    color: "navy",
    price: 34.99,
    image: "/images/products/navy-tshirt.jpg",
    variants: [
      { id: "variant_navy_m", name: "Navy — M" },
      { id: "variant_navy_l", name: "Navy — L" },
    ],
  },
];

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">Trial Room Demo Store</h1>
      <p className="text-center text-gray-600 mb-12">
        Select a garment and try it on with your own photograph.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

function ProductCard({ product }: { product: typeof products[0] }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">{product.color}</span>
      </div>
      <div className="p-6">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-500 text-sm">{product.category} • {product.subcategory}</p>
        <p className="text-gray-900 font-medium mt-2">${product.price.toFixed(2)}</p>

        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-2">
            Variant
          </label>
          <div className="flex gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`px-3 py-1 text-xs rounded border ${
                  selectedVariant.id === v.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            // Placeholder: Trial Room widget integration in Phase 2
            alert(`Trial Room integration: ${product.name} (${selectedVariant.name})`);
          }}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Try It On With Trial Room
        </button>
      </div>
    </article>
  );
}