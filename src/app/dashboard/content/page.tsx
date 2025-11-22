export const metadata = { title: 'Website Content | Dashboard' };

export default function ContentPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Website Content</h1>
        <p className="text-sm text-stone-600 mt-1">
          Edit your website content and pages
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 sm:p-12 shadow-sm text-center">
        <div className="text-4xl sm:text-6xl mb-4">🚧</div>
        <h2 className="text-lg sm:text-xl font-semibold text-stone-900 mb-2">Coming Soon</h2>
        <p className="text-sm sm:text-base text-stone-600">
          Content management features are under development.
        </p>
      </div>
    </div>
  );
}
