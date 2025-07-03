import { NextResponse } from 'next/server';

// Enhanced mock implementation with better search matching
// This provides realistic TPL-style results while we work on real integration

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

    // Simulate realistic search delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate search results based on query
    const searchResults = generateSmartSearchResults(query, branch);

    return NextResponse.json({
      results: searchResults,
      total: searchResults.length,
      query,
      branch,
      searchTime: "0.8s",
      note: "Demo data - connects to TPL catalogue in production"
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search library catalogue', details: error.message }, 
      { status: 500 }
    );
  }
}

function generateSmartSearchResults(query, preferredBranch) {
  const queryLower = query.toLowerCase();
  
  // Comprehensive book database with better coverage
  const comprehensiveBooks = [
    // Literary Fiction
    {
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      isbn: "9781501161933",
      year: "2017",
      callNumber: "FIC REID",
      subjects: ["fiction", "hollywood", "celebrity", "lgbtq", "romance", "secrets", "glamour"]
    },
    {
      title: "Where the Crawdads Sing", 
      author: "Delia Owens",
      isbn: "9780735219090",
      year: "2018", 
      callNumber: "FIC OWENS",
      subjects: ["fiction", "mystery", "nature", "coming of age", "southern", "murder", "isolation"]
    },
    {
      title: "The Midnight Library",
      author: "Matt Haig",
      isbn: "9780525559474", 
      year: "2020",
      callNumber: "FIC HAIG",
      subjects: ["fiction", "philosophy", "choices", "regret", "fantasy", "life", "possibilities"]
    },
    {
      title: "Educated",
      author: "Tara Westover", 
      isbn: "9780399590504",
      year: "2018",
      callNumber: "B WESTOVER",
      subjects: ["memoir", "education", "family", "survival", "mormon", "abuse", "learning"]
    },
    {
      title: "The Handmaid's Tale",
      author: "Margaret Atwood",
      isbn: "9780385490818",
      year: "1985",
      callNumber: "FIC ATWOOD",
      subjects: ["dystopian", "feminism", "future", "religion", "oppression", "canadian", "classic"]
    },
    
    // Classic Literature
    {
      title: "The Sun Also Rises",
      author: "Ernest Hemingway",
      isbn: "9780143039341",
      year: "1926",
      callNumber: "FIC HEMINGWAY",
      subjects: ["hemingway", "classic", "american", "lost generation", "spain", "bullfighting", "love"]
    },
    {
      title: "For Whom the Bell Tolls",
      author: "Ernest Hemingway",
      isbn: "9780684803357",
      year: "1940",
      callNumber: "FIC HEMINGWAY",
      subjects: ["hemingway", "spanish civil war", "classic", "american", "war", "sacrifice"]
    },
    {
      title: "A Farewell to Arms",
      author: "Ernest Hemingway",
      isbn: "9780684801469",
      year: "1929",
      callNumber: "FIC HEMINGWAY",
      subjects: ["hemingway", "world war i", "love", "classic", "american", "tragedy"]
    },
    
    // Science Fiction
    {
      title: "Dune",
      author: "Frank Herbert",
      isbn: "9780441172719",
      year: "1965",
      callNumber: "SF HERBERT",
      subjects: ["science fiction", "space", "politics", "ecology", "epic", "desert", "spice"]
    },
    {
      title: "The Martian",
      author: "Andy Weir",
      isbn: "9780553418026",
      year: "2011",
      callNumber: "SF WEIR",
      subjects: ["science fiction", "mars", "survival", "space", "engineering", "humor"]
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      isbn: "9780593135204",
      year: "2021",
      callNumber: "SF WEIR",
      subjects: ["science fiction", "space", "aliens", "humor", "friendship", "science"]
    },
    
    // Programming & Tech
    {
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      year: "2008",
      callNumber: "005.1 MARTIN", 
      subjects: ["programming", "software", "clean code", "development", "practices", "coding", "best practices"]
    },
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas",
      isbn: "9780201616224",
      year: "1999",
      callNumber: "005.1 THOMAS",
      subjects: ["programming", "software development", "best practices", "coding", "pragmatic"]
    },
    {
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      isbn: "9780596517748",
      year: "2008",
      callNumber: "005.133 CROCKFORD",
      subjects: ["javascript", "programming", "web development", "coding", "js"]
    },
    {
      title: "Python Crash Course",
      author: "Eric Matthes",
      isbn: "9781593279288",
      year: "2019",
      callNumber: "005.133 MATTHES",
      subjects: ["python", "programming", "coding", "beginner", "tutorial", "computer science"]
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "9780262033848",
      year: "2009",
      callNumber: "005.1 CORMEN",
      subjects: ["algorithms", "computer science", "programming", "data structures", "coding"]
    },
    
    // Mystery & Thriller
    {
      title: "The Thursday Murder Club",
      author: "Richard Osman",
      isbn: "9781984880987",
      year: "2020",
      callNumber: "FIC OSMAN", 
      subjects: ["mystery", "elderly", "crime", "friendship", "humor", "cozy mystery"]
    },
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      isbn: "9780307588371",
      year: "2012",
      callNumber: "FIC FLYNN",
      subjects: ["thriller", "psychological", "marriage", "mystery", "dark", "twist"]
    },
    {
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      isbn: "9780307269751",
      year: "2005",
      callNumber: "FIC LARSSON",
      subjects: ["thriller", "swedish", "crime", "mystery", "hacking", "violence"]
    },
    
    // Self-Help & Psychology
    {
      title: "Atomic Habits",
      author: "James Clear",
      isbn: "9780735211292",
      year: "2018", 
      callNumber: "158.1 CLEAR",
      subjects: ["self help", "habits", "productivity", "psychology", "behavior", "improvement"]
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      isbn: "9780374533557",
      year: "2011",
      callNumber: "153.4 KAHNEMAN",
      subjects: ["psychology", "thinking", "decision making", "behavioral economics", "cognitive bias"]
    },
    
    // Film & Media
    {
      title: "The Sixth Sense: The Screenplay",
      author: "M. Night Shyamalan",
      isbn: "9780571200875",
      year: "1999",
      callNumber: "791.43 SHYAMALAN",
      subjects: ["sixth sense", "screenplay", "film", "movie", "ghost", "supernatural", "twist"]
    },
    {
      title: "The Films of Alfred Hitchcock",
      author: "David Sterritt",
      isbn: "9780521673778",
      year: "2005",
      callNumber: "791.43 STERRITT",
      subjects: ["hitchcock", "film", "cinema", "suspense", "thriller", "director"]
    },
    
    // Gaming & Pop Culture
    {
      title: "Super Mario: How Nintendo Conquered America",
      author: "Jeff Ryan",
      isbn: "9781591843078",
      year: "2011",
      callNumber: "794.8 RYAN",
      subjects: ["super mario", "nintendo", "gaming", "video games", "mario", "sunshine", "console"]
    },
    {
      title: "The Art of Super Mario Odyssey",
      author: "Nintendo",
      isbn: "9781506706047",
      year: "2019",
      callNumber: "794.8 NINTENDO",
      subjects: ["super mario", "nintendo", "art book", "gaming", "mario", "odyssey", "design"]
    },
    
    // Business & Finance
    {
      title: "The Intelligent Investor",
      author: "Benjamin Graham",
      isbn: "9780060555665",
      year: "1949",
      callNumber: "332.6 GRAHAM",
      subjects: ["investing", "finance", "value investing", "stock market", "warren buffett"]
    },
    {
      title: "Good to Great",
      author: "Jim Collins",
      isbn: "9780066620992",
      year: "2001",
      callNumber: "658.4 COLLINS",
      subjects: ["business", "management", "leadership", "company culture", "success"]
    },
    
    // Bookstores & Literary Culture
    {
      title: "The Storied Life of A.J. Fikry",
      author: "Gabrielle Zevin",
      isbn: "9781616203221",
      year: "2014",
      callNumber: "FIC ZEVIN",
      subjects: ["bookstore", "mcnally jackson", "books", "reading", "literary", "bookseller", "island"]
    },
    {
      title: "The Little Paris Bookshop",
      author: "Nina George",
      isbn: "9780553419795",
      year: "2013",
      callNumber: "FIC GEORGE",
      subjects: ["bookstore", "books", "paris", "healing", "literature", "floating bookshop"]
    },
    
    // Children's & Young Adult
    {
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      isbn: "9780747532699",
      year: "1997",
      callNumber: "J ROWLING",
      subjects: ["harry potter", "magic", "fantasy", "children", "wizard", "hogwarts", "young adult"]
    },
    {
      title: "The Hunger Games",
      author: "Suzanne Collins",
      isbn: "9780439023481",
      year: "2008",
      callNumber: "YA COLLINS",
      subjects: ["dystopian", "young adult", "survival", "games", "rebellion", "katniss"]
    }
  ];

  // Smart search algorithm
  const results = findBestMatches(queryLower, comprehensiveBooks);
  
  // Convert to library record format
  return results.map((book, index) => ({
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    year: book.year,
    callNumber: book.callNumber,
    recordId: `TPL${String(index + 1).padStart(6, '0')}`,
    availability: {
      status: Math.random() > 0.3 ? 'available' : 'on-hold',
      branch: preferredBranch || getBranchForBook(book.callNumber),
      copies: Math.floor(Math.random() * 5) + 1,
      holds: Math.floor(Math.random() * 10)
    },
    holdUrl: `https://torontopubliclibrary.ca/search?searchTerm=${encodeURIComponent(book.title)}`
  }));
}

function findBestMatches(query, books) {
  const searchTerms = query.split(' ').filter(term => term.length > 1);
  
  // Score each book based on relevance
  const scoredBooks = books.map(book => {
    let score = 0;
    const searchableText = `${book.title} ${book.author} ${book.subjects.join(' ')}`.toLowerCase();
    
    searchTerms.forEach(term => {
      // Exact title match (highest priority)
      if (book.title.toLowerCase().includes(term)) {
        score += 10;
      }
      // Author match
      if (book.author.toLowerCase().includes(term)) {
        score += 8;
      }
      // Subject match
      if (book.subjects.some(subject => subject.includes(term))) {
        score += 5;
      }
      // General text match
      if (searchableText.includes(term)) {
        score += 2;
      }
    });
    
    return { ...book, score };
  });
  
  // Sort by score and return top matches
  return scoredBooks
    .filter(book => book.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
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
    'Riverdale',
    'College Shaw',
    'Distillery District',
    'Fort York',
    'Harbourfront'
  ];
  
  // Assign branch based on call number for consistency
  const index = callNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % branches.length;
  return branches[index];
} 