import { useSearchParams } from "react-router-dom";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("id");

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-green-600">🎉 Order Placed!</h1>

      <p className="mt-3 text-lg text-gray-700">
        Thank you for your purchase.
      </p>

      <p className="mt-2 text-gray-500">
        Your Order ID:
      </p>

      <p className="text-xl font-mono bg-gray-100 px-4 py-2 mt-1 rounded">
        {orderId}
      </p>

      <a
        href="/"
        className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        Back to Home
      </a>
    </div>
  );
}
