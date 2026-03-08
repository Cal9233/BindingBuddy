export default function Footer() {
  return (
    <footer className="bg-brand-card border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display text-brand-gold font-black text-lg">Binding</span>
            <span className="font-display text-brand-text font-black text-lg">Buddy</span>
            <p className="text-brand-muted text-xs mt-1">
              Custom laser-engraved Pokemon binders, made to order.
            </p>
          </div>
          <p className="text-brand-muted/50 text-xs">
            © {new Date().getFullYear()} Binding Buddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
