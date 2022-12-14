"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $storiesLists = $(".stories-list")

const $favoritesList = $("#favorites-list");
const $star = $(".star");
const $noFavoritesHeader = $("#no-favs-yet");
const $trash = $('.fa-trash');

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navLink = $('.nav-link');
const $navStoryFunctionality = $('#nav-story-functionality');
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

const $navSubmitStory = $("#nav-submit-story");
const $navFavorites = $("#nav-favorites");
const $navMyStories = $("#nav-my-stories"); 

const $userStories = $("#user-stories");

const $submitStoryForm = $("#submit-story-form");
const $authorInput = $("#author");
const $titleInput = $("#title");
const $urlInput = $("#story-url");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.           indiv comp....?????
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $userStories,
    $favoritesList,
    $submitStoryForm,
    $loginForm,
    $signupForm,
    $noFavoritesHeader
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app           ??add evt listener for DOM load??

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
