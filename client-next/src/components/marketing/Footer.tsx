export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-5 w-5 rounded bg-indigo-600" />
          <span className="text-sm font-semibold">Digital Housing</span>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-gray-700">
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600">How it works</a>
          <a href="#testimonials" className="hover:text-indigo-600">Testimonials</a>
          <a href="#cta" className="hover:text-indigo-600">Get started</a>
        </nav>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Digital Housing. All rights reserved.
        </p>
      </div>
    </footer>
  );
}