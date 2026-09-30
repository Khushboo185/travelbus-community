// ================= GLOBAL VARIABLES =================

let currentUser = "Khushboo";

let currentForum = "";

let totalComments = 0;

let totalLikes = 0;


// ================= GET ELEMENTS =================

const mainContainer = document.getElementById("mainContainer");

const mainContent = document.getElementById("mainContent");

const profileSection = document.getElementById("profileSection");

const exploreSection = document.getElementById("exploreSection");

const routesSection = document.getElementById("routesSection");

const forumsSection = document.getElementById("forumsSection");

const createPostPopup = document.getElementById("createPostPopup");

const loginPopup = document.getElementById("loginPopup");

const forumPopup = document.getElementById("forumPopup");


// ================= STORAGE =================

let savedPosts = JSON.parse(localStorage.getItem("travelBusPosts")) || [];

let savedComments =
    JSON.parse(localStorage.getItem("travelBusComments")) || {};

let savedLikes =
    JSON.parse(localStorage.getItem("travelBusLikes")) || {};

let savedForums =
    JSON.parse(localStorage.getItem("travelBusForums")) || {};


// ================= SAVE DATA =================

function savePosts() {

    localStorage.setItem(
        "travelBusPosts",
        JSON.stringify(savedPosts)
    );

}


function saveComments() {

    localStorage.setItem(
        "travelBusComments",
        JSON.stringify(savedComments)
    );

}


function saveLikes() {

    localStorage.setItem(
        "travelBusLikes",
        JSON.stringify(savedLikes)
    );

}


function saveForums() {

    localStorage.setItem(
        "travelBusForums",
        JSON.stringify(savedForums)
    );

}


// ================= HIDE ALL PAGES =================

function hideAllPages() {

    mainContainer.style.display = "none";

    profileSection.style.display = "none";

    exploreSection.style.display = "none";

    routesSection.style.display = "none";

    forumsSection.style.display = "none";

}


// ================= HOME =================

function showHome() {

    hideAllPages();

    mainContainer.style.display = "grid";

    mainContent.style.display = "block";

    document.getElementById("pageTitle").textContent =
        "Travel Community";

    showAllPosts();

}


// ================= PROFILE =================

function showProfile() {

    hideAllPages();

    profileSection.style.display = "block";

    updateProfileStats();

}


// ================= EXPLORE =================

function showExplore() {

    hideAllPages();

    exploreSection.style.display = "block";

}


// ================= BUS ROUTES =================

function showRoutes() {

    hideAllPages();

    routesSection.style.display = "block";

}


// ================= FORUMS =================

function showForums() {

    hideAllPages();

    forumsSection.style.display = "block";

}


// ================= CREATE POST =================

function openCreatePost() {

    createPostPopup.style.display = "flex";

}


function closeCreatePost() {

    createPostPopup.style.display = "none";

    document.getElementById("postRoute").value = "";

    document.getElementById("postCaption").value = "";

    document.getElementById("postPhoto").value = "";

    document.getElementById("photoPreview").innerHTML = "";

}


// ================= PHOTO PREVIEW =================

function previewPhoto(event) {

    const file = event.target.files[0];

    const preview =
        document.getElementById("photoPreview");

    preview.innerHTML = "";

    if (!file) {

        return;

    }

    const image =
        document.createElement("img");

    image.src =
        URL.createObjectURL(file);

    preview.appendChild(image);

}


// ================= CONVERT IMAGE TO BASE64 =================

function convertImageToBase64(file) {

    return new Promise(function(resolve, reject) {

        const reader =
            new FileReader();

        reader.onload = function() {

            resolve(reader.result);

        };

        reader.onerror = function() {

            reject(reader.error);

        };

        reader.readAsDataURL(file);

    });

}


// ================= PUBLISH POST =================

