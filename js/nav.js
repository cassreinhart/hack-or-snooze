"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);


/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() { //doesn't hide login/create acct forms /////////
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  // hidePageComponents();
  $submitStoryForm.show();
}

$navSubmitStory.on("click", navSubmitClick);

function navUserStories(evt) {
  console.debug("navUserStories", evt);
  
  $userStories.empty();
  const ownStories = currentUser.ownStories;

  hidePageComponents();
  putCurrentUserStoriesOnPage(currentUser);
  
  $userStories.show();
}

$navMyStories.on('click', navUserStories);

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $favoritesList.empty();

  hidePageComponents();
  
  if (currentUser.favorites.length === 0) {
    $favoritesList.append("<h3 id='no-favs-yet'>No Favorites Yet!</h3>");
  } else {
    for (let story of currentUser.favorites) {
      const $favoriteStory = generateFavoriteMarkup(story);
      $favoritesList.append($favoriteStory);
    }
  }
  $favoritesList.show();
}

$navFavorites.on("click", putFavoritesOnPage);