'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import MediaLibrary from '@/components/admin/MediaLibrary';

export default function MediaPage() {
  return (
    <AdminLayout>
      <div className="flex h-full flex-col">
        <div className="border-b border-stone-200 bg-white p-4 sm:p-6">
          <h1 className="text-xl sm:text-3xl font-bold text-stone-900">Media Library</h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600">
            Upload and manage images, videos, and documents for your website.
          </p>
        </div>
        <div className="flex-1">
          <MediaLibrary />
        </div>
      </div>
    </AdminLayout>
  );
}