async function publishPost() {

    const route =
        document.getElementById("postRoute").value.trim();

    const caption =
        document.getElementById("postCaption").value.trim();

    const photoInput =
        document.getElementById("postPhoto");


    if (route === "" || caption === "") {

        alert(
            "Please enter route and travel experience."
        );

        return;

    }


    let photoData = "";


    if (photoInput.files.length > 0) {

        const file =
            photoInput.files[0];


        if (file.size > 2 * 1024 * 1024) {

            alert(
                "Please choose an image smaller than 2 MB."
            );

            return;

        }


        try {

            photoData =
                await convertImageToBase64(file);

        } catch (error) {

            alert(
                "Unable to save the image."
            );

            return;

        }

    }


    const post = {

        id:
            Date.now().toString(),

        user:
            currentUser,

        route:
            route,

        caption:
            caption,

        photo:
            photoData,

        likes:
            0,

        category:
            "route destination",

        createdAt:
            new Date().toISOString()

    };


    savedPosts.unshift(post);

    savePosts();


    renderAllPosts();


    closeCreatePost();


    alert(
        "Post published and saved successfully!"
    );


}


// ================= CREATE POST HTML =================

function createPostElement(post) {

    const newPost =
        document.createElement("div");

    newPost.className = "post";

    newPost.setAttribute(
        "data-category",
        post.category
    );

    newPost.setAttribute(
        "data-post-id",
        post.id
    );


    // POST HEADER

    const postHeader =
        document.createElement("div");

    postHeader.className =
        "post-header";


    const avatar =
        document.createElement("div");

    avatar.className =
        "user-avatar";

    avatar.textContent =
        post.user.charAt(0).toUpperCase();


    const userInfo =
        document.createElement("div");


    const userName =
        document.createElement("h3");

    userName.innerHTML =
        post.user +
        " <span class='verified'>✓ Verified</span>";


    const userRoute =
        document.createElement("p");

    userRoute.textContent =
        post.route;


    userInfo.appendChild(userName);

    userInfo.appendChild(userRoute);


    postHeader.appendChild(avatar);

    postHeader.appendChild(userInfo);


    // POST IMAGE

    const postImage =
        document.createElement("div");

    postImage.className =
        "post-image";


    if (post.photo !== "") {

        const image =
            document.createElement("img");

        image.src =
            post.photo;

        postImage.appendChild(image);

    } else {

        postImage.textContent =
            "🚌";


        const imageText =
            document.createElement("span");

        imageText.textContent =
            "My Travel Post";

        postImage.appendChild(imageText);

    }


    // ACTIONS

    const actions =
        document.createElement("div");

    actions.className =
        "post-actions";


    const likeButton =
        document.createElement("button");

    likeButton.textContent =
        "❤️ Like";


    if (savedLikes[post.id]) {

        likeButton.classList.add("liked");

        likeButton.textContent =
            "❤️ Liked";

    }


    likeButton.onclick =
        function() {

            likePost(this);

        };


    const commentButton =
        document.createElement("button");

    commentButton.textContent =
        "💬 Comment";


    commentButton.onclick =
        function() {

            toggleComments(this);

        };


    const shareButton =
        document.createElement("button");

    shareButton.textContent =
        "📤 Share";


    shareButton.onclick =
        function() {

            sharePost(this);

        };


    const reportButton =
        document.createElement("button");

    reportButton.textContent =
        "🚨 Report";


    reportButton.onclick =
        function() {

            reportPost(this);

        };


    actions.appendChild(likeButton);

    actions.appendChild(commentButton);

    actions.appendChild(shareButton);

    actions.appendChild(reportButton);


    // LIKES

    const likes =
        document.createElement("p");

    likes.className =
        "likes";

    likes.textContent =
        post.likes + " likes";


    // CAPTION

    const captionText =
        document.createElement("p");

    captionText.className =
        "caption";

    captionText.textContent =
        post.caption;


    // COMMENTS SECTION

    const commentsSection =
        document.createElement("div");

    commentsSection.className =
        "comments-section";


    const commentInput =
        document.createElement("input");

    commentInput.type =
        "text";

    commentInput.className =
        "comment-input";

    commentInput.placeholder =
        "Write a comment...";


    const commentButtonPost =
        document.createElement("button");

    commentButtonPost.textContent =
        "Post";


    commentButtonPost.onclick =
        function() {

            addComment(this);

        };


    const commentsList =
        document.createElement("div");

    commentsList.className =
        "comments-list";


    commentsSection.appendChild(
        commentInput
    );

    commentsSection.appendChild(
        commentButtonPost
    );

    commentsSection.appendChild(
        commentsList
    );


    // ADD EVERYTHING

    newPost.appendChild(
        postHeader
    );

    newPost.appendChild(
        postImage
    );

    newPost.appendChild(
        actions
    );

    newPost.appendChild(
        likes
    );

    newPost.appendChild(
        captionText
    );

    newPost.appendChild(
        commentsSection
    );


    // LOAD SAVED COMMENTS

    loadComments(
        post.id,
        commentsList
    );


    return newPost;

}


