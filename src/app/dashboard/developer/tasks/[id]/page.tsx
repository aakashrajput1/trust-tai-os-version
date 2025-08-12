'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useNotifications } from '@/components/ui/SimpleNotificationProvider'
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  MessageSquare, 
  Paperclip,
  Send,
  Upload,
  Download,
  Eye,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertTriangle,
  Info,
  Edit,
  Save,
  X,
  Plus,
  Tag,
  Flag,
  Timer
} from 'lucide-react'

// Mock task data
const mockTask = {
  id: 'dev-task-4',
  title: 'Refactor user registration API',
  description: 'Clean up the registration endpoint and add better validation. This includes implementing proper input sanitization, adding rate limiting, and improving error handling for edge cases.',
  project: 'E-commerce Platform v2.0',
  priority: 'high',
  status: 'in-progress',
  dueDate: '2024-01-26',
  estimatedHours: 6,
  actualHours: 3,
  tags: ['backend', 'api', 'validation'],
  assignedBy: 'Sarah M. (PM)',
  assignedAt: '2024-01-22T09:00:00Z',
  startedAt: '2024-01-24T09:00:00Z',
  attachments: [
    {
      id: 1,
      name: 'API_Specifications.pdf',
      size: '2.1 MB',
      uploadedBy: 'Sarah M.',
      uploadedAt: '2024-01-22T10:00:00Z',
      type: 'pdf'
    },
    {
      id: 2,
      name: 'validation_schema.json',
      size: '15 KB',
      uploadedBy: 'John D.',
      uploadedAt: '2024-01-22T14:30:00Z',
      type: 'json'
    }
  ],
  comments: [
    {
      id: 1,
      author: 'Sarah M.',
      avatar: 'SM',
      content: 'Please make sure to follow the new validation patterns we discussed. @john-doe might have some input on the rate limiting implementation.',
      timestamp: '2024-01-22T10:30:00Z',
      mentions: ['john-doe']
    },
    {
      id: 2,
      author: 'John D.',
      avatar: 'JD',
      content: 'For rate limiting, I recommend using Redis with a sliding window approach. I can help review the implementation once you have a draft.',
      timestamp: '2024-01-23T14:15:00Z',
      mentions: []
    },
    {
      id: 3,
      author: 'You',
      avatar: 'ME',
      content: 'Thanks for the feedback! I\'ve started working on the validation layer. Will have the rate limiting ready for review by tomorrow.',
      timestamp: '2024-01-24T09:30:00Z',
      mentions: []
    }
  ],
  timeEntries: [
    {
      id: 1,
      date: '2024-01-24',
      hours: 2.5,
      description: 'Initial refactoring and code cleanup',
      timestamp: '2024-01-24T17:00:00Z'
    },
    {
      id: 2,
      date: '2024-01-25',
      hours: 0.5,
      description: 'Research on validation libraries',
      timestamp: '2024-01-25T11:30:00Z'
    }
  ]
}

const mockTeamMembers = [
  { id: 'john-doe', name: 'John D.', username: 'john-doe' },
  { id: 'sarah-miller', name: 'Sarah M.', username: 'sarah-miller' },
  { id: 'mike-rodriguez', name: 'Mike R.', username: 'mike-rodriguez' },
  { id: 'anna-kim', name: 'Anna K.', username: 'anna-kim' }
]

