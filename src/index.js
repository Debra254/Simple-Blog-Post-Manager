const BASE_URL = 'http://localhost:3000/posts';


const postsContainer = document.getElementById('posts-container');
const postContent = document.getElementById('post-content');
const newPostForm = document.getElementById('new-post-form');
const deletePostBtn = document.getElementById('delete-post');


function main() {
    displayPosts();
    addNewPostListener();
    setupDeletePostListener();
}


async function displayPosts() {
    try {
        const response = await fetch(BASE_URL);
        const posts = await response.json();
        
        postsContainer.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
        
        if (posts.length > 0) {
            handlePostClick(posts[0]);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

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
    
 
    li.addEventListener('click', () => handlePostClick(post));
    
    return li;
}

async function handlePostClick(post) {
    try {
        const response = await fetch(`${BASE_URL}/${post.id}`);
        const postDetails = await response.json();
        
      
        postContent.innerHTML = '';
        
        const title = document.createElement('h3');
        title.textContent = postDetails.title;
        
        const author = document.createElement('p');
        author.textContent = `Author: ${postDetails.author}`;
        
        const content = document.createElement('p');
        content.textContent = postDetails.content;
        
        const image = document.createElement('img');
        image.src = postDetails.image || 'https://via.placeholder.com/150';
        image.className = 'post-detail-image';
        
        
        postContent.appendChild(image);
        postContent.appendChild(title);
        postContent.appendChild(author);
        postContent.appendChild(content);
        
       
        deletePostBtn.dataset.postId = post.id;
        
       
        deletePostBtn.style.display = 'block';
    } catch (error) {
        console.error('Error fetching post details:', error);
    }
}


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
                newPostForm.reset();
                displayPosts();
            }
        } catch (error) {
            console.error('Error adding post:', error);
        }
    });
}


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
                deletePostBtn.style.display = 'none';
                postContent.innerHTML = '';
                displayPosts();
            } else {
                throw new ('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        }
    });
}

document.addEventListener('DOMContentLoaded', main);