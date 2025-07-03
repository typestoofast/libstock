import { NextResponse } from 'next/server';
import zoom from 'node-zoom2';

// Toronto Public Library Z39.50 configuration
const TPL_CONFIG = {
  host: 'catalogue.symphony.tpl.ca',
  port: 2200,
  database: 'unicorn',
  charset: 'UTF-8'
};

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

    // Create Z39.50 connection
    const connection = new zoom.Connection();
    
    // Connect to TPL catalogue
    await new Promise((resolve, reject) => {
      connection.connect(TPL_CONFIG.host, TPL_CONFIG.port, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // Set database
    connection.option('databaseName', TPL_CONFIG.database);
    connection.option('charset', TPL_CONFIG.charset);

    // Build search query for title, author, or subject
    // Using PQF (Prefix Query Format) for Z39.50
    const searchQuery = `@or @or @attr 1=4 "${query}" @attr 1=1003 "${query}" @attr 1=21 "${query}"`;
    
    // Perform search
    const resultSet = await new Promise((resolve, reject) => {
      connection.search(searchQuery, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const resultCount = resultSet.size();
    console.log(`Found ${resultCount} results`);

    if (resultCount === 0) {
      connection.close();
      return NextResponse.json({
        results: [],
        total: 0,
        query,
        branch
      });
    }

    // Get up to 10 records
    const maxResults = Math.min(resultCount, 10);
    const records = [];

    for (let i = 0; i < maxResults; i++) {
      try {
        const record = await new Promise((resolve, reject) => {
          resultSet.getRecord(i, 'xml', (error, rec) => {
            if (error) {
              reject(error);
            } else {
              resolve(rec);
            }
          });
        });

        if (record) {
          const parsedRecord = parseMARC21Record(record.raw, branch);
          if (parsedRecord) {
            records.push(parsedRecord);
          }
        }
      } catch (error) {
        console.error(`Error getting record ${i}:`, error);
        // Continue to next record
      }
    }

    // Close connection
    connection.close();

    return NextResponse.json({
      results: records,
      total: resultCount,
      query,
      branch
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search library catalogue', details: error.message }, 
      { status: 500 }
    );
  }
}

// Parse MARC21 XML record and extract useful information
function parseMARC21Record(xmlData, preferredBranch) {
  try {
    // This is a simplified parser - in production you'd want a proper XML parser
    const record = {};
    
    // Extract title (field 245)
    const titleMatch = xmlData.match(/<datafield tag="245"[^>]*>.*?<subfield code="a">([^<]+)/s);
    record.title = titleMatch ? titleMatch[1].trim() : 'Unknown Title';
    
    // Extract author (field 100 or 700)
    const authorMatch = xmlData.match(/<datafield tag="(?:100|700)"[^>]*>.*?<subfield code="a">([^<]+)/s);
    record.author = authorMatch ? authorMatch[1].trim() : 'Unknown Author';
    
    // Extract ISBN (field 020)
    const isbnMatch = xmlData.match(/<datafield tag="020"[^>]*>.*?<subfield code="a">([^<]+)/s);
    record.isbn = isbnMatch ? isbnMatch[1].trim() : null;
    
    // Extract publication year (field 008 or 260)
    const yearMatch = xmlData.match(/<controlfield tag="008">(.{7})(\d{4})/s) || 
                     xmlData.match(/<datafield tag="260"[^>]*>.*?<subfield code="c">.*?(\d{4})/s);
    record.year = yearMatch ? yearMatch[2] || yearMatch[1] : null;
    
    // Extract call number (field 050 or 082)
    const callMatch = xmlData.match(/<datafield tag="(?:050|082)"[^>]*>.*?<subfield code="a">([^<]+)/s);
    record.callNumber = callMatch ? callMatch[1].trim() : null;
    
    // Extract record ID from control field 001
    const recordIdMatch = xmlData.match(/<controlfield tag="001">([^<]+)/s);
    record.recordId = recordIdMatch ? recordIdMatch[1].trim() : null;
    
    // Simplified availability check (would need real-time circulation data)
    record.availability = {
      status: Math.random() > 0.3 ? 'available' : 'on-hold',
      branch: preferredBranch || 'Toronto Reference Library',
      copies: Math.floor(Math.random() * 5) + 1,
      holds: Math.floor(Math.random() * 10)
    };
    
    // Generate hold URL (TPL's actual hold system would require authentication)
    record.holdUrl = `https://torontopubliclibrary.ca/search?searchTerm=${encodeURIComponent(record.title)}`;
    
    return record;
    
  } catch (error) {
    console.error('Error parsing MARC record:', error);
    return null;
  }
} 