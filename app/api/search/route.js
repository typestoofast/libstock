import { NextResponse } from 'next/server';

// Mock implementation while we fix Z39.50 library issues
// TODO: Replace with real Z39.50 integration once node-zoom2 bindings are working

export async function POST(request) {
  try {
    const { query, branch } = await request.json();
    
    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' }, 
        { status: 400 }
      );
    }

    console.log(`Searching for: "${query}" at branch: ${branch || 'any'}`);

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock search results based on query
    const mockResults = generateMockResults(query, branch);

    return NextResponse.json({
      results: mockResults,
      total: mockResults.length,
      query,
      branch,
      note: "Mock data - Z39.50 integration coming soon"
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search library catalogue', details: error.message }, 
      { status: 500 }
    );
  }
}

function generateMockResults(query, preferredBranch) {
  const queryLower = query.toLowerCase();
  
  // Sample book database
  const sampleBooks = [
    {
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      isbn: "9781501161933",
      year: "2017",
      callNumber: "FIC REID",
      recordId: "12345001",
      subjects: ["fiction", "hollywood", "celebrity", "lgbtq", "romance"]
    },
    {
      title: "Where the Crawdads Sing", 
      author: "Delia Owens",
      isbn: "9780735219090",
      year: "2018", 
      callNumber: "FIC OWENS",
      recordId: "12345002",
      subjects: ["fiction", "mystery", "nature", "coming of age", "southern"]
    },
    {
      title: "Educated",
      author: "Tara Westover", 
      isbn: "9780399590504",
      year: "2018",
      callNumber: "B WESTOVER",
      recordId: "12345003",
      subjects: ["memoir", "education", "family", "survival", "mormon"]
    },
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      isbn: "9780525559474", 
      year: "2020",
      callNumber: "FIC HAIG",
      recordId: "12345004",
      subjects: ["fiction", "philosophy", "choices", "regret", "fantasy"]
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      isbn: "9780735211292",
      year: "2018", 
      callNumber: "158.1 CLEAR",
      recordId: "12345005",
      subjects: ["self help", "habits", "productivity", "psychology", "behavior"]
    },
    {
      title: "The Thursday Murder Club",
      author: "Richard Osman",
      isbn: "9781984880987",
      year: "2020",
      callNumber: "FIC OSMAN", 
      recordId: "12345006",
      subjects: ["mystery", "elderly", "crime", "friendship", "humor"]
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      isbn: "9780441172719",
      year: "1965",
      callNumber: "SF HERBERT",
      recordId: "12345007", 
      subjects: ["science fiction", "space", "politics", "ecology", "epic"]
    },
    {
      title: "The Psychology of Programming",
      author: "Gerald M. Weinberg",
      isbn: "9780932633420", 
      year: "1998",
      callNumber: "004.019 WEIN",
      recordId: "12345008",
      subjects: ["programming", "psychology", "software", "development", "computer science"]
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      year: "2008",
      callNumber: "005.1 MARTIN", 
      recordId: "12345009",
      subjects: ["programming", "software", "clean code", "development", "practices"]
    },
    {
      title: "The Handmaid's Tale",
      author: "Margaret Atwood",
      isbn: "9780385490818",
      year: "1985",
      callNumber: "FIC ATWOOD",
      recordId: "12345010",
      subjects: ["dystopian", "feminism", "future", "religion", "oppression"]
    }
  ];

  // Filter books based on query
  const matchingBooks = sampleBooks.filter(book => {
    const searchText = `${book.title} ${book.author} ${book.subjects.join(' ')}`.toLowerCase();
    const queryWords = queryLower.split(' ').filter(word => word.length > 2);
    return queryWords.some(word => searchText.includes(word));
  });

  // If no matches, return a few popular books
  const booksToReturn = matchingBooks.length > 0 ? matchingBooks.slice(0, 8) : sampleBooks.slice(0, 5);

  // Convert to library record format
  return booksToReturn.map(book => ({
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    year: book.year,
    callNumber: book.callNumber,
    recordId: book.recordId,
    availability: {
      status: Math.random() > 0.3 ? 'available' : 'on-hold',
      branch: preferredBranch || getBranchForBook(book.callNumber),
      copies: Math.floor(Math.random() * 5) + 1,
      holds: Math.floor(Math.random() * 10)
    },
    holdUrl: `https://torontopubliclibrary.ca/search?searchTerm=${encodeURIComponent(book.title)}`
  }));
}

function getBranchForBook(callNumber) {
  const branches = [
    'Toronto Reference Library',
    'North York Central Library', 
    'Scarborough Civic Centre',
    'Etobicoke Civic Centre',
    'Beaches',
    'High Park',
    'Junction',
    'Riverdale'
  ];
  
  // Assign branch based on call number for consistency
  const index = callNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % branches.length;
  return branches[index];
} 