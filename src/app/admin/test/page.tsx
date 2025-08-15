export default function AdminTestPage() {
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Admin Test Page</h1>
        <p className="text-xl text-blue-700">If you can see this, admin routes are working!</p>
        <div className="mt-8">
          <a 
            href="/admin/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Admin Login
          </a>
        </div>
      </div>
    </div>
  )
}



