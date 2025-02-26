import React from 'react';
import { Pencil, Share2, Camera, Sparkles, ChevronRight, Github } from 'lucide-react';
import { Button } from './components/buttons/button';
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-secondary-light text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pencil className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Draw</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="https://github.com/yatharth-singh-panwar/draw" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </a>
                <Button text='Signin' redirectLink='/signin'></Button>
          </div>
      </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          Collaborate and Create
          <span className="text-primary"> Together</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          A powerful and intuitive drawing tool for teams. Create, share, and collaborate on diagrams, wireframes, and more in real-time.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button className="bg-primary hover:bg-primary-dark px-8 py-4 rounded-lg flex items-center space-x-2 transition-colors w-full md:w-auto">
            <span>Start Drawing</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose Draw?</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Share2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Real-time Collaboration</h3>
            <p className="text-gray-300">Work together with your team in real-time, seeing changes instantly as they happen.</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Video Chat</h3>
            <p className="text-gray-300">Communicate seamlessly with integrated video chat for enhanced collaboration.</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Powerful Features</h3>
            <p className="text-gray-300">Advanced tools and features to bring your ideas to life with precision and style.</p>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="rounded-xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=2000&q=80" 
            alt="DrawFlow Interface Preview" 
            className="w-full object-cover"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Pencil className="h-6 w-6 text-primary" />
            <span className="font-semibold">Draw</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;