import React, { useState } from 'react';
import { 
  ShoppingBag, 
  HeartHandshake, 
  Gift, 
  Truck, 
  Flower2, 
  Instagram, 
  Facebook, 
  X,
  Phone,
  ArrowRight,
  Menu,
  Plus,
  Minus,
  MessageCircle
} from 'lucide-react';

// --- Default Data ---
const PRODUCTS = [
  { id: '1', name: 'Mini Tulip Pot', desc: 'Pink pipe cleaner tulips in a cozy handmade pot.', price: 299, category: 'flower-pot', img: 'https://drive.google.com/thumbnail?id=1ssR-b9tp_lbR7L2LrfgqObSTvvdaEFU_&sz=w1000' },
  { id: '2', name: 'Mini Sunflower Pot', desc: 'Bright handcrafted sunflower in a cozy pot.', price: 299, category: 'flower-pot', img: 'https://drive.google.com/thumbnail?id=1nfD6ZqxDODntzwVfSlkC6PmkYQrptWDR&sz=w1000' },
  { id: '3', name: 'Set 01', desc: 'Ribbed lidded jar + round bowl on tray.', price: 180, category: 'gypsum', img: 'https://drive.google.com/thumbnail?id=1Sp8t7nbpm2Of6WcqB0c6vKmtOIRv047u&sz=w1000' },
  { id: '4', name: 'Set 02', desc: 'Ribbed vase + ribbed lidded jar on tray.', price: 280, category: 'gypsum', img: 'https://drive.google.com/thumbnail?id=1WmzFWNk27PwJNFAYJ-NI1P-EgB0NeCaY&sz=w1000' },
  { id: '5', name: 'Set 03', desc: 'Shell shape bowl + ribbed lidded jar on tray.', price: 250, category: 'gypsum', img: 'https://drive.google.com/thumbnail?id=12L5gcxqQ8BiQKIGV_-FG-IldR8fb_q42&sz=w1000' },
  { id: '6', name: 'Set 04', desc: 'Shell shape bowl + ribbed vase on tray.', price: 270, category: 'gypsum', img: 'https://drive.google.com/thumbnail?id=1T5vHx1f0paROCvjj6qokjdzpZ9qLLS0V&sz=w1000' },
  { id: '7', name: 'Set 05', desc: 'Two shell shape bowls on tray.', price: 250, category: 'gypsum', img: 'https://drive.google.com/thumbnail?id=1tbwWxw2M4WMdBHn7GTGOlF5jSsL7BRiG&sz=w1000' },
];

const FEATURES = [
  { id: 1, title: '100% Handmade', desc: 'Crafted with pipe cleaners, heart, and clay', icon: HeartHandshake },
  { id: 2, title: 'Gift Ready', desc: 'Comes in premium, beautiful packaging', icon: Gift },
  { id: 3, title: 'Fast Delivery', desc: 'Inside Dhaka delivery for 80 Tk.', icon: Truck },
  { id: 4, title: 'Forever Bloom', desc: 'No maintenance needed, lasts forever', icon: Flower2 },
];

