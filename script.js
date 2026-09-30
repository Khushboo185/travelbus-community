const createPostBtn = document.getElementById("createPostBtn");
const postModal = document.getElementById("postModal");
const closeModal = document.getElementById("closeModal");
const cancelPost = document.getElementById("cancelPost");

createPostBtn.addEventListener("click", function () {
    postModal.classList.add("show");
});

closeModal.addEventListener("click", function () {
    postModal.classList.remove("show");
});

cancelPost.addEventListener("click", function () {
    postModal.classList.remove("show");
});


/* ---------------- DARK MODE ---------------- */

const darkModeBtn = document.getElementById("darkModeBtn");

function loadTheme() {

    const savedTheme = localStorage.getItem("travelbus-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        darkModeBtn.textContent = "☀️";
    } else {
        document.body.classList.remove("dark");
        darkModeBtn.textContent = "🌙";
    }
}

darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("travelbus-theme", "dark");
        darkModeBtn.textContent = "☀️";

    } else {

        localStorage.setItem("travelbus-theme", "light");
        darkModeBtn.textContent = "🌙";
    }
});

loadTheme();


/* ---------------- CREATE POST ---------------- */

function publishPost() {

    const title = document.getElementById("postTitle").value.trim();
    const category = document.getElementById("postCategory").value;
    const content = document.getElementById("postContent").value.trim();

    if (title === "" || content === "") {
        showToast("Please enter post title and content.");
        return;
    }

    if (content.length < 20) {
        showToast("Post should contain at least 20 characters.");
        return;
    }

    const postContainer = document.getElementById("postContainer");

    const newPost = document.createElement("article");

    newPost.className = "post-card";
    newPost.setAttribute("data-category", category);

    newPost.innerHTML = `
        <div class="post-header">

            <div class="avatar">K</div>

            <div>
                <h3>
                    Khushboo Koshta
                    <span class="verified">✓ Verified</span>
                </h3>

                <p>Just now · Traveler Community</p>
            </div>

        </div>

        <h3 style="margin-top:18px;">${title}</h3>

        <p class="post-text">${content}</p>

        <div class="post-actions">

            <button class="like-btn">
                ♡ <span>0</span>
            </button>

            <button onclick="addComment(this)">
                💬 Comment
            </button>

            <button onclick="sharePost()">
                ↗ Share
            </button>

            <button onclick="reportPost(this)">
                ⚑ Report
            </button>

        </div>

        <div class="comments"></div>
    `;

    postContainer.prepend(newPost);

    attachLikeButton(newPost.querySelector(".like-btn"));

    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";

    postModal.classList.remove("show");

    updatePostCount();

    showToast("Your verified post has been published.");
}


function updatePostCount() {

    const count = document.querySelectorAll(".post-card").length;

    document.getElementById("postCount").textContent = count;
}


/* ---------------- LIKE ---------------- */

function attachLikeButton(button) {

    button.addEventListener("click", function () {

        let count = Number(button.querySelector("span").textContent);

        if (button.classList.contains("liked")) {

            count--;
            button.classList.remove("liked");
            button.innerHTML = "♡ <span>" + count + "</span>";

        } else {

            count++;
            button.classList.add("liked");
            button.innerHTML = "♥ <span>" + count + "</span>";
        }
    });
}


document.querySelectorAll(".like-btn").forEach(function (button) {
    attachLikeButton(button);
});


/* ---------------- COMMENTS ---------------- */

function addComment(button) {

    const post = button.closest(".post-card");
    const comments = post.querySelector(".comments");

    if (comments.querySelector(".comment-box")) {
        return;
    }

    const box = document.createElement("div");

    box.className = "comment-box";

    box.innerHTML = `
        <input type="text" placeholder="Write a comment...">
        <button class="primary-btn">Post</button>
    `;

    comments.appendChild(box);

    box.querySelector("button").addEventListener("click", function () {

        const input = box.querySelector("input");
        const text = input.value.trim();

        if (text === "") {
            showToast("Write a comment first.");
            return;
        }

        const comment = document.createElement("p");

        comment.style.marginTop = "10px";
        comment.innerHTML =
            "<strong>Khushboo:</strong> " + text;

        comments.insertBefore(comment, box);

        input.value = "";
    });
}