// ================= RENDER POSTS =================

function renderAllPosts() {

    const postsContainer =
        document.getElementById(
            "postsContainer"
        );


    postsContainer.innerHTML = "";


    // ADD SAVED POSTS FIRST

    savedPosts.forEach(
        function(post) {

            postsContainer.appendChild(
                createPostElement(post)
            );

        }
    );


    // STATIC POSTS

    const staticPosts = [

        {
            user: "Khushboo",
            route: "Jabalpur → Bhopal",
            caption:
                "The bus journey was very nice. The route was beautiful and the journey was very comfortable.",
            likes: 500,
            category: "route destination"
        },

        {
            user: "Amrita",
            route: "Delhi → Jabalpur",
            caption:
                "Delhi trip was very nice. Sharing my journey and travel tips with everyone.",
            likes: 90,
            category: "destination"
        },

        {
            user: "Anaya",
            route: "Amritsar → Punjab",
            caption:
                "My Amritsar journey was very adventurous. I really enjoyed the journey.",
            likes: 1000,
            category: "destination"
        },

        {
            user: "Miska",
            route: "Goa → Sri Lanka",
            caption:
                "My Goa to Sri Lanka journey was too good.",
            likes: 143,
            category: "route destination"
        }

    ];


    staticPosts.forEach(
        function(post, index) {

            const postObject = {

                id:
                    "static-" + index,

                user:
                    post.user,

                route:
                    post.route,

                caption:
                    post.caption,

                photo:
                    "",

                likes:
                    post.likes,

                category:
                    post.category

            };


            postsContainer.appendChild(
                createPostElement(
                    postObject
                )
            );

        }
    );


    updateProfileStats();

}


// ================= LIKE POST =================

function likePost(button) {

    const post =
        button.closest(".post");


    const postId =
        post.getAttribute(
            "data-post-id"
        );


    const likesText =
        post.querySelector(
            ".likes"
        );


    let likes =
        parseInt(
            likesText.textContent
        );


    if (
        button.classList.contains(
            "liked"
        )
    ) {

        likes--;

        button.classList.remove(
            "liked"
        );

        button.textContent =
            "❤️ Like";

        savedLikes[postId] =
            false;

    } else {

        likes++;

        button.classList.add(
            "liked"
        );

        button.textContent =
            "❤️ Liked";

        savedLikes[postId] =
            true;

    }


    likesText.textContent =
        likes + " likes";


    // SAVE LIKE

    saveLikes();


    // UPDATE SAVED POST

    const savedPost =
        savedPosts.find(
            function(item) {

                return item.id === postId;

            }
        );


    if (savedPost) {

        savedPost.likes =
            likes;

        savePosts();

    }


    updateProfileStats();

}


// ================= COMMENTS =================

function toggleComments(button) {

    const post =
        button.closest(".post");


    const commentsSection =
        post.querySelector(
            ".comments-section"
        );


    if (
        commentsSection.style.display ===
        "block"
    ) {

        commentsSection.style.display =
            "none";

    } else {

        commentsSection.style.display =
            "block";

    }

}


// ================= ADD COMMENT =================

function addComment(button) {

    const post =
        button.closest(".post");


    const postId =
        post.getAttribute(
            "data-post-id"
        );


    const commentsSection =
        button.closest(
            ".comments-section"
        );


    const input =
        commentsSection.querySelector(
            ".comment-input"
        );


    const commentsList =
        commentsSection.querySelector(
            ".comments-list"
        );


    const commentText =
        input.value.trim();


    if (commentText === "") {

        alert(
            "Please write a comment."
        );

        return;

    }


    if (!savedComments[postId]) {

        savedComments[postId] = [];

    }


    savedComments[postId].push({

        user:
            currentUser,

        text:
            commentText

    });


    saveComments();


    const comment =
        document.createElement("p");


    comment.textContent =
        "👤 " +
        currentUser +
        ": " +
        commentText;


    commentsList.appendChild(
        comment
    );


    input.value = "";


    totalComments++;


    updateProfileStats();

}


