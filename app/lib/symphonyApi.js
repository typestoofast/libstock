// Toronto Public Library Symphony Web Services Integration
// This service provides real-time access to TPL's live catalogue data

const TPL_API_CONFIG = {
  baseURL: 'https://catalog.torontopubliclibrary.ca',
  // Symphony Web Services endpoints (standard Symphony API paths)
  endpoints: {
    search: '/symws/catalog/search',
    record: '/symws/catalog/record',
    availability: '/symws/catalog/availability'
  },
  defaultParams: {
    ct: 'json',           // Content type: JSON
    rw: 8,                // Return 8 results
    fmt: 'json',          // Format: JSON
    rt: 'title'           // Result type: title
  }
};

export async function searchTPLCatalogue(query, branch = null) {
  try {
    console.log(`🔍 Searching TPL Symphony for: "${query}" at branch: ${branch || 'all'}`);

    // Build search parameters for Symphony Web Services
    const searchParams = new URLSearchParams({
      ...TPL_API_CONFIG.defaultParams,
      q: query,
      ...(branch && { lib: branch })
    });

    const searchURL = `${TPL_API_CONFIG.baseURL}${TPL_API_CONFIG.endpoints.search}?${searchParams}`;
    
    console.log('📡 TPL Symphony API URL:', searchURL);

    // Make request to TPL's Symphony Web Services
    const response = await fetch(searchURL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TPL-Search-Enhanced/1.0 (Next.js)'
      },
      timeout: 8000 // 8 second timeout
    });

    if (!response.ok) {
      throw new Error(`Symphony API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Received Symphony response:', data);
    
    // Transform Symphony API response to our standard format
    return transformSymphonyResults(data, query, branch);

  } catch (error) {
    console.error('❌ Symphony API call failed:', error.message);
    throw new Error(`TPL Symphony API unavailable: ${error.message}`);
  }
}

function transformSymphonyResults(symphonyData, query, branch) {
  try {
    // Symphony typically returns results in these possible structures
    const results = symphonyData.results || 
                   symphonyData.titleInfo || 
                   symphonyData.records || 
                   symphonyData.entries || [];
    
    console.log(`📚 Processing ${results.length} Symphony results`);

    return results.map((item, index) => {
      // Extract data from Symphony's response format (handling multiple possible schemas)
      const title = extractField(item, ['title', 'titleInfo.title', 'marc.245a']) || 'Unknown Title';
      const author = extractField(item, ['author', 'authorInfo.author', 'marc.100a', 'marc.110a']) || 'Unknown Author';
      const callNumber = extractField(item, ['callNumber', 'callInfo.callNumber', 'marc.090a', 'marc.050a']) || 'No Call Number';
      const isbn = extractField(item, ['isbn', 'standardNumbers.isbn', 'marc.020a']) || null;
      const publishYear = extractField(item, ['publishYear', 'publication.year', 'marc.260c']) || null;
      const format = extractField(item, ['format', 'formatInfo.format', 'materialType']) || 'Book';
      const titleKey = extractField(item, ['titleKey', 'id', 'recordId']) || `tpl_${index}`;
      
      // Extract availability information
      const availability = extractAvailability(item, branch);
      
      return {
        id: `tpl_${titleKey}`,
        title: cleanText(title),
        author: cleanText(author),
        callNumber: cleanText(callNumber),
        isbn: cleanText(isbn),
        publishYear: publishYear ? parseInt(publishYear.toString().replace(/\D/g, '').substring(0, 4)) : null,
        format: cleanText(format),
        availability: availability,
        description: generateDescription(title, author, format, publishYear),
        branch: branch || 'Multiple Locations',
        holdUrl: generateHoldUrl(titleKey, title),
        catalogUrl: generateCatalogUrl(title),
        source: 'Toronto Public Library - Live Data'
      };
    });

  } catch (error) {
    console.error('❌ Error transforming Symphony results:', error);
    throw new Error(`Failed to process Symphony response: ${error.message}`);
  }
}

function extractField(item, paths) {
  for (const path of paths) {
    const value = getNestedValue(item, path);
    if (value && value.trim && value.trim() !== '') {
      return value;
    }
  }
  return null;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

function cleanText(text) {
  if (!text) return text;
  return text.toString()
    .replace(/[\|\[\]\/]/g, '') // Remove MARC delimiters
    .replace(/\s+/g, ' ')       // Normalize whitespace
    .trim();
}

function extractAvailability(item, requestedBranch) {
  try {
    // Look for availability in various Symphony response formats
    const holdings = item.holdings || 
                    item.copyInfo || 
                    item.items || 
                    item.availability || 
                    [];

    if (!holdings || !Array.isArray(holdings)) {
      return generateDefaultAvailability(requestedBranch);
    }

    let totalCopies = 0;
    let availableCopies = 0;
    let branchHoldings = [];

    holdings.forEach(holding => {
      const copies = parseInt(holding.copies || holding.totalCopies || 1);
      const available = parseInt(holding.available || holding.availableCopies || 0);
      const branch = holding.library || holding.branch || holding.location || 'Unknown Branch';
      const status = holding.status || (available > 0 ? 'AVAILABLE' : 'CHECKED_OUT');
      
      totalCopies += copies;
      availableCopies += available;
      
      branchHoldings.push({
        branch: cleanText(branch),
        totalCopies: copies,
        availableCopies: available,
        status: available > 0 ? 'available' : 'checked_out'
      });
    });

    // Filter for requested branch if specified
    if (requestedBranch && requestedBranch !== 'all') {
      const branchData = branchHoldings.find(h => 
        h.branch.toLowerCase().includes(requestedBranch.toLowerCase())
      );
      
      if (branchData) {
        return {
          status: branchData.availableCopies > 0 ? 'available' : 'on_hold',
          totalCopies: branchData.totalCopies,
          availableCopies: branchData.availableCopies,
          message: branchData.availableCopies > 0 
            ? `${branchData.availableCopies} of ${branchData.totalCopies} copies available at ${branchData.branch}`
            : `All copies checked out at ${branchData.branch}. Place a hold?`,
          branchHoldings: [branchData]
        };
      }
    }

    // Return system-wide availability
    return {
      status: availableCopies > 0 ? 'available' : 'on_hold',
      totalCopies: totalCopies,
      availableCopies: availableCopies,
      message: availableCopies > 0 
        ? `${availableCopies} of ${totalCopies} copies available across TPL system`
        : `All ${totalCopies} copies checked out. Place a hold?`,
      branchHoldings: branchHoldings.slice(0, 5) // Limit to 5 branches for display
    };

  } catch (error) {
    console.error('Error extracting availability:', error);
    return generateDefaultAvailability(requestedBranch);
  }
}

function generateDefaultAvailability(branch) {
  return {
    status: 'unknown',
    totalCopies: 1,
    availableCopies: 0,
    message: 'Availability information not available from TPL API',
    branchHoldings: [{
      branch: branch || 'Toronto Public Library',
      totalCopies: 1,
      availableCopies: 0,
      status: 'unknown'
    }]
  };
}

function generateDescription(title, author, format, year) {
  const parts = [];
  if (format && format !== 'Book') parts.push(format);
  if (author && author !== 'Unknown Author') parts.push(`by ${author}`);
  if (year) parts.push(`(${year})`);
  
  return parts.length > 0 ? parts.join(' ') : `${format || 'Book'} from Toronto Public Library`;
}

function generateHoldUrl(titleKey, title) {
  // Generate URL for placing holds on TPL website
  const baseUrl = 'https://www.torontopubliclibrary.ca';
  if (titleKey && titleKey !== 'unknown') {
    return `${baseUrl}/detail.jsp?Entt=RDM${titleKey}`;
  }
  return `${baseUrl}/search.jsp?Ntt=${encodeURIComponent(title)}`;
}

function generateCatalogUrl(title) {
  // Generate URL for viewing item in TPL catalog
  return `https://www.torontopubliclibrary.ca/search.jsp?Ntt=${encodeURIComponent(title)}`;
}

// Enhanced fallback function for when Symphony API is unavailable
export function generateEnhancedMockResults(query, branch) {
  console.log(`🎭 Generating enhanced mock results for: "${query}"`);
  
  const searchTerms = query.toLowerCase().split(' ');
  
  // Comprehensive book database with realistic TPL holdings
  const tplBookDatabase = [
    {
      title: "The Sun Also Rises",
      author: "Ernest Hemingway", 
      callNumber: "FIC HEM",
      isbn: "9780684800714",
      publishYear: 1926,
      format: "Book",
      subjects: ["classic", "literature", "hemingway", "fiction", "war", "paris", "1920s"],
      description: "Hemingway's masterpiece about the Lost Generation in post-WWI Europe."
    },
    {
      title: "For Whom the Bell Tolls",
      author: "Ernest Hemingway",
      callNumber: "FIC HEM", 
      isbn: "9780684803357",
      publishYear: 1940,
      format: "Book",
      subjects: ["hemingway", "war", "spain", "classic", "literature", "civil war"],
      description: "A powerful novel set during the Spanish Civil War."
    },
    {
      title: "The Handmaid's Tale", 
      author: "Margaret Atwood",
      callNumber: "FIC ATW",
      isbn: "9780385490818", 
      publishYear: 1985,
      format: "Book",
      subjects: ["dystopian", "feminism", "atwood", "canadian", "science fiction", "totalitarian"],
      description: "Atwood's chilling vision of a totalitarian future society."
    },
    {
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      callNumber: "005.1 MAR",
      isbn: "9780132350884",
      publishYear: 2008,
      format: "Book", 
      subjects: ["programming", "software", "development", "coding", "technical", "computer science", "agile"],
      description: "Essential guide to writing maintainable, readable code."
    },
    {
      title: "The Pragmatic Programmer: Your Journey to Mastery",
      author: "David Thomas",
      callNumber: "005.1 THO",
      isbn: "9780135957059",
      publishYear: 2019,
      format: "Book",
      subjects: ["programming", "software", "development", "pragmatic", "technical", "mastery"],
      description: "Updated classic on software development best practices."
    },
    {
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford", 
      callNumber: "006.76 CRO",
      isbn: "9780596517748",
      publishYear: 2008,
      format: "Book",
      subjects: ["javascript", "programming", "web development", "technical", "language"],
      description: "Essential JavaScript knowledge for web developers."
    },
    {
      title: "The Storied Life of A.J. Fikry",
      author: "Gabrielle Zevin",
      callNumber: "FIC ZEV",
      isbn: "9781616203221", 
      publishYear: 2014,
      format: "Book",
      subjects: ["bookstore", "books", "mcnally jackson", "fiction", "contemporary", "literary"],
      description: "Heartwarming story of a bookstore owner and the transformative power of books."
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      callNumber: "SF HER",
      isbn: "9780441172719",
      publishYear: 1965,
      format: "Book",
      subjects: ["science fiction", "epic", "fantasy", "desert", "politics", "ecology"],
      description: "Epic space opera set on the desert planet Arrakis."
    },
    {
      title: "The Martian",
      author: "Andy Weir", 
      callNumber: "SF WEI",
      isbn: "9780553418026",
      publishYear: 2011,
      format: "Book",
      subjects: ["science fiction", "mars", "survival", "space", "science", "humor"],
      description: "Thrilling tale of survival on Mars through science and ingenuity."
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      callNumber: "SF WEI",
      isbn: "9780593135204",
      publishYear: 2021,
      format: "Book",
      subjects: ["science fiction", "space", "aliens", "science", "humor", "friendship"],
      description: "A lone astronaut's mission to save humanity from extinction."
    }
  ];

  // Intelligent search scoring
  const scoredResults = tplBookDatabase.map(book => {
    let score = 0;
    
    searchTerms.forEach(term => {
      // Exact title match (highest priority)
      if (book.title.toLowerCase() === query.toLowerCase()) score += 20;
      else if (book.title.toLowerCase().includes(term)) score += 10;
      
      // Author match (high priority)  
      if (book.author.toLowerCase().includes(term)) score += 8;
      
      // Subject match (medium priority)
      if (book.subjects.some(subject => subject.includes(term))) score += 5;
      
      // Description match (low priority)
      if (book.description.toLowerCase().includes(term)) score += 2;
    });
    
    return { ...book, score };
  });

  // Return top relevant results
  const topResults = scoredResults
    .filter(book => book.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  // If no matches, return popular recommendations
  if (topResults.length === 0) {
    return tplBookDatabase.slice(0, 5).map(book => ({
      ...transformMockBook(book, branch),
      note: "Popular recommendation - no exact matches found"
    }));
  }

  return topResults.map(book => transformMockBook(book, branch));
}

function transformMockBook(book, branch) {
  const availability = generateRealisticAvailability(branch);
  
  return {
    id: `mock_${book.isbn || Math.random().toString(36).substr(2, 9)}`,
    title: book.title,
    author: book.author,
    callNumber: book.callNumber,
    isbn: book.isbn,
    publishYear: book.publishYear,
    format: book.format,
    description: book.description,
    availability: availability,
    branch: branch || 'Multiple Locations',
    holdUrl: generateHoldUrl('unknown', book.title),
    catalogUrl: generateCatalogUrl(book.title),
    source: 'Enhanced Mock Data (TPL API unavailable)',
    relevanceScore: book.score || 1
  };
}

function generateRealisticAvailability(branch) {
  const scenarios = [
    { available: 3, total: 5, likelihood: 0.4 }, // Most common: some available
    { available: 0, total: 3, likelihood: 0.3 }, // Common: all checked out
    { available: 1, total: 1, likelihood: 0.2 }, // Less common: single copy available
    { available: 0, total: 1, likelihood: 0.1 }  // Rare: single copy checked out
  ];
  
  const rand = Math.random();
  let cumulative = 0;
  
  for (const scenario of scenarios) {
    cumulative += scenario.likelihood;
    if (rand <= cumulative) {
      return {
        status: scenario.available > 0 ? 'available' : 'on_hold',
        totalCopies: scenario.total,
        availableCopies: scenario.available,
        message: scenario.available > 0 
          ? `${scenario.available} of ${scenario.total} copies available` 
          : `All ${scenario.total} copies checked out. Place a hold?`,
        branchHoldings: [{
          branch: branch || 'Central Library',
          totalCopies: scenario.total,
          availableCopies: scenario.available,
          status: scenario.available > 0 ? 'available' : 'checked_out'
        }]
      };
    }
  }
  
  // Fallback
  return generateDefaultAvailability(branch);
} 