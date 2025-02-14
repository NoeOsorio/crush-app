export function Footer() {
  return (
    <footer className="w-full p-4 mt-auto bg-gradient-to-t from-black/30 via-black/20 to-transparent">
      <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white">
        <a 
          href="https://noeosorio.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white/80 transition-colors"
        >
          Made by @noeosorio
        </a>
        <a
          href="https://buymeacoffee.com/noeosorio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-[#FFDD00] text-[#000000] px-3 py-1.5 rounded-lg hover:bg-[#FFDD00]/90 transition-all hover:scale-105 shadow-md"
        >
          <span>☕️</span>
          <span className="font-medium">Buy me a coffee</span>
        </a>
      </div>
    </footer>
  )
} 