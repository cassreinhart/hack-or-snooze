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
  $userStories.empty();
  console.debug("navUserStories", evt);
  // evt.preventDefault();
  const ownStories = currentUser.ownStories;

  hidePageComponents();
  putCurrentUserStoriesOnPage(currentUser);
  // for (let story of ownStories) {
  //   const $userStory = generateStoryMarkup(story)
  //   console.log(story);
  //   $userStories.append($userStory); //user stories is the ol, so this won't work to append a story
  // }
  
  $userStories.show();
}

$navMyStories.on('click', navUserStories);

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $favoritesList.empty();

  hidePageComponents();
  console.log($favoritesList.length);
  console.log(currentUser.favorites.length);
  // if ($favoritesList.length < currentUser.favorites.length){
    if (currentUser.favorites.length === 0) {
      $favoritesList.append("<h3 id='no-favs-yet'>No Favorites Yet!</h3>");
    } else {
      for (let story of currentUser.favorites) {
        const $favoriteStory = generateFavoriteMarkup(story);
        console.log($favoriteStory);
        $favoritesList.append($favoriteStory);
      }
    }
  //   return "Favorites"
  // }
  $favoritesList.show();
}

$navFavorites.on("click", putFavoritesOnPage);