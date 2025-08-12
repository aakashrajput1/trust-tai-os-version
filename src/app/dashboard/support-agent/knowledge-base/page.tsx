'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Copy, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  Tag,
  Calendar,
  User,
  Star,
  Download,
  Share2
} from 'lucide-react'

// Mock data for knowledge base articles
const mockArticles = [
  {
    id: 1,
    title: 'Common Payment Gateway Integration Issues',
    category: 'Technical Issues',
    tags: ['payment', 'integration', 'gateway'],
    content: 'This article covers the most common issues when integrating payment gateways and their solutions...',
    author: 'Support Team',
    lastUpdated: '2024-01-20',
    views: 156,
    rating: 4.8,
    difficulty: 'Intermediate',
    estimatedTime: '5 min read'
  },
  {
    id: 2,
    title: 'User Authentication Troubleshooting Guide',
    category: 'Bug Resolution',
    tags: ['authentication', 'login', 'security'],
    content: 'Step-by-step guide to troubleshoot common user authentication issues...',
    author: 'Security Team',
    lastUpdated: '2024-01-18',
    views: 89,
    rating: 4.6,
    difficulty: 'Beginner',
    estimatedTime: '3 min read'
  },
  {
    id: 3,
    title: 'SLA Management Best Practices',
    category: 'Process',
    tags: ['sla', 'process', 'management'],
    content: 'Best practices for managing Service Level Agreements and meeting response time targets...',
    author: 'Support Lead',
    lastUpdated: '2024-01-15',
    views: 234,
    rating: 4.9,
    difficulty: 'Advanced',
    estimatedTime: '8 min read'
  },
  {
    id: 4,
    title: 'Client Communication Templates',
    category: 'Communication',
    tags: ['communication', 'templates', 'client'],
    content: 'Standardized communication templates for common support scenarios...',
    author: 'Support Team',
    lastUpdated: '2024-01-12',
    views: 67,
    rating: 4.7,
    difficulty: 'Beginner',
    estimatedTime: '2 min read'
  },
  {
    id: 5,
    title: 'Database Performance Optimization',
    category: 'Technical Issues',
    tags: ['database', 'performance', 'optimization'],
    content: 'Advanced techniques for optimizing database performance and resolving slow query issues...',
    author: 'Database Team',
    lastUpdated: '2024-01-10',
    views: 123,
    rating: 4.5,
    difficulty: 'Advanced',
    estimatedTime: '10 min read'
  }
]

const categories = ['All Categories', 'Technical Issues', 'Bug Resolution', 'Process', 'Communication']
const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

export default function KnowledgeBase() {
  const [articles, setArticles] = useState(mockArticles)
  const [filteredArticles, setFilteredArticles] = useState(mockArticles)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('lastUpdated')
  const [sortOrder, setSortOrder] = useState('desc')

  // Filter and search articles
  useEffect(() => {
    let filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === 'All Categories' || article.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'All Levels' || article.difficulty === selectedDifficulty
      
      return matchesSearch && matchesCategory && matchesDifficulty
    })

    // Sort articles
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]
      
      if (sortBy === 'lastUpdated') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortBy === 'views' || sortBy === 'rating') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedCategory, selectedDifficulty, sortBy, sortOrder])

  // Handle copying article content to clipboard
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      // Show success message (in real app, use toast notification)
      alert('Content copied to clipboard!')
    })
  }

  // Handle article selection
  const handleArticleSelect = (articleId: number) => {
    setSelectedArticle(selectedArticle === articleId ? null : articleId)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All Categories')
    setSelectedDifficulty('All Levels')
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Knowledge Base</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Search and browse internal documentation and solutions
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Articles</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {filteredArticles.length}
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search knowledge base articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="lastUpdated">Last Updated</option>
                    <option value="title">Title</option>
                    <option value="views">Views</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            )}

            {/* Filter Summary and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {filteredArticles.length} of {articles.length} articles
                </div>
                {(searchTerm || selectedCategory !== 'All Categories' || selectedDifficulty !== 'All Levels') && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 sm:p-6">
              {/* Article Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      article.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {article.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{article.estimatedTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {article.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(article.lastUpdated).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {article.views}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      {article.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category and Tags */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Category:</span> {article.category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Article Content Preview */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {article.content}
                </p>
              </div>

              {/* Article Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleArticleSelect(article.id)}
                    className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {selectedArticle === article.id ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleCopyContent(article.content)}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Copy content to clipboard"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Article Details */}
              {selectedArticle === article.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Full Content</h4>
                    <p className="text-sm text-gray-700 mb-3">{article.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date(article.lastUpdated).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleCopyContent(article.content)}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Copy to clipboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(articles.reduce((sum, article) => sum + article.rating, 0) / articles.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.reduce((sum, article) => sum + article.views, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
