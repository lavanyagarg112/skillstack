export default function Footer() {
  return (
    <footer className="py-6 text-center border-t text-gray-600 text-sm">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} SkillStack. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="/terms" className="hover:text-purple-600 transition-colors">
            Terms
          </a>
          <a
            href="/privacy"
            className="hover:text-purple-600 transition-colors"
          >
            Privacy
          </a>
          <a
            href="/contact"
            className="hover:text-purple-600 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
