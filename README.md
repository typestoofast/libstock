# 📚 TPL Search - Toronto Public Library Catalogue

> A fast, beautiful, and intelligent way to search the Toronto Public Library catalogue with AI-powered recommendations.

![TPL Search Hero](https://via.placeholder.com/800x400/1e3a8a/ffffff?text=TPL+Search+-+Beautiful+Library+Search)

## ✨ Features

### 🎨 **Beautiful User Interface**
- **Hero Search Interface**: Airbnb-inspired floating card design with elegant gradients
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Floating Animations**: Subtle book icons that drift across the background
- **Loading States**: Smooth loading animations and transitions
- **Error Handling**: User-friendly error messages and fallbacks

### 🔍 **Powerful Search Capabilities**
- **Intelligent Search**: Smart book discovery with realistic library data
- **Branch Selection**: Choose your preferred library branch
- **Availability Status**: See if books are available or on hold
- **Hold Integration**: Deep links to TPL website for placing holds
- **Smart Filters**: Filter by availability, branch, and content type

### 🤖 **AI-Powered Recommendations**
- **Claude Integration**: Uses Anthropic's Claude via Shopify LLM Gateway
- **Smart Suggestions**: "You may like" recommendations based on your search
- **Rich Metadata**: Complete book information with descriptions and reasoning
- **Genre Classification**: Automatically categorizes recommendations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Shopify Dev environment (for LLM Gateway access)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/typestoofast/libstock.git
   cd libstock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Get your Shopify LLM Gateway token
   dev llm-gateway print-token
   
   # Create .env.local file with your credentials
   cat > .env.local << 'EOF'
   ANTHROPIC_API_KEY=your-shopify-llm-gateway-token
   ANTHROPIC_BASE_URL=https://openai-proxy.shopify.ai
   EOF
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technical Architecture

### Stack
- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom animations
- **AI Integration**: Shopify LLM Gateway (Claude)
- **Deployment**: Vercel (serverless)
- **Data**: Intelligent mock library catalogue data

### Project Structure
```
libstock/
├── app/
│   ├── components/
│   │   ├── BackgroundImage.js    # Beautiful gradient background
│   │   ├── SearchCard.js         # Main search interface
│   │   └── SearchResults.js      # Results display
│   ├── api/
│   │   ├── search/
│   │   │   └── route.js         # Library search endpoint
│   │   └── recommendations/
│   │       └── route.js         # AI recommendations endpoint
│   ├── globals.css              # Custom styles and animations
│   ├── layout.js                # App layout and metadata
│   └── page.js                  # Main homepage
├── public/                      # Static assets
├── package.json                 # Dependencies
└── README.md                    # This file
```

### Why Not Z39.50?

This application was originally designed to use the Z39.50 protocol to connect directly to TPL's catalogue. However, Z39.50 has several limitations for modern web applications:

- **Native Dependencies**: Requires YAZ library and native Node.js bindings
- **Serverless Incompatible**: Can't be deployed to Vercel, Netlify, or other serverless platforms
- **Connection Management**: Requires persistent connections unsuitable for serverless functions
- **Modern Alternatives**: TPL likely has REST APIs or GraphQL endpoints that would be more suitable

For production deployment, we recommend:
1. Contacting TPL for access to their modern API endpoints
2. Using their existing search widgets/APIs
3. Implementing a backend service with Z39.50 if persistent connections are available

## 🔧 API Endpoints

### POST /api/search
Search the library catalogue with intelligent matching.

**Request:**
```json
{
  "query": "hemingway",
  "branch": "central"
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "The Sun Also Rises",
      "author": "Ernest Hemingway",
      "isbn": "9780143039341",
      "year": "1926",
      "callNumber": "FIC HEMINGWAY",
      "recordId": "12345001",
      "availability": {
        "status": "available",
        "branch": "central",
        "copies": 3,
        "holds": 1
      },
      "holdUrl": "https://torontopubliclibrary.ca/search?searchTerm=The%20Sun%20Also%20Rises"
    }
  ],
  "total": 1,
  "query": "hemingway",
  "branch": "central",
  "searchTime": "0.8s"
}
```

### POST /api/recommendations
Get AI-powered book recommendations.

**Request:**
```json
{
  "query": "hemingway"
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "title": "The Sun Also Rises",
      "author": "Ernest Hemingway",
      "description": "A novel that follows a group of American and British expatriates...",
      "reason": "This is one of Hemingway's most famous novels and a quintessential work...",
      "genre": "Fiction"
    }
  ],
  "query": "hemingway",
  "totalRecommendations": 5
}
```

## 🎯 Usage Examples

### Basic Search
1. Enter your search query in "What do you want to read?"
2. Optionally select a preferred library branch
3. Click "Search Library"
4. View results with availability status

### AI Recommendations
- Get intelligent book suggestions based on your search
- See why each book was recommended
- Explore related genres and authors

### Placing Holds
- Click on any book's "Place Hold" button
- You'll be redirected to TPL's website to complete the hold

## 🧪 Testing

### Manual Testing
Test the search functionality:
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"hemingway","branch":"central"}'
```

Test the recommendations:
```bash
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"query":"hemingway"}'
```

### Browser Testing
1. Open [http://localhost:3000](http://localhost:3000)
2. Try searching for popular books like "hemingway", "fiction", or "programming"
3. Test different branch selections
4. Verify recommendations appear correctly

## 📚 Toronto Public Library Integration

### Current Implementation
The application currently uses intelligent mock data that simulates realistic library catalogue responses. This includes:

- **Realistic Book Data**: Actual popular books with proper metadata
- **Availability Simulation**: Random but realistic availability status
- **Branch Assignment**: Books distributed across actual TPL branches
- **Hold URLs**: Direct links to TPL's search for each book

### Future Integration Options
For production deployment with real TPL data:

1. **Modern APIs**: Contact TPL for access to REST/GraphQL endpoints
2. **Search Widgets**: Integrate TPL's existing search widgets
3. **Dedicated Backend**: Build a backend service with Z39.50 if needed
4. **Data Feeds**: Use TPL's open data feeds where available

### Branch Information
Branch data is sourced from Toronto's Open Data Portal:
- **Dataset**: [Library Branch General Information](https://open.toronto.ca/dataset/library-branch-general-information/)
- **Format**: CSV with branch names, addresses, and service details

## 🔒 Security & Privacy

- **API Keys**: All credentials stored in `.env.local` (not committed to Git)
- **Shopify LLM Gateway**: Uses enterprise-grade AI proxy for secure Claude access
- **No Personal Data**: Search queries are not stored permanently
- **HTTPS**: All external API calls use secure connections

## 🚧 Current Status

### ✅ Completed Features
- Beautiful Hero Search interface with floating animations
- Intelligent search with realistic library data simulation
- Claude-powered recommendations via Shopify LLM Gateway
- Responsive design with Tailwind CSS
- Error handling and user feedback
- Vercel deployment with serverless architecture
- GitHub repository with proper CI/CD

### 🔄 Production Considerations
- **Real TPL Integration**: Contact TPL for access to modern API endpoints
- **Enhanced Search**: Implement advanced filters and faceted search
- **User Accounts**: Add user preferences and search history
- **Performance**: Implement caching and search optimization

### 📋 Planned Features
- Advanced search filters (date, format, genre)
- Reading lists and favorites
- Mobile app version
- Offline search capabilities
- Social features (reviews, ratings)

## 🚀 Deployment

### Vercel (Recommended)
This application is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `ANTHROPIC_BASE_URL`
3. Deploy automatically on every push

### Other Platforms
The application works on any Node.js hosting platform:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Toronto Public Library** for their excellent public services and open data
- **Shopify** for the LLM Gateway and development tools
- **Anthropic** for Claude AI integration
- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for beautiful, responsive styling
- **Vercel** for seamless serverless deployment

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/typestoofast/libstock/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Made with ❤️ for book lovers and the Toronto community**

*"A beautiful library search experience that works everywhere, from local development to global deployment."*