// ================= LOAD COMMENTS =================

function loadComments(
    postId,
    commentsList
) {

    const comments =
        savedComments[postId] || [];


    comments.forEach(
        function(item) {

            const comment =
                document.createElement("p");


            comment.textContent =
                "👤 " +
                item.user +
                ": " +
                item.text;


            commentsList.appendChild(
                comment
            );

        }
    );

}


// ================= SHARE =================

function sharePost(button) {

    const post =
        button.closest(".post");


    const caption =
        post.querySelector(
            ".caption"
        ).textContent;


    if (
        navigator.share
    ) {

        navigator.share({

            title:
                "TravelBus",

            text:
                caption,

            url:
                window.location.href

        });

    } else {

        navigator.clipboard.writeText(
            caption +
            " - TravelBus"
        );


        alert(
            "Post copied! You can share it now."
        );

    }

}


// ================= REPORT =================

function reportPost(button) {

    const post =
        button.closest(".post");


    const userName =
        post.querySelector(
            "h3"
        ).textContent;


    const caption =
        post.querySelector(
            ".caption"
        ).textContent;


    const reportContainer =
        document.getElementById(
            "reportedPosts"
        );


    const noReports =
        reportContainer.querySelector(
            ".no-reports"
        );


    if (noReports) {

        noReports.remove();

    }


    const reportItem =
        document.createElement("div");


    reportItem.className =
        "report-item";


    const text =
        document.createElement("p");


    text.textContent =
        "Reported post by " +
        userName +
        ": " +
        caption;


    const removeButton =
        document.createElement("button");


    removeButton.className =
        "remove-btn";


    removeButton.textContent =
        "Remove Post";


    removeButton.onclick =
        function() {

            const postId =
                post.getAttribute(
                    "data-post-id"
                );


            savedPosts =
                savedPosts.filter(
                    function(item) {

                        return item.id !== postId;

                    }
                );


            savePosts();


            post.remove();

            reportItem.remove();

            checkReports();

            updateProfileStats();

        };


    const dismissButton =
        document.createElement("button");


    dismissButton.className =
        "dismiss-btn";


    dismissButton.textContent =
        "Dismiss";


    dismissButton.onclick =
        function() {

            reportItem.remove();

            checkReports();

        };


    reportItem.appendChild(
        text
    );


    reportItem.appendChild(
        removeButton
    );


    reportItem.appendChild(
        dismissButton
    );


    reportContainer.appendChild(
        reportItem
    );


    alert(
        "Post reported. Admin can review it from Moderation."
    );


    showAdmin();

}


// ================= CHECK REPORTS =================

function checkReports() {

    const reportContainer =
        document.getElementById(
            "reportedPosts"
        );


    if (
        reportContainer.children.length ===
        0
    ) {

        const message =
            document.createElement("p");


        message.className =
            "no-reports";


        message.textContent =
            "No reported posts.";


        reportContainer.appendChild(
            message
        );

    }

}


// ================= ADMIN =================

function showAdmin() {

    hideAllPages();


    const adminSection =
        document.getElementById(
            "adminSection"
        );


    adminSection.style.display =
        "block";

}


// ================= PROFILE STATS =================

function updateProfileStats() {

    const posts =
        document.querySelectorAll(
            "#postsContainer .post"
        ).length;


    document.getElementById(
        "profilePosts"
    ).textContent =
        posts;


    document.getElementById(
        "profileLikes"
    ).textContent =
        totalLikes;


    document.getElementById(
        "profileComments"
    ).textContent =
        totalComments;


    document.getElementById(
        "activityPosts"
    ).textContent =
        posts;


    document.getElementById(
        "activityLikes"
    ).textContent =
        totalLikes;


    document.getElementById(
        "activityComments"
    ).textContent =
        totalComments;

}


// ================= EDIT PROFILE =================

function editProfile() {

    const newName =
        prompt(
            "Enter your profile name:",
            currentUser
        );


    if (
        newName !== null &&
        newName.trim() !== ""
    ) {

        currentUser =
            newName.trim();


        alert(
            "Profile name updated successfully!"
        );

    }

}


// ================= FILTER POSTS =================

