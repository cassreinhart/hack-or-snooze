"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);
  const showStar = Boolean(currentUser);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      ${getTrashCanHTML()}
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(evt) {
  evt.preventDefault();
  console.debug("submitNewStory");

  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#story-url").val();
  const storyData = {author, title, url};

  const story = await storyList.addStory(currentUser, storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitStoryForm.slideUp("slow");
  $submitStoryForm.trigger('reset');
}

$submitStoryForm.on("submit", submitNewStory);

function getTrashCanHTML() {
  return `<span class="trash">
            <i class="fa-solid fa-trash-can">
            </i>
          </span>`;
}

function generateFavoriteMarkup(story) {
  console.debug("generateFavoriteMarkup", story);
  const showStar = Boolean(currentUser);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getStarHTML(story, user) {
  const isFav = user.isFavorite(story);
  const starType = isFav ? "fas" : "far";
  return `<span class="star">
            <i class="${starType} fa-star">
            </i>
          </span>`;
}

function toggleStar(evt) {
  console.log("CLICK"); /////this doesn't log, which indicates issue w/click handler
  const star = evt.target;
  const story = evt.target.closest('li');
  const listItemId = story.this.id; //how to extract story from li above?????

  if (isFav) {
    star.addClass("fas"); //change to "filled" star
    user.favoriteStory(story); //add story to favorites array ///////////this wont work 
  } else {
    star.addClass("far"); //keep as empty star
    // removeStory(story);
    user.removeFavorite(story);
  }
}

$star.on("click", toggleStar); ///////this isn't working either- issue with selector??

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  hidePageComponents();

  if (!currentUser.favorites) {
    $favoritesList.append("<h3>No Favorites Yet!</h3>");
  } else {
    for (let story of currentUser.favorites) {
      const $favorite = generateFavoriteMarkup(story);
      $favoritesList.append($favorite);
    }
  }

  $favoritesList.show();
}

$navFavorites.on("click", putFavoritesOnPage);

$trash.on('click', storyList.removeStory(evt.target.closest('li'))); //////////

function showUserStories(user) {
  evt.preventDefault();
  const ownStories = user.ownStories;

  hidePageComponents();
  for (let story of ownStories) {
    $userStories.append(story);
  }
  // for (let story of storyList) {
  //   if (story.username === user.username)  {
  //     $userStories.prepend(story);
  //   }
  // }
  $userStories.show();
}

$navMyStories.on('click', showUserStories);