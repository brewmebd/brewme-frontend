import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Coffee, ArrowRight, Heart, Send, MessageCircle } from "lucide-react";
import Button from "../components/Button";
import confetti from "canvas-confetti";

export default function SupportSuccessPage() {
  const [searchParams] = useSearchParams();
  const creator = searchParams.get("creator") || "the creator";
  const amount = searchParams.get("amount") || "5.00";

  const shareText = `I just supported ${creator} on @BrewMe! ☕️ Check out their work:`;
  const shareUrl = window.location.origin + "/" + (searchParams.get("slug") || "");

  useEffect(() => {
    // 🎉 Professional Confetti Burst
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start them a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[90vh] bg-[#fffdf0] flex items-center justify-center p-6 text-brew-text">
      <div className="max-w-xl w-full text-center animate-fade-up">
        {/* Celebration Icon */}
        <div className="relative inline-block mb-10">
          <div className="w-24 h-24 bg-brew-yellow border-4 border-brew-text rounded-[32px] flex items-center justify-center shadow-[8px_8px_0px_0px_currentColor] animate-bounce">
            <Coffee size={40} strokeWidth={3} />
          </div>
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-white border-2 border-brew-text rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_currentColor] animate-pulse">
            <Heart size={20} className="text-red-500 fill-red-500" />
          </div>
        </div>

        <h1 className="font-space font-black text-4xl md:text-6xl uppercase tracking-tight mb-4 leading-none">
          You're Awesome!
        </h1>
        <p className="font-inter font-bold text-lg text-brew-text/70 mb-10 leading-relaxed">
          Your contribution of <span className="text-brew-text font-black">${amount}</span> has been sent. 
          You've just fueled the creativity of <span className="text-brew-text font-black">{creator}</span>.
        </p>

        {/* Share Section */}
        <div className="bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[10px_10px_0px_0px_currentColor] mb-12">
          <p className="font-inter font-black text-xs uppercase tracking-widest mb-6 opacity-40">Spread the word</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1DA1F2] text-white border-2 border-brew-text rounded-2xl font-inter font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none transition-all"
            >
              <Send size={16} /> Twitter
            </a>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white border-2 border-brew-text rounded-2xl font-inter font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none transition-all"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to={`/${searchParams.get("slug") || ""}`}
            className="font-inter font-black text-sm uppercase tracking-widest text-brew-text underline decoration-4 underline-offset-8 hover:text-brew-yellow-hover transition-colors"
          >
            Back to profile
          </Link>
          <Link 
            to="/explore"
            className="flex items-center gap-2 px-8 py-4 bg-brew-yellow border-2 border-brew-text rounded-2xl font-inter font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all no-underline text-brew-text"
          >
            Explore more <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>
      </div>
    </div>
  );
}
