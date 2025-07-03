import Image from "next/image";
import SearchCard from "./components/SearchCard";
import BackgroundImage from "./components/BackgroundImage";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <BackgroundImage />
      
      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📚</span>
            </div>
            <h1 className="text-xl font-semibold text-white">TPL Search</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl">
            {/* Hero Text */}
            <div className="text-center mb-12">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Discover your next
                <br />
                <span className="text-blue-200">great read</span>
              </h2>
              <p className="text-xl text-blue-100 max-w-lg mx-auto leading-relaxed">
                Search the Toronto Public Library collection with lightning speed and beautiful results
              </p>
            </div>

            {/* Search Card */}
            <SearchCard />
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-blue-200 text-sm">
            Powered by Toronto Public Library • Made with ❤️ for book lovers
          </p>
        </footer>
      </div>
    </div>
  );
}
