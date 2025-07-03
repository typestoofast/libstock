import { NextResponse } from 'next/server';
import { searchTPLCatalogue, generateEnhancedMockResults } from '../../lib/symphonyApi.js';

// Toronto Public Library Search API
// Integrates with Symphony Web Services for real-time catalogue data

export async function POST(request) {
  try {
    const { query, branch } = await request.json();
    
    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' }, 
        { status: 400 }
      );
    }

    console.log(`🔍 TPL Search Request: "${query}" at branch: ${branch || 'any'}`);

    try {
      // First attempt: Real-time Symphony Web Services
      const symphonyResults = await searchTPLCatalogue(query, branch);
      
      return NextResponse.json({
        results: symphonyResults,
        total: symphonyResults.length,
        query: query,
        branch: branch || 'all',
        timestamp: new Date().toISOString(),
        source: 'Toronto Public Library - Live Symphony Data',
        api_status: 'success'
      });

    } catch (symphonyError) {
      console.warn('🔄 Symphony API unavailable, using enhanced fallback:', symphonyError.message);
      
      // Fallback: Enhanced mock data with smart search
      const fallbackResults = generateEnhancedMockResults(query, branch);
      
      return NextResponse.json({
        results: fallbackResults,
        total: fallbackResults.length,
        query: query,
        branch: branch || 'all',
        timestamp: new Date().toISOString(),
        source: 'Enhanced Mock Data - TPL Symphony API temporarily unavailable',
        api_status: 'fallback',
        fallback_reason: symphonyError.message
      });
    }

  } catch (error) {
    console.error('❌ Search API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Search service temporarily unavailable',
        details: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
} 