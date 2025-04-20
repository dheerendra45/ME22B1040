import dotenv from 'dotenv'; 
import express from 'express';
import cors from 'cors';

import apiService from './api/apiManager.js';
import cacheService from './api/cacheManager.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize authentication
(async () => {
  try {
    await apiService.authenticate();
    console.log('Initial authentication completed');
  } catch (error) {
    console.error('Failed to initialize authentication:', error);
  }
})();

// API Endpoints
app.get('/users', async (req, res) => {
  try {
    // Check cache first
    const cachedUsers = cacheService.getTopUsers();
    if (cachedUsers) {
      return res.json(cachedUsers);
    }
    
    // If not in cache, fetch from API
    const topUsers = await apiService.getTopUsers();
    
    // Store in cache for future requests
    cacheService.setTopUsers(topUsers);
    
    res.json(topUsers);
  } catch (error) {
    console.error('Error in /users endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New endpoint for posts
app.get('/posts', async (req, res) => {
  const type = req.query.type || 'latest';
  
  try {
    if (type === 'latest') {
      // Check cache first
      const cachedLatestPosts = cacheService.getLatestPosts();
      if (cachedLatestPosts) {
        return res.json(cachedLatestPosts);
      }
      
      // If not in cache, fetch from API
      const latestPosts = await apiService.getLatestPosts();
      
      // Store in cache for future requests
      cacheService.setLatestPosts(latestPosts);
      
      return res.json(latestPosts);
    } 
    else if (type === 'popular') {
      // Check cache first
      const cachedPopularPosts = cacheService.getPopularPosts();
      if (cachedPopularPosts) {
        return res.json(cachedPopularPosts);
      }
      
      // If not in cache, fetch from API
      const popularPosts = await apiService.getPopularPosts();
      
      // Store in cache for future requests
      cacheService.setPopularPosts(popularPosts);
      
      return res.json(popularPosts);
    }
    else {
      return res.status(400).json({ error: 'Invalid type parameter. Use "latest" or "popular".' });
    }
  } catch (error) {
    console.error('Error in /posts endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});