import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
}

const items: CarouselItem[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=800', title: 'Éclat Naturel' },
  { id: 2, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800', title: 'Soin Intense' },
  { id: 3, image: 'https://images.unsplash.com/photo-1512496011212-323a784629c7?q=80&w=800', title: 'Regard Captivant' },
  { id: 4, image: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=800', title: 'Lèvres Velours' },
  { id: 5, image: 'https://images.unsplash.com/photo-1512207128-52591706248d?q=80&w=800', title: 'Teint Parfait' },
];

export default function ThreeDCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden bg-black py-20">
      <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent opacity-50"></div>
      
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center perspective-[1000px]">
        <AnimatePresence initial={false} custom={direction}>
          {items.map((item, i) => {
            const offset = (i - index + items.length) % items.length;
            const isCenter = offset === 0;
            const isLeft = offset === items.length - 1;
            const isRight = offset === 1;
            
            if (!isCenter && !isLeft && !isRight) return null;

            let x = 0;
            let z = 0;
            let rotateY = 0;
            let opacity = 0;
            let scale = 0.8;

            if (isCenter) {
              x = 0;
              z = 0;
              rotateY = 0;
              opacity = 1;
              scale = 1;
            } else if (isLeft) {
              x = -300;
              z = -200;
              rotateY = 45;
              opacity = 0.4;
              scale = 0.8;
            } else if (isRight) {
              x = 300;
              z = -200;
              rotateY = -45;
              opacity = 0.4;
              scale = 0.8;
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.5, x: direction > 0 ? 500 : -500 }}
                animate={{ 
                  x, 
                  z, 
                  rotateY, 
                  opacity, 
                  scale,
                  zIndex: isCenter ? 10 : 5
                }}
                exit={{ opacity: 0, scale: 0.5, x: direction > 0 ? -500 : 500 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-[300px] md:w-[400px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer group"
                style={{ 
                  transformStyle: 'preserve-3d',
                  WebkitBoxReflect: 'below 10px linear-gradient(transparent, rgba(0,0,0,0.2))'
                }}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <motion.h3 
                    animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 20 }}
                    className="text-2xl font-serif tracking-widest text-white"
                  >
                    {item.title}
                  </motion.h3>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-8 z-20">
          <button 
            onClick={prev}
            className="p-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next}
            className="p-4 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