/* ---------------- REPORT ---------------- */

function reportPost(button) {

    const post = button.closest(".post-card");

    const confirmed = confirm(
        "Report this post for moderation?"
    );

    if (confirmed) {

        post.style.opacity = "0.6";

        showToast(
            "Post reported. It has been sent for moderation review."
        );
    }
}


/* ---------------- SOCIAL SHARE ---------------- */

function sharePost() {

    if (navigator.share) {

        navigator.share({
            title: "TravelBus Community",
            text: "Check out this travel post on TravelBus."
        });

    } else {

        navigator.clipboard.writeText(
            window.location.href
        );

        showToast("Platform link copied for sharing.");
    }
}


/* ---------------- FILTER POSTS ---------------- */

function filterPosts(category) {

    const posts = document.querySelectorAll(".post-card");

    posts.forEach(function (post) {

        const postCategory = post.getAttribute("data-category");

        if (category === "all" || category === "popular") {

            post.style.display = "block";

        } else if (postCategory === category) {

            post.style.display = "block";

        } else {

            post.style.display = "none";
        }
    });
}


/* ---------------- ROUTE PLANNER ---------------- */

function planRoute() {

    const start =
        document.getElementById("startLocation").value.trim();

    const destination =
        document.getElementById("destination").value.trim();

    const waypoint =
        document.getElementById("waypoint").value.trim();

    if (start === "" || destination === "") {

        showToast(
            "Please enter start location and destination."
        );

        return;
    }

    const routeResults =
        document.getElementById("routeResults");

    const waypointText =
        waypoint === ""
            ? "Direct route"
            : "Via " + waypoint;

    routeResults.innerHTML = `

        <div class="route-card">

            <h3>🚦 Recommended Route</h3>

            <p>
                ${start} → ${waypointText} → ${destination}
            </p>

            <div class="route-details">
                <span>📏 310 km</span>
                <span>⏱️ 7 hr 20 min</span>
                <span>🚦 Moderate traffic</span>
            </div>

            <p>
                Current traffic: Moderate congestion.
                Estimated delay: 15 minutes.
            </p>

            <button
                class="secondary-btn save-route"
                onclick="saveRoute('${start}', '${destination}')"
            >
                ☆ Save Route
            </button>

        </div>


        <div class="route-card">

            <h3>🛣️ Alternative Route</h3>

            <p>
                ${start} → Alternative Highway → ${destination}
            </p>

            <div class="route-details">
                <span>📏 325 km</span>
                <span>⏱️ 6 hr 55 min</span>
                <span>🚦 Low traffic</span>
            </div>

            <p>
                Longer distance but lower traffic impact.
            </p>

            <button
                class="secondary-btn save-route"
                onclick="saveRoute('${start}', '${destination}')"
            >
                ☆ Save Route
            </button>

        </div>
    `;

    showToast("Routes updated with current traffic information.");
}


function saveRoute(start, destination) {

    const routes =
        JSON.parse(
            localStorage.getItem("savedRoutes") || "[]"
        );

    routes.push({
        start: start,
        destination: destination
    });

    localStorage.setItem(
        "savedRoutes",
        JSON.stringify(routes)
    );

    showToast("Route saved successfully.");
}


/* ---------------- NOTIFICATION SETTINGS ---------------- */

function saveNotificationSettings() {

    const settings = {

        email:
            document.getElementById("emailNotification").checked,

        push:
            document.getElementById("pushNotification").checked,

        promotional:
            document.getElementById("promoNotification").checked,

        booking:
            document.getElementById("bookingNotification").checked
    };

    localStorage.setItem(
        "notificationSettings",
        JSON.stringify(settings)
    );

    showToast("Notification preferences saved.");
}


function loadNotificationSettings() {

    const saved =
        JSON.parse(
            localStorage.getItem("notificationSettings")
        );

    if (!saved) {
        return;
    }

    document.getElementById("emailNotification").checked =
        saved.email;

    document.getElementById("pushNotification").checked =
        saved.push;

    document.getElementById("promoNotification").checked =
        saved.promotional;

    document.getElementById("bookingNotification").checked =
        saved.booking;
}

loadNotificationSettings();


/* ---------------- NOTIFICATION RETRY ---------------- */

