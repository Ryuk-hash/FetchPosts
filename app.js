const PERSONS = {
  1: 'Mandeep',
  2: 'Elon Musk',
  3: 'Robert Downey Jr.',
  4: 'Jason Statham',
  5: 'Eminem',
  6: 'Emma Stone',
  7: 'Ragnar Lothbrok',
  8: 'Emilia Clarke',
  9: 'Jon Snow',
  10: 'Scarlett Johansson',
};

class Post {
  constructor(userId, postId, author, title, body) {
    this.userId = userId;
    this.postId = postId;
    this.author = author;
    this.title = title;
    this.body = body;
  }
}

class UI {
  addPostToList = (post) => {
    const Posts = document.getElementById('posts');

    const newPost = document.createElement('article');
    newPost.id = post.postId;

    const title = document.createElement('h1');
    title.classList.add('title');
    title.innerHTML = post.title;

    const deleteIcon = document.createElement('i');
    deleteIcon.id = 'delete';
    deleteIcon.className = 'fa fa-trash-o';

    const author = document.createElement('h4');
    author.id = post.userId;
    author.classList.add('author');
    author.innerHTML = post.author;

    const body = document.createElement('p');
    body.classList.add('body');
    body.innerHTML = post.body;

    newPost.append(title, deleteIcon, author, body);

    Posts.appendChild(newPost);
  };

  deletePostFromList = (post) => {
    post.parentElement.remove();
  };
}

class Store {
  static getPosts() {
    let posts;

    if (localStorage.getItem('posts') === null || localStorage.getItem('posts').length < 1) {
      posts = [];
    } else {
      posts = JSON.parse(localStorage.getItem('posts'));
    }

    return posts;
  }

  static displayPosts() {
    let posts = Store.getPosts();

    posts.forEach((post) => {
      const ui = new UI();

      ui.addPostToList(post);
    });
  }

  static createPost(postData) {
    const posts = Store.getPosts();

    posts.push(postData);

    localStorage.setItem('posts', JSON.stringify(posts));
  }

  static deletePost(postId) {
    let posts = Store.getPosts();

    if (posts.length < 1 || postId < 0) {
      throw new Error('Invalid post-id!');
    }

    posts = posts.filter((obj) => {
      return obj.postId !== postId;
    });

    localStorage.setItem('posts', JSON.stringify(posts));
  }
}

const BaseURL = 'https://jsonplaceholder.typicode.com/';

document.addEventListener('DOMContentLoaded', Store.displayPosts);

// Get a new post from API upon button click:
document.getElementById('getPost').addEventListener('click', async (e) => {
  let someRandomNumber = 1 + Math.floor(Math.random() * 9);
  fetch(BaseURL + 'posts?userId=' + someRandomNumber).then((response) => {
    response.json().then((res) => {
      const { body, title, id, userId } = res[0];

      const NewPost = new Post(id, userId, PERSONS[userId], title, body);
      const ui = new UI();

      ui.addPostToList(NewPost);
      Store.createPost(NewPost);
    });
  });

  e.preventDefault();
});

document.getElementById('posts').addEventListener('click', (e) => {
  const elem = e.target;
  if (elem.id === 'delete') {
    const ui = new UI();
    ui.deletePostFromList(elem);
    Store.deletePost(1 * elem.parentElement.id);
  }
  e.preventDefault();
});
