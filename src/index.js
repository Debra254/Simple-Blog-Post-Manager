const BASE_URL = 'http://localhost:3000/posts';

// DOM Elements
const postsContainer = document.getElementById('posts-container');
const postContent = document.getElementById('post-content');
const newPostForm = document.getElementById('new-post-form');
const deletePostBtn = document.getElementById('delete-post');

// Main function to initialize the app
function main() {
    // Load posts when page loads
    displayPosts();
    
    // Add event listeners
    addNewPostListener();
    setupDeletePostListener();
}

// Fetch and display all posts
async function displayPosts() {
    try {
        const response = await fetch(BASE_URL);
        const posts = await response.json();
        
        // Clear existing posts
        postsContainer.innerHTML = '';
        
        // Create post elements
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
        
        // Auto-display first post if available
        if (posts.length > 0) {
            handlePostClick(posts[0]);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Create a post element
function createPostElement(post) {
    const li = document.createElement('li');
    li.className = 'post-item';
    li.dataset.id = post.id;
    
    const img = document.createElement('img');
    img.className = 'post-image';
    img.src = post.image || 'https://via.placeholder.com/50';
    
    const title = document.createElement('div');
    title.className = 'post-title';
    title.textContent = post.title;
    
    li.appendChild(img);
    li.appendChild(title);
    
    // Add click event listener
    li.addEventListener('click', () => handlePostClick(post));
    
    return li;
}

// Handle post click to show details
async function handlePostClick(post) {
    try {
        const response = await fetch(`${BASE_URL}/${post.id}`);
        const postDetails = await response.json();
        
        // Clear existing content
        postContent.innerHTML = '';
        
        // Create post detail elements
        const title = document.createElement('h3');
        title.textContent = postDetails.title;
        
        const author = document.createElement('p');
        author.textContent = `Author: ${postDetails.author}`;
        
        const content = document.createElement('p');
        content.textContent = postDetails.content;
        
        const image = document.createElement('img');
        image.src = postDetails.image || 'https://via.placeholder.com/150';
        image.className = 'post-detail-image';
        
        // Add elements to content
        postContent.appendChild(image);
        postContent.appendChild(title);
        postContent.appendChild(author);
        postContent.appendChild(content);
        
        // Store the current post ID for deletion
        deletePostBtn.dataset.postId = post.id;
        
        // Show delete button
        deletePostBtn.style.display = 'block';
    } catch (error) {
        console.error('Error fetching post details:', error);
    }
}

// Add new post
async function addNewPostListener() {
    newPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const post = {
            title: document.getElementById('post-title').value,
            content: document.getElementById('post-content').value,
            author: document.getElementById('post-author').value,
            image: document.getElementById('post-image').value || 'https://via.placeholder.com/150'
        };
        
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post)
            });
            
            if (response.ok) {
                // Clear form
                newPostForm.reset();
                
                // Refresh posts display
                displayPosts();
            }
        } catch (error) {
            console.error('Error adding post:', error);
        }
    });
}

// Setup delete post listener
function setupDeletePostListener() {
    deletePostBtn.addEventListener('click', async () => {
        const postId = deletePostBtn.dataset.postId;
        
        if (!postId) {
            alert('No post selected');
            return;
        }
        
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }
        
        try {
            const response = await fetch(`${BASE_URL}/${postId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Hide delete button
                deletePostBtn.style.display = 'none';
                
                // Clear post content
                postContent.innerHTML = '';
                
                // Refresh posts display
                displayPosts();
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', main);