function retryNotification(button) {

    button.disabled = true;
    button.textContent = "Retrying...";

    setTimeout(function () {

        button.parentElement.querySelector("small").textContent =
            "Delivered just now";

        button.parentElement.querySelector(".notification-content")
            .insertAdjacentHTML(
                "beforeend",
                ""
            );

        button.remove();

        showToast("Notification delivered successfully.");

    }, 1200);
}


/* ---------------- INTERNATIONALIZATION ---------------- */

const translations = {

    en: {

        heroTitle:
            "Your Journey, Our Community",

        heroText:
            "Share your bus journey, discover routes and connect with travelers."
    },

    hi: {

        heroTitle:
            "आपकी यात्रा, हमारा समुदाय",

        heroText:
            "अपनी बस यात्रा साझा करें, रूट खोजें और यात्रियों से जुड़ें।"
    }
};


const languageSelect =
    document.getElementById("languageSelect");


function changeLanguage(language) {

    const translation =
        translations[language] || translations.en;

    document.getElementById("heroTitle").textContent =
        translation.heroTitle;

    document.getElementById("heroText").textContent =
        translation.heroText;

    localStorage.setItem(
        "travelbus-language",
        language
    );

    showToast(
        language === "hi"
            ? "भाषा बदल दी गई है।"
            : "Language changed successfully."
    );
}


languageSelect.addEventListener("change", function () {

    changeLanguage(this.value);

});


function loadLanguage() {

    const savedLanguage =
        localStorage.getItem("travelbus-language") || "en";

    languageSelect.value = savedLanguage;

    changeLanguage(savedLanguage);
}

loadLanguage();


/* ---------------- REVIEWS ---------------- */

let selectedRating = 0;

const starButtons =
    document.querySelectorAll("#starInput button");


starButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        selectedRating =
            Number(this.getAttribute("data-rating"));

        starButtons.forEach(function (star) {

            const rating =
                Number(star.getAttribute("data-rating"));

            if (rating <= selectedRating) {
                star.classList.add("active");
            } else {
                star.classList.remove("active");
            }
        });
    });
});


function submitReview() {

    const text =
        document.getElementById("reviewText")
            .value.trim();

    const message =
        document.getElementById("reviewMessage");


    if (selectedRating === 0) {

        message.textContent =
            "Please select a rating.";

        return;
    }


    if (text.length < 20) {

        message.textContent =
            "Review must contain at least 20 characters.";

        return;
    }


    const review =
        document.createElement("div");

    review.className = "review-card";

    review.innerHTML = `

        <div class="review-user">

            <div class="avatar">K</div>

            <div>

                <h4>
                    Khushboo Koshta
                    <span class="verified">✓ Verified</span>
                </h4>

                <div class="review-stars">
                    ${"★".repeat(selectedRating)}
                    ${"☆".repeat(5 - selectedRating)}
                </div>

            </div>

        </div>

        <p>${text}</p>

        <button
            class="helpful-btn"
            onclick="markHelpful(this)"
        >
            👍 Helpful <span>0</span>
        </button>
    `;

    document.getElementById("reviewsList")
        .prepend(review);


    updateAverageRating(selectedRating);


    document.getElementById("reviewText")
        .value = "";

    selectedRating = 0;

    starButtons.forEach(function (star) {
        star.classList.remove("active");
    });

    message.textContent =
        "Review submitted successfully.";

    showToast("Your verified review has been added.");
}


/* ---------------- AVERAGE RATING ---------------- */

let totalRating = 9;
let totalReviews = 2;


function updateAverageRating(newRating) {

    totalRating += newRating;
    totalReviews++;

    const average =
        (totalRating / totalReviews).toFixed(1);

    document.getElementById("averageRating")
        .textContent = average;

    document.getElementById("reviewCount")
        .textContent = totalReviews;
}


/* ---------------- HELPFUL REVIEWS ---------------- */

function markHelpful(button) {

    const span =
        button.querySelector("span");

    let count =
        Number(span.textContent);

    count++;

    span.textContent = count;

    button.disabled = true;

    showToast("Thanks for your feedback.");
}


/* ---------------- UTILITY ---------------- */

function scrollToSection(id) {

    document.getElementById(id)
        .scrollIntoView({
            behavior: "smooth"
        });
}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2500);
}




