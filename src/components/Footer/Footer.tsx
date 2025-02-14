export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/10 to-transparent">
      <div className="max-w-md mx-auto flex items-center justify-between text-sm text-white/80">
        <a 
          href="https://noeosorio.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          Made by @noeosorio
        </a>
        <a
          href="https://buymeacoffee.com/noeosorio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-[#FFDD00] text-[#000000] px-3 py-1 rounded-lg hover:bg-[#FFDD00]/90 transition-all hover:scale-105"
        >
          <span>☕️</span>
          <span className="font-medium">Buy me a coffee</span>
        </a>
      </div>
    </footer>
  )
} 