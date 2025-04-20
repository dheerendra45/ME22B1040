Backend Service
Overview
This backend service provides API endpoints for retrieving user and post data from an external API source. It implements several performance optimization techniques including authentication caching, data caching, heap-based sorting, and scheduled cache updates.
Technologies Used

Node.js with Express
Authentication with JWT tokens
In-memory caching with NodeCache
Scheduled tasks with node-schedule
Heap data structures for efficient data processing

Performance Optimizations
Heap Data Structures
The application uses custom heap implementations to efficiently process data:

MinHeap for Top Users

Maintains a min-heap of users sorted by post count
Efficiently finds top N users without sorting the entire dataset
Time complexity: O(n log 5) instead of O(n log n)


MaxHeap for Latest Posts

Uses post ID as key to find the most recent posts
Extracts only the 5 highest IDs without sorting all posts


MaxHeap for Popular Posts

Organizes posts by comment count
Efficiently finds posts with the highest number of comments



Caching Strategy

Tiered Caching: Different TTL values for different data types:

Users cache: 300 seconds (5 minutes)
Posts cache: 120 seconds (2 minutes)


Automatic Cache Invalidation: NodeCache handles TTL expirations

Scheduled Tasks

Token Refresh: Schedules token refresh before expiration
Post Data Updates: Every 180 seconds (3 minutes)
User Data Updates: Every 600 seconds (10 minutes)
Initial Prefetch: Loads data into cache during startup

API Endpoints
1. Get Top Users
GET /users
Returns the top 5 users based on their post count.
Response Format:
json[
  {
    "id": "user_id",
    "name": "User Name",
    "postCount": 10
  },
  ...
]
2. Get user posts
GET /users/:userid/posts

3. Get comments
GET /posts/:postid/comments


Running the Application
bash# Install dependencies
npm install

# Start the server
npm start

# Development mode with auto-restart
npm run dev
