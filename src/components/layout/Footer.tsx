import Link from "next/link";

export default function Footer() {
  const footerLinks = [
    { name: "Robot", href: "/robot" },
    { name: "Intelligence", href: "/intelligence" },
    { name: "Solutions", href: "/solutions" },
    { name: "Technology", href: "/technology" },
    { name: "Fleet", href: "/fleet" },
    { name: "Research", href: "/research" },
    { name: "Company", href: "/company" },
  ];

  const socialLinks = [
    { name: "LinkedIn", href: "#" },
    { name: "X", href: "#" },
    { name: "YouTube", href: "#" },
  ];

  return (
    <footer className="bg-[#050505] border-t border-white/5 py-20">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-12">
        <div className="flex flex-col gap-6">
          <Link href="/" className="text-2xl font-bold tracking-widest text-white uppercase flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-sm"></div>
            Nova Robotics
          </Link>
          <p className="text-gray-500 max-w-sm text-sm">
            Humanoid intelligence designed for the physical world. Intelligence, Built to Move.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-2">Navigation</h4>
            {footerLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-gray-500 hover:text-white transition-colors text-sm">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-2">Social</h4>
            {socialLinks.map((link) => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} NOVA ROBOTICS. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
