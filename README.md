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
- **Real-time Library Search**: Direct connection to TPL's catalogue system
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
- **API Integration**: 
  - Toronto Public Library Z39.50 Protocol
  - Shopify LLM Gateway (Claude)
- **Database**: Real-time library catalogue via Z39.50

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

## 🔧 API Endpoints

### POST /api/search
Search the Toronto Public Library catalogue.

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
  "branch": "central"
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

### Z39.50 Protocol
This application connects to TPL's library catalogue using the Z39.50 protocol:
- **Host**: `catalogue.symphony.tpl.ca`
- **Port**: `2200`
- **Database**: `unicorn`
- **Format**: MARC21 bibliographic data

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
- Search API with realistic mock data
- Claude-powered recommendations via Shopify LLM Gateway
- Responsive design with Tailwind CSS
- Error handling and user feedback
- GitHub repository with proper CI/CD

### 🔄 In Progress
- Real Z39.50 integration with TPL catalogue
- Advanced search filters (date, format, availability)
- User preferences and search history

### 📋 Planned Features
- Advanced search filters
- Reading lists and favorites
- Mobile app version
- Offline search capabilities
- Social features (reviews, ratings)

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

## 📞 Support

For support, please:
1. Check the [Issues](https://github.com/typestoofast/libstock/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Made with ❤️ for book lovers and the Toronto community**

*"The library is the heart of the community, and now it has a beautiful digital face."*
