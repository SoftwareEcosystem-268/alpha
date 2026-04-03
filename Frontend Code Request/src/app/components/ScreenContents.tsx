export function LoginScreen() {
  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="w-8 h-8 rounded-full bg-gray-300 mt-4"></div>
      <div className="w-full space-y-1 px-1">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-6 bg-blue-500 rounded mt-2"></div>
      </div>
    </div>
  );
}

export function ForgotPassScreen() {
  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="w-8 h-8 rounded-full bg-gray-300 mt-4"></div>
      <div className="w-full space-y-1 px-1">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-6 bg-blue-500 rounded mt-2"></div>
      </div>
    </div>
  );
}

export function SignupScreen() {
  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="w-8 h-8 rounded-full bg-gray-300 mt-4"></div>
      <div className="w-full space-y-1 px-1">
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-full h-3 bg-gray-200 rounded"></div>
        <div className="w-full h-6 bg-blue-500 rounded mt-2"></div>
      </div>
    </div>
  );
}

export function PrivacyScreen() {
  return (
    <div className="flex flex-col h-full p-1">
      <div className="w-full h-3 bg-gray-800 rounded mb-2"></div>
      <div className="space-y-1">
        <div className="w-full h-2 bg-gray-200 rounded"></div>
        <div className="w-full h-2 bg-gray-200 rounded"></div>
        <div className="w-full h-2 bg-gray-200 rounded"></div>
        <div className="w-full h-2 bg-gray-200 rounded"></div>
        <div className="w-full h-2 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function DealSearchScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-6 bg-blue-500"></div>
      <div className="p-1 space-y-1 flex-1">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="space-y-1 mt-2">
          <div className="w-full h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">50%</div>
          <div className="w-full h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">40%</div>
          <div className="w-full h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs">30%</div>
        </div>
      </div>
    </div>
  );
}

export function LocationDealsScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-6 bg-blue-500"></div>
      <div className="p-1 flex-1 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-gray-900 rounded"></div>
        <div className="w-full h-3 bg-blue-500 rounded mt-2"></div>
      </div>
    </div>
  );
}

export function QRCodeScreen() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="w-16 h-16 bg-gray-900 rounded grid grid-cols-3 gap-0.5 p-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white"></div>
        ))}
      </div>
    </div>
  );
}

export function FavoritesScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-6 bg-blue-500"></div>
      <div className="p-1 space-y-1 flex-1">
        <div className="w-full h-10 bg-red-500 rounded flex items-center justify-center text-white text-xs">DEAL</div>
        <div className="w-full h-10 bg-red-500 rounded flex items-center justify-center text-white text-xs">DEAL</div>
        <div className="w-full h-10 bg-red-500 rounded flex items-center justify-center text-white text-xs">DEAL</div>
      </div>
    </div>
  );
}

export function SavingsTrackerScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-6 bg-blue-500"></div>
      <div className="p-1 flex-1 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 flex items-center justify-center">
          <span className="text-xs">$</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded mt-2"></div>
      </div>
    </div>
  );
}

export function ProfileScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="w-full h-6 bg-blue-500"></div>
      <div className="p-1 flex-1 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gray-300 mt-2"></div>
        <div className="w-full space-y-1 mt-2">
          <div className="w-full h-3 bg-gray-200 rounded"></div>
          <div className="w-full h-3 bg-gray-200 rounded"></div>
          <div className="w-full h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function SuccessScreen() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl">
        ✓
      </div>
    </div>
  );
}
