let baseUrl = "https://vica-post-api.vercel.app/api/posts";
const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const formTitle = document.querySelector("form h2");
const postModal = document.querySelector(".post-modal");
let editPostId = null;

// Toggle Modal
function togglePostModal(id = null) {
  editPostId = id;
  if (id) {
    getPostDetails(id);
    formTitle.textContent = "Edit Post";
  } else {
    formTitle.textContent = "Add Post";
    nameInput.value = "";
    descInput.value = "";
  }
  postModal.classList.toggle("post-modal-active");
}

// Request: Get All Posts
function getPosts() {
  fetch(baseUrl)
    .then((res) => res.json())
    .then((res) => {
      const tableContent = document.querySelector("#table-content");
      tableContent.innerHTML = "";

      if (res.length === 0) {
        tableContent.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center;"><h3>No posts found</h3></td>
          </tr>`;
        return;
      }

      res.forEach((post) => {
        tableContent.innerHTML += `
          <tr>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.description}</td>
            <td class="table-actions">
              <button onclick="togglePostModal(${post.id})">
                <img src="./assets/imgs/edit.svg" alt="">
              </button>
              <button class="delete-btn" onclick="deletePost(${post.id})">
                <img src="./assets/imgs/trash.svg" alt="">
              </button>
            </td>
          </tr>`;
      });
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}

// Request: Get Post Details
function getPostDetails(postId) {
  fetch(`${baseUrl}/${postId}`)
    .then((res) => res.json())
    .then((res) => {
      nameInput.value = res.title;
      descInput.value = res.description;
    });
}

// Request: Add or Edit Post
function addOrEditPost(e) {
  e.preventDefault();
  const url = editPostId ? `${baseUrl}/${editPostId}` : baseUrl;
  const method = editPostId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: nameInput.value.trim(),
      description: descInput.value.trim(),
    }),
  })
    .then(() => {
      getPosts();
      togglePostModal();
      nameInput.value = "";
      descInput.value = "";
      editPostId = null;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Request: Delete Post
function deletePost(id) {
  fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  }).then(() => {
    getPosts();
  });
}

getPosts();
