export default function MenuLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="h-20 bg-gray-900"></div>

            {/* Hero Skeleton */}
            <div className="bg-gradient-to-br from-gray-900 to-red-900 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="h-16 bg-white/10 rounded-lg mb-4 mx-auto max-w-md animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded mb-8 mx-auto max-w-lg animate-pulse"></div>
                    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-white/10 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters Skeleton */}
            <div className="bg-white shadow-lg py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-12 bg-gray-200 rounded-full mb-6 max-w-md mx-auto animate-pulse"></div>
                    <div className="flex justify-center gap-3 mb-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <div className="h-64 bg-gray-200 animate-pulse"></div>
                                <div className="p-6">
                                    <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4 animate-pulse"></div>
                                    <div className="flex gap-2 mb-4">
                                        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                        <div className="h-12 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}