type CartItem = {
  product: typeof PRODUCTS[0];
  quantity: number;
};

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('dhaka');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [specialRequest, setSpecialRequest] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.product.id === id) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = deliveryZone === 'dhaka' ? 80 : 150;
  
  // Example dummy coupon logic
  const discountAmount = appliedCoupon.toUpperCase() === 'JHURY10' ? Math.floor(cartTotal * 0.1) : 0;
  
  const finalTotal = cartTotal > 0 ? cartTotal - discountAmount + deliveryFee : 0;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) setAppliedCoupon(couponInput.trim());
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    let message = `Hello Jhury Craft! I would like to place an order:%0a%0a`;
    message += `*Customer Info:*%0aName: ${name}%0aPhone: ${phone}%0aAddress: ${address}%0aZone: ${deliveryZone === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}%0aPayment: ${paymentMethod}%0a%0a`;
    message += `*Order Details:*%0a`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.product.name} (${item.product.price} Tk)%0a`;
    });
    
    message += `%0a*Subtotal:* ${cartTotal} Tk%0a`;
    if (discountAmount > 0) {
      message += `*Discount:* -${discountAmount} Tk (${appliedCoupon.toUpperCase()})%0a`;
    }
    message += `*Delivery:* ${deliveryFee} Tk%0a`;
    message += `*Total:* ${finalTotal} Tk%0a`;

    if (specialRequest) {
      message += `%0a*Special Request:* ${specialRequest}%0a`;
    }

    const whatsappUrl = `https://wa.me/8801878900655?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setCart([]);
    setIsCartOpen(false);
    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
    }, 5000);
  };

  const handleQuickOrder = () => {
    if (cart.length === 0) return;
    let message = `Hello Jhury Craft! I would like to quickly order the following items:%0a%0a`;
    cart.forEach(item => {
       message += `- ${item.quantity}x ${item.product.name} (${item.product.price} Tk)%0a`;
    });
    message += `%0a*Total:* ${finalTotal} Tk (including delivery)%0a%0aCan you help me with the order process?`;
    const whatsappUrl = `https://wa.me/8801878900655?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setIsCartOpen(false);
    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
    }, 5000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let message = `Hello, this is ${contactName}.%0a%0aMy Query: ${contactMessage}`;
    const whatsappUrl = `https://wa.me/8801878900655?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setContactName('');
    setContactMessage('');
  };

  return (
    <div className="min-h-screen bg-clay-50 font-sans text-clay-900 flex flex-col pt-16 scroll-smooth">
      
      {/* Order Confirmation Toast */}
      <div 
        className={`fixed top-24 left-1/2 -translate-x-1/2 bg-[#8c2a50] text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-3 transition-all duration-500 ease-out transform ${
          orderConfirmed ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-lg">✅</span>
        <span className="font-medium text-sm tracking-wide">Order sent to WhatsApp!</span>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-clay-50/95 backdrop-blur-md border-b border-clay-200 z-40">
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-1 hover:opacity-60 transition-opacity"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6 text-clay-900" />
            </button>
            <div className="flex items-center gap-2">
              {/* === Logo Placeholder in Navbar === */}
              <img 
                src="https://drive.google.com/thumbnail?id=1xhhZNB2_xH_YS91vtsQEJ9mwJth2oOw6&sz=w1000" 
                alt="Jhury Craft Logo" 
                className="w-8 h-8 rounded-full object-cover border border-clay-200 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block text-[10px] tracking-widest uppercase font-semibold text-clay-800">
                Jhury Craft
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-xs tracking-widest uppercase font-medium">
            <a href="#hero" className="hover:opacity-60 transition-opacity">Home</a>
            <a href="#shop" className="hover:opacity-60 transition-opacity">Shop</a>
            <a href="#about" className="hover:opacity-60 transition-opacity">About</a>
            <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              className="relative p-2 hover:opacity-60 transition-opacity"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5 text-clay-900" strokeWidth={1.5} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-clay-800 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-clay-50 border-b border-clay-200 py-6 px-6 flex flex-col gap-6 text-xs tracking-widest uppercase font-medium z-40">
             <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity block">Home</a>
             <a href="#shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity block">Shop</a>
             <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity block">About</a>
             <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:opacity-60 transition-opacity block">Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="bg-[#FCFAFB] min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-clay-200">
        <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          
          {/* Text Content */}
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full space-y-6 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAE4F5] text-[#7C6CA6] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                <span>✿</span>
                Handmade in Bangladesh
              </div>
              
              <p className="text-[#7C6CA6] text-[10px] sm:text-xs tracking-[0.2em] font-semibold uppercase text-center">
                Finding beauty in the mud
              </p>

              <h1 className="flex flex-col font-serif text-[3.25rem] md:text-[5rem] tracking-tight leading-[1.05] mb-2 text-center">
                <span className="text-[#8c2a50]">Flowers that</span>
                <span className="text-[#D84A6E] italic">never wilt</span>
              </h1>

              <p className="text-[#7C6F82] text-[15px] md:text-base leading-relaxed max-w-sm pt-2 text-center">
                Beautifully handcrafted decor items — the perfect gift that stays in bloom forever.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a href="#shop" className="px-8 py-3 rounded-full bg-[#CF4D72] text-white text-[15px] font-medium hover:bg-[#B54263] transition-colors shadow-sm">
                  Shop Now
                </a>
                <a href="#about" className="px-8 py-3 rounded-full border-2 border-[#F0D5E4] text-[#CF4D72] text-[15px] font-medium hover:bg-[#F0D5E4]/30 transition-colors">
                  Our Story
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="bg-[#8c2a50] text-[10px] md:text-xs font-semibold tracking-widest text-white/90 overflow-hidden py-3 uppercase flex shrink-0 group hover:bg-[#a63460] transition-colors duration-300">
        <div className="animate-marquee flex gap-12 whitespace-nowrap px-6 shrink-0 w-max min-w-max group-hover:opacity-80 group-hover:-translate-y-0.5 transition-all duration-300">
           {[...Array(4)].map((_, i) => (
             <div key={i} className="flex items-center gap-12">
               <span>✿</span>
               <span>Forever In Bloom</span>
               <span>✿</span>
               <span>Perfect Gifts</span>
               <span>✿</span>
               <span>Jhury Craft</span>
               <span>✿</span>
               <span>Handmade With Love</span>
               <span>✿</span>
               <span>80 Tk. Delivery Inside Dhaka</span>
             </div>
           ))}
        </div>
      </div>

      {/* Shop Section */}
      <section id="shop" className="flex-1 py-16 px-6 md:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-[10px] tracking-widest uppercase font-semibold text-clay-800">Our Collection</h2>
        </div>

        {[
          { title: 'Flower Pot', category: 'flower-pot' },
          { title: 'Gypsum Decor Product', category: 'gypsum' }
        ].map(section => (
          <div key={section.category} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
               <h3 className="text-xl font-serif italic text-clay-900">{section.title}</h3>
               <div className="flex-1 h-px bg-clay-200"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {PRODUCTS.filter(p => p.category === section.category).map(product => (
                <div key={product.id} className="group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <div className="aspect-[3/4] bg-white border border-clay-200 mb-3 relative overflow-hidden flex items-center justify-center group-hover:-translate-y-1.5 group-hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-clay-50/10 pointer-events-none"></div>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 border border-clay-200">
                      <span className="text-[9px] uppercase tracking-widest text-clay-800">
                        {product.category === 'gypsum' ? 'Gypsum Decor' : 'Flower Pot'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="text-xs text-clay-800 mt-1 italic">{product.desc}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-base font-semibold">{product.price} Tk.</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                      className="text-[10px] uppercase tracking-widest font-bold bg-clay-900 text-white px-4 py-2.5 rounded-full hover:bg-black transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Coming Soon */}
        <div className="text-center mt-12 py-12 bg-clay-100 rounded-2xl border border-clay-200">
           <h3 className="font-serif italic text-xl md:text-2xl text-clay-900/60">Unique candle items soon... 🕯️</h3>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-clay-50 border-t border-clay-200">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="font-serif text-3xl italic">About Jhury Craft</h2>
          <div className="w-8 h-px bg-clay-200 mx-auto"></div>
          <p className="text-sm text-clay-800 leading-wider max-w-2xl mx-auto font-light">
            We believe in finding beauty in the mud. Nestled in Dhaka, Bangladesh, Jhury Craft was born out of a love for tactile artistry and timeless design. Every single piece—from our textured clay vases to our delicate pipe cleaner flowers—is poured over with care, heart, and creativity.
          </p>
        </div>
      </section>

      {/* Why Jhury Craft Section */}
      <section className="bg-[#e9e4f0] py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <h2 className="font-serif text-3xl md:text-4xl text-[#8c2a50]">Why Jhury Craft?</h2>
             <div className="w-16 h-[2px] bg-[#8c2a50]/40 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
               <span className="text-3xl mb-4 block">👋</span>
               <h3 className="font-serif text-lg text-[#8c2a50] mb-2">100% Handmade</h3>
               <p className="text-[13px] font-light text-clay-800 leading-relaxed">Every flower crafted by hand with care and attention to detail.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
               <span className="text-3xl mb-4 block">🎁</span>
               <h3 className="font-serif text-lg text-[#8c2a50] mb-2">Gift Ready</h3>
               <p className="text-[13px] font-light text-clay-800 leading-relaxed">Beautifully packaged — ready to give to someone special.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
               <span className="text-3xl mb-4 block">🚚</span>
               <h3 className="font-serif text-lg text-[#8c2a50] mb-2">Fast Delivery</h3>
               <p className="text-[13px] font-light text-clay-800 leading-relaxed">80 Tk. delivery inside Dhaka. Quick and safe packaging.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
               <span className="text-3xl mb-4 block">✨</span>
               <h3 className="font-serif text-lg text-[#8c2a50] mb-2">Forever Bloom</h3>
               <p className="text-[13px] font-light text-clay-800 leading-relaxed">No watering needed — these flowers last a lifetime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section / Footer */}
      <section id="contact" className="py-20 bg-[#8c2a50] text-white selection:bg-white/20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="font-serif text-4xl text-white">Order yours today 🌸</h2>
            <p className="text-sm text-white/90 font-light">Reach out on any platform — we'd love to hear from you!</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
             <a href="https://wa.me/8801878900655" className="p-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2 group">
                <span className="text-xl">📱</span>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-semibold mb-0.5">WhatsApp</p>
                  <p className="text-xs font-medium">+880 1878-900655</p>
                </div>
             </a>
             <a href="https://www.facebook.com/jhurycrafts" className="p-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2 group">
                <span className="text-xl">📘</span>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-semibold mb-0.5">Facebook</p>
                  <p className="text-xs font-medium">Jhury Crafts</p>
                </div>
             </a>
             <a href="https://www.instagram.com/jhurycraft/" className="p-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2 group">
                <span className="text-xl">📸</span>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-semibold mb-0.5">Instagram</p>
                  <p className="text-xs font-medium">@jhurycraft</p>
                </div>
             </a>
             <div className="p-4 rounded-xl border border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2">
                <span className="text-xl">📍</span>
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-semibold mb-0.5">Location</p>
                  <p className="text-xs font-medium">Dhaka, Bangladesh</p>
                </div>
             </div>
          </div>
          
          <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto space-y-4 text-left">
            <div>
              <input 
                required 
                type="text" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-all text-sm"
              />
            </div>
            <div>
              <input 
                type="tel" 
                placeholder="Your phone number"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-all text-sm"
              />
            </div>
            <div>
               <select className="w-full px-4 py-3 bg-[#9b3a5e] border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/50 transition-all text-sm appearance-none cursor-pointer">
                  <option value="">Select a product</option>
                  {PRODUCTS.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
               </select>
            </div>
            <div>
              <textarea 
                required 
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-all text-sm resize-none"
                placeholder="Any special request or message..."
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-white text-[#8c2a50] py-3.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors mt-2"
            >
              Send via WhatsApp 📱
            </button>
          </form>
        </div>
      </section>

      {/* Copyright */}
      <footer className="py-4 bg-[#6c1e3d] text-center text-white/50 text-xs">
        <p>© {new Date().getFullYear()} Jhury Craft. All rights reserved.</p>
      </footer>

      {/* Product Details Modal Overlay */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-clay-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 md:p-6 transition-opacity"
          onClick={() => setSelectedProduct(null)}
        >
          {/* Product Modal Content */}
          <div 
            className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-white/50 backdrop-blur text-clay-900 hover:bg-clay-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-white aspect-square md:aspect-auto relative">
              <img 
                src={selectedProduct.img} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Details Section */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
              <div>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#8c2a50] font-semibold mb-2 block">
                  {selectedProduct.category === 'gypsum' ? 'Gypsum Decor' : 'Flower Pot'}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif italic text-clay-900 mb-2">
                  {selectedProduct.name}
                </h2>
                <p className="text-xl md:text-2xl font-medium text-clay-800 mb-6">
                  {selectedProduct.price} ৳
                </p>
                <div className="h-px w-full bg-clay-200 mb-6"></div>
              </div>
              
              <div className="flex-1">
                <h4 className="text-[11px] uppercase tracking-widest text-clay-800 font-semibold mb-3">Description</h4>
                <p className="text-clay-700 leading-relaxed text-sm">
                  {selectedProduct.desc}
                </p>
                
                <h4 className="text-[11px] uppercase tracking-widest text-clay-800 font-semibold mt-8 mb-3">Details & Features</h4>
                <ul className="space-y-2 text-sm text-clay-700 list-disc list-inside">
                  {selectedProduct.category === 'flower-pot' ? (
                    <>
                      <li>100% Handmade with pipe cleaners</li>
                      <li>Includes a cozy handmade pot</li>
                      <li>Never wilts, forever bloom</li>
                    </>
                  ) : (
                    <>
                      <li>Hand-poured gypsum craft</li>
                      <li>Minimalist and aesthetic design</li>
                      <li>Perfect for home or office setups</li>
                    </>
                  )}
                  <li>Carefully packaged, ready for gifting</li>
                </ul>
              </div>
              
              <div className="mt-8 pt-6 border-t border-clay-200">
                <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-[#8c2a50] text-white py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-semibold rounded-xl hover:bg-[#6c1e3d] transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-clay-900/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-clay-200 flex items-center justify-between bg-clay-50/50">
          <h2 className="font-serif text-2xl italic tracking-tight">Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:opacity-60 transition-opacity"
          >
            <X className="w-5 h-5 text-clay-900" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-clay-800 gap-4 opacity-50">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              <p className="text-xs uppercase tracking-widest font-medium">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border border-clay-200 p-3 bg-white">
                    <img 
                      src={item.product.img} 
                      alt={item.product.name} 
                      className="w-20 h-20 object-cover bg-clay-100 mb-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                      <p className="text-clay-900 font-semibold mt-1 text-sm">{item.product.price} ৳</p>
                      <div className="flex items-center justify-between mt-3 text-xs uppercase tracking-widest font-medium text-clay-800">
                        <div className="flex items-center gap-3 border border-clay-200 px-2 py-1 bg-white">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="hover:text-clay-900 transition-colors">
                            <Minus className="w-3 h-3" strokeWidth={2.5} />
                          </button>
                          <span className="w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="hover:text-clay-900 transition-colors">
                            <Plus className="w-3 h-3" strokeWidth={2.5} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="hover:opacity-60 border-b border-clay-800 pb-0.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 border-t border-clay-200 pt-6">
                <h3 className="font-medium text-[10px] uppercase tracking-widest text-clay-800 border-b border-clay-200 pb-2 mb-4">Shipping Details</h3>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-clay-800 mb-1">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-clay-200 text-sm bg-white focus:outline-none focus:border-clay-900 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-clay-800 mb-1">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-clay-200 text-sm bg-white focus:outline-none focus:border-clay-900 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-clay-800 mb-1">Delivery Zone</label>
                   <select 
                     value={deliveryZone}
                     onChange={(e) => setDeliveryZone(e.target.value)}
                     className="w-full px-3 py-2 border border-clay-200 text-sm bg-white focus:outline-none focus:border-clay-900 transition-all font-medium appearance-none"
                   >
                     <option value="dhaka">Inside Dhaka (80 ৳)</option>
                     <option value="outside">Outside Dhaka (150 ৳)</option>
                   </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-clay-800 mb-1">Delivery Address</label>
                  <textarea 
                    required 
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-clay-200 text-sm bg-white focus:outline-none focus:border-clay-900 transition-all font-medium resize-none"
                  />
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest text-clay-800 mb-1">Special Request (Optional)</label>
                  <input 
                    type="text" 
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="w-full px-3 py-2 border border-clay-200 text-sm bg-white focus:outline-none focus:border-clay-900 transition-all font-medium"
                  />
                </div>
                <div>
                   <label className="block text-[10px] uppercase tracking-widest text-clay-800 mb-1">Payment Method</label>
                   <select 
                     value={paymentMethod}
                     onChange={(e) => setPaymentMethod(e.target.value)}
                     className="w-full px-3 py-2 border border-clay-200 text-sm bg-white focus:outline-none focus:border-clay-900 transition-all font-medium appearance-none"
                   >
                     <option value="Cash on Delivery">Cash on Delivery</option>
                     <option value="bKash / Nagad">Mobile Banking (bKash / Nagad)</option>
                   </select>
                </div>
              </form>

              <div className="space-y-4 border-t border-clay-200 pt-6">
                <h3 className="font-medium text-[10px] uppercase tracking-widest text-clay-800 border-b border-clay-200 pb-2 mb-4">Discount Code</h3>
                <form className="flex gap-2" onSubmit={handleApplyCoupon}>
                  <input 
                    type="text" 
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-clay-200 text-sm bg-white focus:outline-none focus:border-clay-900 transition-all font-medium uppercase"
                  />
                  <button 
                    type="submit"
                    className="px-4 bg-clay-900 text-white rounded-md text-[10px] uppercase tracking-widest font-semibold hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {appliedCoupon && discountAmount > 0 && (
                  <p className="text-xs text-green-600 font-medium tracking-wide">
                    Coupon '{appliedCoupon}' applied (-{discountAmount} ৳)
                  </p>
                )}
                {appliedCoupon && discountAmount === 0 && (
                  <p className="text-xs text-red-500 font-medium tracking-wide">
                    Invalid coupon code
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-clay-200 bg-clay-50/50">
            <div className="space-y-2 mb-6 text-xs tracking-widest uppercase font-medium">
              <div className="flex justify-between text-clay-800">
                <span>Subtotal</span>
                <span>{cartTotal} ৳</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{discountAmount} ৳</span>
                </div>
              )}
              <div className="flex justify-between text-clay-800">
                <span>Shipping ({deliveryZone === 'dhaka' ? 'Dhaka' : 'Outside'})</span>
                <span>{deliveryFee} ৳</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-4 border-t border-clay-200 text-clay-900">
                <span>Total</span>
                <span>{finalTotal} ৳</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-clay-900 text-white py-3 rounded-full text-[10px] uppercase tracking-widest font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-sm pointer-events-auto"
              >
                Checkout on WhatsApp
              </button>
              
              <button 
                onClick={handleQuickOrder}
                className="w-full bg-[#25D366] text-white py-3 rounded-full text-[10px] uppercase tracking-widest font-semibold hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Quick Custom Order
              </button>
            </div>
            <p className="text-center text-[9px] uppercase tracking-widest text-clay-800 mt-4 flex items-center justify-center gap-1">
              You will be redirected
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

