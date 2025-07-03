import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { query, searchResults = [] } = await request.json();
    
    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Query is required for recommendations' }, 
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' }, 
        { status: 500 }
      );
    }

    console.log(`Getting recommendations for: "${query}"`);

    // Create a prompt for Claude to generate book recommendations
    const prompt = createRecommendationPrompt(query, searchResults);

    // Get recommendations from Claude
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    // Parse Claude's response
    const recommendations = parseClaudeResponse(message.content[0].text);

    return NextResponse.json({
      recommendations,
      query,
      totalRecommendations: recommendations.length
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations', details: error.message }, 
      { status: 500 }
    );
  }
}

function createRecommendationPrompt(query, searchResults) {
  let prompt = `Based on the search query "${query}", recommend 5 books that someone might be interested in reading. `;
  
  if (searchResults.length > 0) {
    prompt += `The user has already found these books: ${searchResults.map(r => `"${r.title}" by ${r.author}`).join(', ')}. `;
    prompt += `Suggest different books that complement or relate to their interests. `;
  }
  
  prompt += `For each recommendation, provide:
1. Title
2. Author
3. Brief description (1-2 sentences)
4. Why it relates to their search
5. Genre/category

Format your response as a JSON array with objects containing: title, author, description, reason, genre.

Example format:
[
  {
    "title": "Book Title",
    "author": "Author Name", 
    "description": "Brief description of the book",
    "reason": "Why this relates to the search query",
    "genre": "Fiction/Non-fiction/etc"
  }
]

Please provide exactly 5 recommendations in valid JSON format.`;

  return prompt;
}

function parseClaudeResponse(responseText) {
  try {
    // Extract JSON from Claude's response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    // Fallback: try to parse the entire response as JSON
    const parsed = JSON.parse(responseText);
    return Array.isArray(parsed) ? parsed : [];
    
  } catch (error) {
    console.error('Error parsing Claude response:', error);
    
    // Fallback recommendations if parsing fails
    return [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        description: "A novel about life's infinite possibilities and the choices that shape our destiny.",
        reason: "A thoughtful exploration of life's paths and possibilities",
        genre: "Contemporary Fiction"
      },
      {
        title: "Educated",
        author: "Tara Westover",
        description: "A memoir about education, family, and the struggle between loyalty and self-discovery.",
        reason: "An inspiring story of personal growth and transformation",
        genre: "Memoir"
      },
      {
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        description: "A captivating novel about a reclusive Hollywood icon's life and secrets.",
        reason: "A compelling character-driven story with mystery and glamour",
        genre: "Historical Fiction"
      }
    ];
  }
}

// Alternative GET endpoint for simple recommendations without search context
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' }, 
      { status: 400 }
    );
  }

  // Use the POST handler with empty search results
  return POST({
    json: () => Promise.resolve({ query, searchResults: [] })
  });
} 