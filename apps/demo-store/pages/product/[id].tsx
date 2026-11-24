import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const PRODUCTS: Record<string, any> = {
  product_001: {
    id: "product_001",
    name: "Black Oversized T-Shirt",
    category: "clothing",
    subcategory: "tshirt",
    color: "black",
    price: 29.99,
    image: "https://placehold.co/600x800/000000/ffffff?text=Black+Oversized+T-Shirt",
    variants: [
      { id: "variant_black_s", name: "Black — S" },
      { id: "variant_black_m", name: "Black — M" },
      { id: "variant_black_l", name: "Black — L" },
    ],
  },
  product_002: {
    id: "product_002",
    name: "White Button-Down Shirt",
    category: "clothing",
    subcategory: "shirt",
    color: "white",
    price: 49.99,
    image: "https://placehold.co/600x800/ffffff/000000?text=White+Button-Down+Shirt",
    variants: [
      { id: "variant_white_s", name: "White — S" },
      { id: "variant_white_m", name: "White — M" },
      { id: "variant_white_l", name: "White — L" },
    ],
  },
  product_003: {
    id: "product_003",
    name: "Navy Striped T-Shirt",
    category: "clothing",
    subcategory: "tshirt",
    color: "navy",
    price: 34.99,
    image: "https://placehold.co/600x800/000080/ffffff?text=Navy+Striped+T-Shirt",
    variants: [
      { id: "variant_navy_m", name: "Navy — M" },
      { id: "variant_navy_l", name: "Navy — L" },
    ],
  },
};

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const product = PRODUCTS[id as string] || PRODUCTS.product_001;
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      router.push(`/try-on/${sessionId}`);
    }
  }, [sessionId, router]);

  const handleTryOn = async () => {
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: "merchant_demo",
          product_id: product.id,
          variant_id: selectedVariant.id,
        }),
      });
      const data = await res.json();
      if (data.session_id) {
        setSessionId(data.session_id);
      } else {
        alert("Failed to create session: " + (data.error?.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create session. Please try again.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to store
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover rounded-xl border border-gray-200"
              loading="eager"
            />
            <span className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium uppercase">
              {product.color}
            </span>
          </div>
          <div className="flex gap-2 mt-4">
            {product.variants.map((v: any) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  selectedVariant.id === v.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <span className="text-[10px]">{v.name.split(" ").pop()}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-500 text-sm">
                {product.category} • {product.subcategory} • {product.color}
              </p>
            </div>
            <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 mb-2">Variant</label>
            <div className="flex gap-3">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm ${
                    selectedVariant.id === v.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleTryOn}
            disabled={!!sessionId}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition mb-4"
          >
            {sessionId ? "Opening Trial Room..." : "Try It On With Trial Room"}
          </button>

          <div className="text-sm text-gray-500 space-y-1">
            <p>• Virtual try-on with your own photograph</p>
            <p>• Front view result</p>
            <p>• Temporary image processing — deleted after session</p>
          </div>
        </div>
      </div>
    </main>
  );
}