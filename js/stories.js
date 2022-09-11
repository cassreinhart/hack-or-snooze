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
  console.log(currentUser.ownStories);
  console.log(currentUser.ownStories.includes(story.storyId));
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

/** Gets list of stories from server, generates their HTML, and puts on page. */

async function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  console.log(storyList);

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  
  $allStoriesList.show();
}

function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();
  console.debug("submitNewStory");

  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#story-url").val();
  const user = currentUser;
  const storyData = {author, title, url};

  const story = storyList.addStory(user, storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitStoryForm.slideUp(1000);
  $submitStoryForm.trigger('reset');
}

$submitStoryForm.on("submit", submitNewStory);

function getTrashCanHTML() {
  return `<i class='fas fa-trash fa-9x' 
          style='color:#808080'></i>`
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

function toggleStar(evt) {
  evt.preventDefault();
  const $target = evt.target;
  const $star = $target.closest('i');
  const storyLi = $star.closest('li');
  console.log(storyLi);
  const storyId = storyLi.id; 

  //retrieve story object, use the object to pass into 
  if ($star.classList.contains("far")) {
    // $star.closest('i').toggleClass("fas far");
    $star.classList.remove("far");
    $star.classList.add("fas"); //change to "filled" star
    currentUser.favoriteStory(storyId); //add story to favorites array 
  } else {
    // $star.closest('i').toggleClass("fas far");
    $star.classList.remove("fas");
    $star.classList.add("far"); //keep as empty star
    currentUser.removeFavorite(storyId);
    return currentUser.favorites = currentUser.favorites.filter(story => {
      storyId !== story.id;
    }); //return new arr
  }
}
$storiesLists.on("click", ".star", toggleStar);
// $star.on("click", toggleStar); ///////this isn't working either- issue with selector??

// $trash.on('click', storyList.removeStory(evt.target.closest('li'))); //////////
$trash.on('click', storyList.removeStory);
