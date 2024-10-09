import React, { useState, useEffect, useRef } from 'react';
import { Wrench } from 'lucide-react';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const kitchenParts: KitchenPart[] = [];
    const partCount = 50;
    let mouse = { x: 0, y: 0 };

    class KitchenPart {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      color: string;
      type: string;
      placed: boolean;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.targetX = Math.random() * canvas.width;
        this.targetY = Math.random() * canvas.height;
        this.size = Math.random() * 40 + 20;
        this.color = ['#8B4513', '#D2691E', '#CD853F', '#DEB887'][Math.floor(Math.random() * 4)];
        this.type = ['cabinet', 'drawer', 'countertop', 'handle'][Math.floor(Math.random() * 4)];
        this.placed = false;
      }

      update() {
        if (!this.placed) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            this.x += (this.targetX - this.x) * 0.1;
            this.y += (this.targetY - this.y) * 0.1;

            if (Math.abs(this.x - this.targetX) < 1 && Math.abs(this.y - this.targetY) < 1) {
              this.placed = true;
              setProgress(prev => Math.min(prev + 2, 100));
            }
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        if (this.type === 'cabinet' || this.type === 'drawer') {
          ctx.fillRect(this.x, this.y, this.size, this.size);
        } else if (this.type === 'countertop') {
          ctx.fillRect(this.x, this.y, this.size * 2, this.size / 4);
        } else if (this.type === 'handle') {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size / 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function init() {
      for (let i = 0; i < partCount; i++) {
        kitchenParts.push(new KitchenPart());
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let part of kitchenParts) {
        part.update();
        part.draw(ctx);
      }
      requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setShowComingSoon(true), 1000);
    }
  }, [progress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-amber-300 flex flex-col items-center justify-center relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
      
      <div className="z-10 mb-8">
        <img src="https://images.unsplash.com/photo-1556185781-a47769abb7ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Kitchen Cabinet Logo" className="w-24 h-24 object-cover rounded-full shadow-lg" />
      </div>

      {!showComingSoon ? (
        <div className="z-10 text-center p-8 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-amber-800 mb-4 font-serif">Building Your Dream Kitchen</h2>
          <div className="w-64 h-6 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-4 text-xl text-amber-700 font-sans">Progress: {progress}%</p>
          <div className="mt-4 flex items-center justify-center text-amber-800">
            <Wrench className="mr-2" />
            <span>Move your mouse to build</span>
          </div>
        </div>
      ) : (
        <div className="z-10 text-center p-8 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl animate-fade-in">
          <h1 className="text-6xl font-bold text-amber-800 mb-4 font-serif">Coming Soon</h1>
          <p className="text-xl text-amber-700 mb-8 font-sans">Your perfect kitchen is almost ready!</p>
        </div>
      )}
    </div>
  );
}

export default App;