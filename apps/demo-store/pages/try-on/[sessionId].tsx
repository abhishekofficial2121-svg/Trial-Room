import { useRouter } from "next/router";

export default function TryOnFlow() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-200 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Trial Room</h2>
        <p className="text-gray-600 mb-6">
          Virtual try-on coming in Phase 2. The API backend is ready — see
          docs/ for the integration contract.
        </p>
        <button
          onClick={handleClose}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Return to Store
        </button>
      </div>
    </div>
  );
}