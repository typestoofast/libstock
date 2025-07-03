export default function SearchResults({ results, recommendations, query, error }) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Search Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Library Search Results */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            Library Results for &quot;{query}&quot;
          </h2>
          <p className="text-blue-100 text-sm">
            {results?.total || 0} items found in Toronto Public Library
          </p>
        </div>

        <div className="p-6">
          {results?.results?.length > 0 ? (
            <div className="space-y-4">
              {results.results.map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Results Found</h3>
              <p className="text-gray-500">
                No books found matching &quot;{query}&quot;. Try different keywords or check the spelling.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations?.recommendations?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              You May Like
            </h2>
            <p className="text-purple-100 text-sm">
              AI-powered recommendations based on your search
            </p>
          </div>

          <div className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.recommendations.map((book, index) => (
                <RecommendationCard key={index} book={book} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookCard({ book }) {
  const isAvailable = book.availability?.status === 'available';
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4">
        {/* Book Cover Placeholder */}
        <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {book.title}
          </h3>
          <p className="text-gray-600 mb-2">by {book.author}</p>
          
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
            {book.year && <span>Published: {book.year}</span>}
            {book.isbn && <span>ISBN: {book.isbn}</span>}
            {book.callNumber && <span>Call #: {book.callNumber}</span>}
          </div>

          {/* Availability Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className={`text-sm font-medium ${isAvailable ? 'text-green-700' : 'text-yellow-700'}`}>
                {isAvailable ? 'Available' : 'On Hold'}
              </span>
              <span className="text-sm text-gray-500">
                at {book.availability?.branch}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">
                {book.availability?.copies} copies
              </span>
              <a
                href={book.holdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {isAvailable ? 'Borrow' : 'Place Hold'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ book }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 h-full">
      <div className="flex flex-col h-full">
        {/* Book Info */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            {book.title}
          </h4>
          <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
          
          <div className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mb-3">
            {book.genre}
          </div>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-3">
            {book.description}
          </p>
        </div>

        {/* Why Recommended */}
        <div className="border-t border-gray-100 pt-3 mt-3">
          <p className="text-xs text-gray-600 italic">
            <span className="font-medium">Why this book:</span> {book.reason}
          </p>
        </div>
      </div>
    </div>
  );
} 