import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import { Copy, Download, Share2, QrCode, Loader2, ExternalLink, Send, MessageCircle, Code, Coffee } from "lucide-react";
import { getProfile } from "../../lib/api";

export default function DashboardShare() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        if (data.status) setProfile(data.profile_info);
      } catch (err) {
        console.error("Failed to load profile for sharing:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const profileUrl = profile ? `${window.location.origin}/${profile.creator_url}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setToast({ type: "success", message: "Link copied to clipboard!" });
  };

  const handleCopyWidget = () => {
    const widgetCode = `<a href="${profileUrl}" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: #F5C518; color: #1A1A1A; border: 2px solid #1A1A1A; padding: 12px 24px; border-radius: 12px; font-family: sans-serif; font-weight: 900; text-decoration: none; box-shadow: 4px 4px 0px 0px #1A1A1A;">☕️ Support me on BrewMe</a>`;
    navigator.clipboard.writeText(widgetCode);
    setToast({ type: "success", message: "Widget code copied!" });
  };

  const downloadQR = () => {
    const svg = document.getElementById("brewme-qr");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `BrewMe_QR_${profile?.creator_url}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
    setToast({ type: "success", message: "QR Code downloading..." });
  };

  const shareLinks = [
    { name: "Twitter", icon: Send, color: "hover:bg-[#1DA1F2]", url: `https://twitter.com/intent/tweet?text=Support my work on @BrewMe!&url=${profileUrl}` },
    { name: "Facebook", icon: Share2, color: "hover:bg-[#4267B2]", url: `https://www.facebook.com/sharer/sharer.php?u=${profileUrl}` },
    { name: "WhatsApp", icon: MessageCircle, color: "hover:bg-[#25D366]", url: `https://wa.me/?text=Support my work on BrewMe: ${profileUrl}` },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-brew-text">
        <Loader2 size={40} className="text-brew-yellow animate-spin" strokeWidth={3} />
        <p className="font-inter font-black uppercase tracking-widest text-xs">Generating assets...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up text-brew-text">
      {/* Header (Standardized) */}
      <div className="mb-10">
        <div className="inline-block mb-2 px-3 py-1 border-2 border-brew-text bg-brew-yellow font-inter font-black text-[10px] uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
          Growth
        </div>
        <h1 className="font-inter font-black text-3xl md:text-4xl uppercase tracking-tight mb-1">
          Share Hub
        </h1>
        <p className="font-inter font-bold text-sm opacity-50 max-w-lg">
          Promote your page across social media and in person.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
        
        {/* Left Column: Links and Socials */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8 h-fit">
          
          {/* Main Link Card */}
          <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 md:p-8 shadow-[6px_6px_0px_0px_currentColor]">
            <h3 className="font-inter font-black text-lg uppercase tracking-widest mb-6 flex items-center gap-3 border-b-4 border-brew-text pb-2 inline-block">
              Page Link <Share2 size={20} className="text-brew-yellow" />
            </h3>
            
            <div className="space-y-6">
              <div className="bg-[#fffdf0] border-2 border-brew-text rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-[4px_4px_0px_0px_currentColor]">
                <div className="flex-1 min-w-0 w-full overflow-hidden text-brew-text">
                  <p className="font-inter font-black text-[9px] uppercase tracking-[0.2em] opacity-30 mb-1">Your Unique URL</p>
                  <p className="font-inter font-black text-base md:text-lg truncate text-brew-text/80 tracking-tight">
                    {profileUrl.replace(/^https?:\/\//, "")}
                  </p>
                </div>
                <button 
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-6 py-3 bg-brew-yellow border-2 border-brew-text rounded-xl font-inter font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] active-haptic transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={16} strokeWidth={3} /> Copy
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 py-3 border-2 border-brew-text rounded-xl font-inter font-black text-[10px] uppercase tracking-widest bg-white text-brew-text shadow-[2px_2px_0px_0px_currentColor] transition-all hover:-translate-y-0.5 hover:text-white active-haptic ${link.color}`}
                  >
                    <link.icon size={14} strokeWidth={3} /> {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Embed Widget Card */}
          <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 md:p-8 shadow-[6px_6px_0px_0px_currentColor]">
            <h3 className="font-inter font-black text-lg uppercase tracking-widest mb-6 flex items-center gap-3 border-b-4 border-brew-text pb-2 inline-block">
              Embed Button <Code size={20} className="text-brew-yellow" />
            </h3>
            <p className="font-inter font-bold text-sm text-brew-text/60 mb-6 leading-relaxed">
              Add a professional BrewMe button to your personal website or blog.
            </p>
            
            <div className="bg-[#1A1A1A] text-[#fffdf0] border-2 border-brew-text rounded-2xl p-5 shadow-[4px_4px_0px_0px_#F5C518] relative group">
              <pre className="font-mono text-[10px] sm:text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed opacity-80 pr-12">
                {`<a href="${profileUrl}" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: #F5C518; color: #1A1A1A; border: 2px solid #1A1A1A; padding: 12px 24px; border-radius: 12px; font-family: sans-serif; font-weight: 900; text-decoration: none; box-shadow: 4px 4px 0px 0px #1A1A1A;">☕️ Support me on BrewMe</a>`}
              </pre>
              <button 
                onClick={handleCopyWidget}
                className="absolute top-4 right-4 p-2 bg-brew-yellow border-2 border-brew-text rounded-lg text-brew-text hover:scale-105 active-haptic transition-all shadow-[2px_2px_0px_0px_currentColor]"
                title="Copy Widget Code"
              >
                <Copy size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-grow h-px bg-brew-text/5" />
              <span className="font-inter font-black text-[9px] uppercase tracking-[0.3em] opacity-30">Preview</span>
              <div className="flex-grow h-px bg-brew-text/5" />
            </div>
            
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-[#F5C518] text-[#1A1A1A] border-2 border-[#1A1A1A] px-6 py-3 rounded-xl font-sans font-black text-sm shadow-[4px_4px_0px_0px_#1A1A1A] hover-lift transition-transform">
                <Coffee size={18} strokeWidth={3} /> Support me on BrewMe
              </div>
            </div>
          </div>

          {/* Promotion Guide */}
          <div className="bg-brew-yellow-light/20 border-4 border-brew-text border-dashed rounded-[32px] p-6 md:p-8">
            <h3 className="font-inter font-black text-sm uppercase tracking-[0.3em] mb-4 opacity-40">Pro Tips</h3>
            <ul className="space-y-4 text-brew-text">
              {[
                "Add your link to your Instagram or Twitter bio.",
                "Mention your BrewMe page in your video descriptions.",
                "Pin a post with your link on your social profiles."
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="w-6 h-6 rounded-lg bg-brew-yellow border-2 border-brew-text flex items-center justify-center shrink-0 shadow-[1px_1px_0px_0px_currentColor] font-black text-[10px]">{i+1}</div>
                  <p className="font-inter font-bold text-sm text-brew-text/70">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: QR Code Section */}
        <div className="lg:col-span-5 xl:col-span-4 h-fit">
          <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] text-center">
            <h3 className="font-inter font-black text-lg uppercase tracking-widest mb-8 flex items-center justify-center gap-3 border-b-4 border-brew-text pb-2 inline-block">
              In-House QR <QrCode size={20} className="text-brew-yellow" />
            </h3>
            
            <div className="relative inline-block group mb-8">
              {/* The Brutalist QR Frame (Standardized) */}
              <div className="p-6 bg-white border-4 border-brew-text rounded-[32px] shadow-[8px_8px_0px_0px_#F5C518] relative transition-transform duration-500 hover:rotate-1 hover-lift">
                <QRCodeSVG 
                  id="brewme-qr"
                  value={profileUrl} 
                  size={160}
                  bgColor={"#ffffff"}
                  fgColor={"#1A1A1A"}
                  level={"H"}
                  includeMargin={false}
                  imageSettings={{
                    src: "/icons/icon.svg",
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                />
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-brew-text rounded-tl-lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-brew-text rounded-br-lg" />
              </div>
            </div>

            <p className="font-inter font-bold text-[11px] text-brew-text/50 uppercase tracking-widest mb-6 leading-relaxed">
              Perfect for print, streaming, <br /> and business cards.
            </p>

            <button 
              onClick={downloadQR}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-brew-text text-white border-2 border-brew-text rounded-2xl font-inter font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active-haptic transition-all group"
            >
              <Download size={16} strokeWidth={4} className="text-brew-yellow group-hover:animate-bounce" />
              Download PNG
            </button>
            
            <a 
              href={profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-inter font-black text-[10px] uppercase tracking-widest text-brew-text/40 hover:text-brew-text transition-colors"
            >
              Preview Page <ExternalLink size={12} strokeWidth={3} />
            </a>
          </div>
        </div>

      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
