import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-luxury-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-luxury-gold">
              Luxora
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Curating luxury fashion for the discerning individual. 
              Experience elegance, sophistication, and timeless style.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-luxury-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-luxury-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-luxury-gold transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Collections</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/collection/women"
                  className="text-gray-300 hover:text-luxury-gold transition-colors text-sm"
                >
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link
                  to="/collection/men"
                  className="text-gray-300 hover:text-luxury-gold transition-colors text-sm"
                >
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link
                  to="/collection/kids"
                  className="text-gray-300 hover:text-luxury-gold transition-colors text-sm"
                >
                  Kids' Fashion
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className="text-gray-300 hover:text-luxury-gold transition-colors text-sm"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Customer Care</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-luxury-gold transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-300 hover:text-luxury-gold transition-colors text-sm"
                >
                  Shipping Info
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/returns"
                  className="text-gray-300 hover:text-luxury-gold transition-colors text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li> */}
              <li>
                <Link
                  to="/size-guide"
                  className="text-gray-300 hover:text-luxury-gold transition-colors text-sm"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-luxury-gold" />
                <span className="text-gray-300 text-sm">hello@luxora.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-luxury-gold" />
                <span className="text-gray-300 text-sm">+254 7123-45678</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-luxury-gold mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Luxury Avenue<br />
                  Nairobi Kenya, Kileleshwa 
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Luxora Boutique. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-luxury-gold transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-luxury-gold transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-gray-400 hover:text-luxury-gold transition-colors text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;