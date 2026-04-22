"use client";

export default function Cart({
  cart,
  removeFromCart,
  checkoutCart,
}: any) {
  const total = cart.reduce((sum: number, i: any) => sum + i.total, 0);

  return (
    <div className="w-80 fixed right-0 top-0 h-screen bg-black/90 border-l border-cyan-500/20 p-4 text-white flex flex-col">

      <h2 className="text-cyan-300 text-lg mb-4">🛒 Cart</h2>

      <div className="flex-1 overflow-y-auto space-y-3">

        {cart.length === 0 && (
          <p className="text-gray-400 text-sm">Cart is empty</p>
        )}

        {cart.map((item: any) => (
          <div
            key={item.id}
            className="p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-400">
              {item.quantity} × ${item.price}
            </p>
            <p className="text-cyan-300 text-sm">${item.total}</p>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-400 text-xs mt-1"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-3">
        <p className="text-green-400 mb-2">
          Total: ${total}
        </p>

        <button
          onClick={checkoutCart}
          disabled={cart.length === 0}
          className="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl disabled:opacity-40"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}