export default function TaskDetailPage() {
  const params = useParams()
  const { addNotification } = useNotifications()
  const [task, setTask] = useState(mockTask)
  const [comments, setComments] = useState(mockTask.comments)
  const [newComment, setNewComment] = useState('')
  const [timeLogHours, setTimeLogHours] = useState('')
  const [timeLogDescription, setTimeLogDescription] = useState('')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState(task.description)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionFilter, setMentionFilter] = useState('')

  const taskId = params.id

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isTimerRunning) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    setIsTimerRunning(true)
    addNotification({
      type: 'info',
      title: 'Timer Started',
      message: `Timer started for "${task.title}"`
    })
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
    addNotification({
      type: 'info',
      title: 'Timer Paused',
      message: `Time logged: ${formatTime(currentTime)}`
    })
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    if (currentTime > 0) {
      const hours = (currentTime / 3600).toFixed(2)
      setTimeLogHours(hours)
      setTimeLogDescription(`Work on ${task.title}`)
      addNotification({
        type: 'success',
        title: 'Timer Stopped',
        message: `${hours} hours ready to log`
      })
    }
    setCurrentTime(0)
  }

  const logTime = () => {
    if (!timeLogHours || !timeLogDescription) {
      addNotification({
        type: 'error',
        title: 'Invalid Input',
        message: 'Please enter both hours and description'
      })
      return
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      hours: parseFloat(timeLogHours),
      description: timeLogDescription,
      timestamp: new Date().toISOString()
    }

    setTask(prev => ({
      ...prev,
      timeEntries: [...prev.timeEntries, newEntry],
      actualHours: prev.actualHours + parseFloat(timeLogHours)
    }))

    addNotification({
      type: 'success',
      title: 'Time Logged',
      message: `${timeLogHours} hours logged successfully`
    })

    setTimeLogHours('')
    setTimeLogDescription('')
  }

  const addComment = () => {
    if (!newComment.trim()) return

    // Extract mentions
    const mentionRegex = /@([a-zA-Z0-9-]+)/g
    const mentions = Array.from(newComment.matchAll(mentionRegex)).map(match => match[1])

    const comment = {
      id: Date.now(),
      author: 'You',
      avatar: 'ME',
      content: newComment,
      timestamp: new Date().toISOString(),
      mentions
    }

    setComments(prev => [...prev, comment])
    setNewComment('')

    // Send notifications to mentioned users
    mentions.forEach(username => {
      addNotification({
        type: 'info',
        title: 'Mentioned in Task',
        message: `You were mentioned in "${task.title}"`
      })
    })

    addNotification({
      type: 'success',
      title: 'Comment Added',
      message: 'Your comment has been posted'
    })
  }

  const updateDescription = () => {
    setTask(prev => ({ ...prev, description: editedDescription }))
    setIsEditing(false)
    addNotification({
      type: 'success',
      title: 'Description Updated',
      message: 'Task description has been updated'
    })
  }

  const handleMentionClick = (username: string) => {
    const cursorPos = newComment.length
    const newText = newComment + `@${username} `
    setNewComment(newText)
    setShowMentions(false)
  }

  const filteredMembers = mockTeamMembers.filter(member =>
    member.name.toLowerCase().includes(mentionFilter.toLowerCase()) ||
    member.username.toLowerCase().includes(mentionFilter.toLowerCase())
  )

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'todo': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'review': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'testing': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'done': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf': return '📄'
      case 'json': return '📋'
      case 'image': return '🖼️'
      default: return '📄'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/dashboard/developer/tasks"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Tasks
            </Link>
          </div>
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {task.assignedBy}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {task.actualHours}h / {task.estimatedHours}h
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(task.status)}`}>
                {task.status.replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={updateDescription}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditedDescription(task.description)
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{task.description}</p>
                )}
              </div>
            </div>

            {/* Time Tracking */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Time Tracking</h2>
              </div>
              
              <div className="p-6">
                {/* Active Timer */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Active Timer</h3>
                      <p className="text-sm text-gray-600">Track time for this task</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{formatTime(currentTime)}</div>
                      <div className="text-sm text-gray-500">
                        {(currentTime / 3600).toFixed(2)} hours
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!isTimerRunning ? (
                      <button
                        onClick={startTimer}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </button>
                    )}
                    
                    <button
                      onClick={stopTimer}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop & Log
                    </button>
                  </div>
                </div>

                {/* Manual Time Log */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Log Time</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="number"
                      value={timeLogHours}
                      onChange={(e) => setTimeLogHours(e.target.value)}
                      placeholder="Hours"
                      min="0.25"
                      step="0.25"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={timeLogDescription}
                      onChange={(e) => setTimeLogDescription(e.target.value)}
                      placeholder="What did you work on?"
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={logTime}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Timer className="w-4 h-4 mr-2" />
                    Log Time
                  </button>
                </div>

                {/* Time Entries */}
                {task.timeEntries.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Time Entries</h3>
                    <div className="space-y-2">
                      {task.timeEntries.map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{entry.description}</div>
                            <div className="text-sm text-gray-500">{entry.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{entry.hours}h</div>
                            <div className="text-xs text-gray-500">{formatTimeAgo(entry.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Comments ({comments.length})
                </h2>
              </div>
              
              <div className="p-6">
                {/* Add Comment */}
                <div className="mb-6">
                  <div className="relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => {
                        setNewComment(e.target.value)
                        if (e.target.value.endsWith('@')) {
                          setShowMentions(true)
                          setMentionFilter('')
                        } else {
                          setShowMentions(false)
                        }
                      }}
                      placeholder="Add a comment... Use @username to mention team members"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    {/* Mentions Dropdown */}
                    {showMentions && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                        <div className="p-2">
                          <input
                            type="text"
                            value={mentionFilter}
                            onChange={(e) => setMentionFilter(e.target.value)}
                            placeholder="Search team members..."
                            className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                          />
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                          {filteredMembers.map((member) => (
                            <button
                              key={member.id}
                              onClick={() => handleMentionClick(member.username)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium">{member.name}</div>
                                <div className="text-xs text-gray-500">@{member.username}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-gray-500">
                      Tip: Use @username to mention team members
                    </div>
                    <button
                      onClick={addComment}
                      disabled={!newComment.trim()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Comment
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-blue-600">{comment.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Info */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Task Info</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Project</label>
                  <p className="text-gray-900">{task.project}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned By</label>
                  <p className="text-gray-900">{task.assignedBy}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="text-gray-900">{new Date(task.assignedAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Started</label>
                  <p className="text-gray-900">{new Date(task.startedAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Attachments ({task.attachments.length})
                  </h3>
                  <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-3">
                {task.attachments.map((file) => (
                  <div key={file.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="text-2xl">{getFileIcon(file.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                      <p className="text-sm text-gray-500">{file.size}</p>
                      <p className="text-xs text-gray-400">
                        by {file.uploadedBy} • {formatTimeAgo(file.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
              </div>
              
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report Blocker
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Info className="w-4 h-4 mr-2" />
                  Request Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

