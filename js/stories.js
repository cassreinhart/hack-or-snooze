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
  const showStar = Boolean(currentUser); //if logged in, show fav/unfav star
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

function storyIsCurrentUserStory(story) {
    return currentUser.ownStories.includes(story) ? true : false;
} // did not end up implementing this function due to bug

function getTrashCanHTML() {
  return `<i class='fas fa-trash fa-9x' 
          style='color:#808080'></i>`
}

function putCurrentUserStoriesOnPage(currentUser) {
  const ownStories = currentUser.ownStories;

  for (let story of ownStories) {
    const $userStory = function() {
      return $(`
    <li id="${story.storyId}">
    ${showStar ? getStarHTML(story, currentUser) : ""}
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    ${currentUser.ownStories.includes(story) ? getTrashCanHTML() : ""}
    </li>
  `);
    }
    console.log(story);
    $userStories.append($userStory); 
  }
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
  const isFav = user.isFavorite(story.storyId);
  const starType = isFav ? "fas" : "far";
  return `<span class="star">
            <i class="${starType} fa-star">
            </i>
          </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

async function putStoriesOnPage() {
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
  console.debug("submitNewStory");
  evt.preventDefault();
  console.debug("submitNewStory");

  //get data from form
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#story-url").val();
  const user = currentUser;
  const storyData = {author, title, url};

// create story from data and add story to the page
  const story = await storyList.addStory(user, storyData);
  console.log(story)
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitStoryForm.slideUp(1000);
  $submitStoryForm.trigger('reset');
}

$submitStoryForm.on("submit", submitNewStory);

function deleteStory(evt) {
  console.debug('deleteStory');
  $userStories.empty();

  const $closestLi = $(evt.target).closest('li');
  const storyId = $closestLi.attr('id');

  storyList.removeStory(storyId);
  putCurrentUserStoriesOnPage(currentUser);
}

function toggleStar(evt) {
  evt.preventDefault();
  const $target = evt.target;
  const $star = $target.closest('i');
  const storyLi = $star.closest('li');
  const storyId = storyLi.id; 

  //retrieve story object, use the object to pass into 
  if ($star.classList.contains("far")) {
    $star.classList.remove("far");
    $star.classList.add("fas"); //change to "filled" star
    currentUser.favoriteStory(story); //add story to favorites array 
  } else {
    $star.classList.remove("fas");
    $star.classList.add("far"); //keep as empty star
    currentUser.removeFavorite(story);
    return currentUser.favorites = currentUser.favorites.filter(story => {
      storyId !== story.id;
    }); //return new arr
  }
}

$storiesLists.on("click", ".star", toggleStar);

$userStories.on('click', '.fa-trash', deleteStory);
