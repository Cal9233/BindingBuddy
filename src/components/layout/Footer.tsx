import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/", label: "Shop" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Custom Order" },
];

export default function Footer() {
  return (
    <footer className="bg-poke-card border-t border-poke-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Image
                src="/images/logo.png"
                alt="Binding Buddy"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              <span className="font-display font-bold text-lg">
                <span className="text-poke-yellow">Binding</span>
                <span className="text-poke-text">Buddy</span>
              </span>
            </div>
            <p className="text-poke-muted text-xs mt-1 max-w-xs">
              Custom laser-engraved Pokemon binders, made to order for serious
              collectors.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-poke-muted">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-poke-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-poke-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-poke-muted/50 text-xs">
            &copy; {new Date().getFullYear()} Binding Buddy. All rights
            reserved.
          </p>
          <p className="text-poke-muted/40 text-xs">
            Not affiliated with The Pok&eacute;mon Company or Nintendo.
          </p>
        </div>
      </div>
    </footer>
  );
}