function filterPosts(category) {

    hideAllPages();


    mainContainer.style.display =
        "grid";


    const posts =
        document.querySelectorAll(
            "#postsContainer .post"
        );


    posts.forEach(
        function(post) {

            const postCategory =
                post.getAttribute(
                    "data-category"
                );


            if (
                postCategory.includes(
                    category
                )
            ) {

                post.style.display =
                    "block";

            } else {

                post.style.display =
                    "none";

            }

        }
    );


    document.getElementById(
        "pageTitle"
    ).textContent =
        "Explore Results";

}


// ================= SHOW ALL POSTS =================

function showAllPosts() {

    hideAllPages();


    mainContainer.style.display =
        "grid";


    const posts =
        document.querySelectorAll(
            "#postsContainer .post"
        );


    posts.forEach(
        function(post) {

            post.style.display =
                "block";

        }
    );


    document.getElementById(
        "pageTitle"
    ).textContent =
        "Travel Community";

}


// ================= POPULAR POSTS =================

function showPopularPosts() {

    hideAllPages();


    mainContainer.style.display =
        "grid";


    const posts =
        document.querySelectorAll(
            "#postsContainer .post"
        );


    posts.forEach(
        function(post) {

            const likesText =
                post.querySelector(
                    ".likes"
                ).textContent;


            const likes =
                parseInt(
                    likesText
                );


            if (
                likes >= 500
            ) {

                post.style.display =
                    "block";

            } else {

                post.style.display =
                    "none";

            }

        }
    );


    document.getElementById(
        "pageTitle"
    ).textContent =
        "🔥 Popular Posts";

}


// ================= FORUM =================

function openForum(title) {

    currentForum =
        title;


    document.getElementById(
        "forumTitle"
    ).textContent =
        title;


    document.getElementById(
        "forumPopup"
    ).style.display =
        "flex";


    loadForumMessages();

}


function closeForum() {

    document.getElementById(
        "forumPopup"
    ).style.display =
        "none";

}


// ================= POST FORUM MESSAGE =================

function postForumMessage() {

    const messageInput =
        document.getElementById(
            "forumMessage"
        );


    const message =
        messageInput.value.trim();


    if (message === "") {

        alert(
            "Please write your discussion."
        );

        return;

    }


    if (!savedForums[currentForum]) {

        savedForums[currentForum] = [];

    }


    savedForums[currentForum].push({

        user:
            currentUser,

        message:
            message

    });


    saveForums();


    loadForumMessages();


    messageInput.value = "";


    alert(
        "Discussion saved in " +
        currentForum
    );

}


// ================= LOAD FORUM MESSAGES =================

function loadForumMessages() {

    const messageContainer =
        document.getElementById(
            "forumMessages"
        );


    messageContainer.innerHTML = "";


    const messages =
        savedForums[currentForum] || [];


    messages.forEach(
        function(item) {

            const messageBox =
                document.createElement(
                    "div"
                );


            messageBox.className =
                "forum-message";


            messageBox.textContent =
                "👤 " +
                item.user +
                ": " +
                item.message;


            messageContainer.appendChild(
                messageBox
            );

        }
    );

}


// ================= LOGIN =================

function openLogin() {

    const loginButton =
        document.querySelector(
            ".login-btn"
        );


    if (
        loginButton.textContent ===
        "Logout"
    ) {

        loginButton.textContent =
            "Login";


        currentUser =
            "Khushboo";


        alert(
            "You have been logged out."
        );


        return;

    }


    loginPopup.style.display =
        "flex";

}


// ================= CLOSE LOGIN =================

function closeLogin() {

    loginPopup.style.display =
        "none";

}


// ================= LOGIN USER =================

function loginUser() {

    const name =
        document.getElementById(
            "loginName"
        ).value.trim();


    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        ).value.trim();


    if (
        name === "" ||
        email === "" ||
        password === ""
    ) {

        alert(
            "Please fill all fields."
        );

        return;

    }


    currentUser =
        name;


    alert(
        "Login successful! Welcome " +
        name
    );


    loginPopup.style.display =
        "none";


    document.querySelector(
        ".login-btn"
    ).textContent =
        "Logout";


    document.getElementById(
        "loginName"
    ).value = "";


    document.getElementById(
        "loginEmail"
    ).value = "";


    document.getElementById(
        "loginPassword"
    ).value = "";

}


// ================= PAGE LOADED =================

renderAllPosts();


console.log(
    "TravelBus JavaScript loaded successfully!"
);





