# Custom Dashboard Project Analysis

## Features

### 🔐 Authentication & Security
- **User Login System**: Username/password authentication using DummyJSON API
- **JWT Token Management**: Access token and refresh token handling with automatic expiration
- **Protected Routes**: Route-level authentication guards preventing unauthorized access
- **Session Management**: Automatic token refresh and session extension capabilities
- **Inactivity Detection**: Automatic logout after 20 minutes of inactivity with warning dialog
- **Persistent Authentication**: Login state persists across browser sessions using Zustand persistence

### 🏠 Dashboard & Navigation
- **Customizable Dashboard**: Main dashboard with draggable widget layout
- **User Profile Integration**: Displays user information fetched from API
- **Navigation System**: React Router-based navigation with protected routes
- **Responsive Layout**: Modern CSS Grid-based responsive design
- **User Greeting**: Personalized welcome message with user's name

### 🧩 Widget System
- **Drag & Drop Interface**: Reorderable widgets using React DnD
- **Persistent Layout**: Widget positions saved to localStorage per user
- **Four Core Widgets**:
  1. **Timer Widget**: Persistent page timer tracking total time spent
  2. **User Profile Widget**: Displays user avatar, details, and statistics
  3. **Weather Widget**: Location-based weather information with mock data
  4. **Todo Widget**: Full-featured task management system
- **Reset Functionality**: Ability to reset widget layout to default configuration

### ⏱️ Timer Features
- **Persistent Timer**: Tracks total time spent on the page across browser sessions
- **Real-time Updates**: Updates every second with current time display
- **Reset Capability**: Manual timer reset functionality
- **Cross-session Persistence**: Timer continues even after browser restart

### 🌤️ Weather Integration
- **Location-based Weather**: Weather data for any city (currently using mock data)
- **Weather Details**: Temperature, feels-like, humidity, wind speed, and conditions
- **Visual Weather Icons**: Emoji-based weather condition indicators
- **Refresh Functionality**: Manual weather data refresh
- **Location Search**: Input field to change weather location
- **Error Handling**: Graceful error handling for API failures

### ✅ Todo Management
- **Task Creation**: Add new tasks with validation
- **Task Completion**: Mark tasks as complete/incomplete
- **Task Filtering**: Filter by All, Active, or Completed tasks
- **Task Deletion**: Remove individual tasks
- **Bulk Operations**: Clear all completed tasks at once
- **Persistent Storage**: Tasks saved to localStorage
- **Task Statistics**: Real-time count of active and completed tasks
- **Character Limit**: 100 character limit for task descriptions

### 👤 User Profile Management
- **User Data Display**: Shows user avatar, name, username, email
- **User Statistics**: Age, gender, and phone information
- **Avatar Support**: Profile images with fallback to initials
- **Data Refresh**: Manual user data refresh capability
- **Error Handling**: Retry mechanisms for failed data loads

### ⚠️ Session Management
- **Inactivity Monitoring**: Tracks user activity (mouse, keyboard, touch, scroll)
- **Warning System**: 60-second countdown warning before logout
- **Session Extension**: Option to extend session when warned
- **Automatic Logout**: Force logout when session expires
- **Activity Reset**: Timer resets on any user interaction

## Design Decisions

### 🏗️ Architecture & State Management
- **Zustand for State Management**: Chosen over Redux for simplicity and smaller bundle size
- **Persistent State**: Authentication and user data persist across browser sessions
- **Modular Store Architecture**: Separate stores for auth and user data with combined hook
- **Service Layer Pattern**: Clean separation between UI components and API calls
- **Custom Hooks**: Reusable logic extracted into custom hooks (useInactivityHook)

### 🎨 UI/UX Design Patterns
- **Component-Based Architecture**: Highly modular React components for reusability
- **Widget Pattern**: Consistent widget wrapper with drag/drop capabilities
- **Responsive Design**: CSS Grid and Flexbox for responsive layouts
- **Visual Feedback**: Loading states, error states, and success indicators
- **Accessibility Considerations**: Semantic HTML and keyboard navigation support

### 🔧 Technical Implementation
- **React 19**: Latest React version for modern features and performance
- **React Router v7**: Latest routing with modern navigation patterns
- **React DnD**: Professional drag-and-drop implementation
- **TailwindCSS**: Utility-first CSS framework for rapid styling
- **Local Storage Strategy**: Smart localStorage usage for user-specific data persistence
- **Error Boundaries**: Graceful error handling throughout the application

### 🌐 API Integration Strategy
- **DummyJSON Integration**: Using DummyJSON as backend for authentication and user data
- **Mock Data Fallbacks**: Weather service uses mock data when API key unavailable
- **HTTP Client Abstraction**: Centralized API helper for consistent request handling
- **Token Management**: Automatic token refresh and header injection
- **Error Standardization**: Consistent error handling across all API calls

### 📱 Performance & Optimization
- **Lazy Loading**: Components loaded on demand where appropriate
- **Memoization**: Strategic use of React optimization patterns
- **Local Storage Optimization**: Efficient data serialization and user-specific storage
- **Timer Optimization**: Efficient interval management with proper cleanup
- **Bundle Optimization**: Modern build tools and code splitting

### 🔒 Security Considerations
- **Token Expiration Handling**: Proper JWT token lifecycle management
- **Secure Storage**: Sensitive data stored securely in localStorage
- **Input Validation**: Client-side validation for all user inputs
- **XSS Prevention**: Safe rendering of user-generated content
- **CSRF Protection**: Stateless authentication reduces CSRF risks

### 🎯 User Experience Design
- **Progressive Enhancement**: Core functionality works without advanced features
- **Feedback Systems**: Clear loading, success, and error states
- **Intuitive Navigation**: Logical flow between authentication and dashboard
- **Customization**: User control over dashboard layout and widget arrangement
- **Persistence**: User preferences and data persist across sessions

### 🧪 Development Practices
- **Component Isolation**: Each component is self-contained and reusable
- **Separation of Concerns**: Clear boundaries between UI, logic, and data layers
- **Error Handling**: Comprehensive error handling at component and service levels
- **Code Organization**: Logical folder structure with clear naming conventions
- **Modern JavaScript**: ES6+ features and modern React patterns

### 📊 Data Management Strategy
- **User-Specific Data**: Widget layouts and preferences tied to user ID
- **Data Validation**: Input validation at multiple layers
- **Fallback Mechanisms**: Graceful degradation when data is unavailable
- **Cache Strategy**: Smart caching of user data and preferences
- **Data Synchronization**: Consistent data state across components

### 🔄 Session & Lifecycle Management
- **Activity Tracking**: Multiple event types tracked for user activity
- **Timer Management**: Proper cleanup of intervals and timeouts
- **Component Lifecycle**: Proper mounting/unmounting with cleanup
- **Memory Management**: Prevention of memory leaks through proper cleanup
- **State Persistence**: Strategic persistence of critical application state