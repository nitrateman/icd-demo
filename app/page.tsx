export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl text-center flex flex-col gap-8">

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Atlas Suite – FIFA Operations Demo
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          A live, interactive demonstration of Nitrate Gray’s operational
          ecosystem — showing how Atlas Suite empowers real-time situational
          awareness, incident tracking, personnel monitoring, and integrated
          command support for mega-events.
        </p>

        {/* Demo Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
          <a
            href="/demo"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-lg transition"
          >
            Launch Interactive Demo
          </a>

          <a
            href="https://nitrategray.com"
            target="_blank"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium text-lg transition"
          >
            Visit Nitrate Gray
          </a>
        </div>

        {/* Video Placeholder */}
        <div className="mt-10 w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700">
          <span className="text-gray-500">Demo Video Placeholder</span>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-600 mt-6">
          This demo is optimized for mobile, tablet, and large-screen command centers.
        </p>

      </div>
    </main>
  );
}
