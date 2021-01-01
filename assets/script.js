var listenKey = "4f3fcf91ea69455db9ab9bad6c285f61";
$(document).ready(function () {
  console.log("Hello world!");
  // /*
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // */

//   listenApiSearch({
//     q: "The Lord of the Rings",
//   }).then(function (response) {
//     console.log(response);
//     showPodcastEpisodeResults(response.results);
//     listenApiGetPodcast(response.results[0].podcast.id).then(function (
//       podResponse
//     ) {
//       console.log(podResponse);
//     });
//   });
});

/*
 * Expects an object in the form of
 *{
 *    title: "The Lord of the Rings",
 *    author: "Tolkein"
 *    person: "Zodiac Killer"
 *}
 *at least one property needs to exist for the query to perform properly.
 *
 */
function searchOpenLibrary(searchQuery) {
  var baseUrl = "https://openlibrary.org/search.json";
  var queryUrl = baseUrl + "?";
  if (typeof searchQuery !== "object") {
    return;
  }
  queryUrl += $.param(searchQuery);
  return $.ajax({
    url: queryUrl,
    method: "GET",
  });
}

/*
 * Expects the bookKey taken from the result of a searchOpenLibrary call
 * if response is what is returned from searchOpenLibrary then you would pass
 * response.docs[i].key to this function to get detailed book information about the specific book,
 * where i is the index of the book to search for
 */
function getBookInformation(bookKey) {
  var baseUrl = "https://openlibrary.org";
  var queryUrl = baseUrl + bookKey + ".json";
  return $.ajax({
    url: queryUrl,
    method: "GET",
  });
}

/*
 * searchQuery should be an object with at least a q property and any of the optional parameters
 * specified by the API docs.
 * {
 *   q: 'my favorite murder'
 * }
 * returns the jQuery ajax promise
 */
function listenApiSearch(searchQuery) {
  if (typeof searchQuery !== "object") {
    return;
  }
  var baseUrl = "https://listen-api.listennotes.com/api/v2/search?";
  var queryUrl = (baseUrl += $.param(searchQuery));
  return $.ajax({
    url: queryUrl,
    method: "GET",
    headers: {
      "X-ListenAPI-Key": listenKey,
    },
  });
}

/*
 * Expects the ID of the podcast to get more information for.
 * Returns the jQuery ajax promise.
 */
function listenApiGetPodcast(podcastId) {
  if (podcastId === null || podcastId === undefined) {
    return;
  }
  var baseUrl = "https://listen-api.listennotes.com/api/v2/podcasts/";
  var fullUrl = baseUrl + podcastId;
  return $.ajax({
    url: fullUrl,
    method: "GET",
    headers: {
      "X-ListenAPI-Key": listenKey,
    },
  });
}

function showPodcastEpisodeResults(results) {
  // Empty container element
  $("#site-description").addClass("d-none");
  $("#podcast-list").empty().attr("style", "display: block;");

  results.forEach(function (item) {
    var div = $("<div>").addClass("clearfix border");
    var img = $("<img>")
      .attr("src", item.thumbnail)
      .addClass("float-start me-3");
    var epTitle = $("<p>").text(item.title_original);
    var podTitle = $("<p>").text(item.podcast.title_original);
    var epDesc = $("<p>").text(item.description_original).addClass('episode-description');
    var genresDiv = $("<p>");
    // item.podcast.genre_ids.forEach(function (id) {
    //     var span = $('<span>').text(id).addClass('border rounded-pill p-2 me-3');
    //     genresDiv.append(span);
    // });
    div.append(img, epTitle, podTitle, epDesc, genresDiv);
    $("#podcast-list").append(div);
  });
}

function showPodcastResults(results) {
  // Empty container element
  $("#site-description").addClass("d-none");
  $("#podcast-list").empty().addClass("d-block");

  results.forEach(function (item) {
    var div = $("<div>").addClass("clearfix border");
    var img = $("<img>")
      .attr("src", item.thumbnail)
      .addClass("float-start me-3");
    var podTitle = $("<p>").text(item.title_original);
    var podDesc = $("<p>").text(item.description_original);
    var genresDiv = $("<p>");
    // item.podcast.genre_ids.forEach(function (id) {
    //     var span = $('<span>').text(id).addClass('border rounded-pill p-2 me-3');
    //     genresDiv.append(span);
    // });
    div.append(img, podTitle, podDesc);
    $("#podcast-list").append(div);
  });
}

$("#search-button").on("click", function (event) {
  event.preventDefault();
  var inputTitle = $("#book-search").val().trim();
  var inputAuthor = $("#author-search").val().trim();

  var queryObj = {};
  if (inputAuthor !== "") {
    queryObj.author = inputAuthor;
  }

  if (inputTitle !== "") {
    queryObj.title = inputTitle;
  }

  // Example usage of the two APIs.
  searchOpenLibrary(queryObj).then(function (response) {
    console.log(response);

    $("#site-description").attr("style", "display: none");
    $("#hidden").attr("style", "display: block");
    var bookList = $("#books-list");
    var podcastList = $('#podcast-list');

    if (bookList !== null) {
      bookList.empty();
      podcastList.empty();
    }
    
    for (var i = 0; i < response.docs.length; i++) {
      var responseImg = response.docs[i].cover_i;
      var bookResult = $("<div>").attr("style", "display:flex");
      var textResult = $("<div>").addClass("ps-2 flex-grow-1");
      var searchTitleBtn = $("<button>").text('Search Title').attr('data-title', response.docs[i].title);
      var searchAuthorBtn = $("<button>").text('Search Author').attr('data-author', response.docs[i].author_name);
        
      searchTitleBtn.addClass("search-title-btn my-4 mr-3 btn btn-dark listen-btn");
      searchAuthorBtn.addClass('search-author-btn my-4 mr-3 btn btn-dark listen-btn');

      var bookTitle = $("<div>").text(response.docs[i].title);
      var authorText = $("<div>").text(response.docs[i].author_name);
      var coverImage = $("<img>").attr(
        "src",
        "http://covers.openlibrary.org/b/id/" + responseImg + "-M.jpg"
      );
      var bookLink = $("<a>").text(
        "For complete book description, click here."
      );
      bookLink.attr("href", "https://openlibrary.org/" + response.docs[i].key);

      textResult.append(bookTitle, authorText, bookLink);
      bookResult.append(coverImage, textResult, searchTitleBtn, searchAuthorBtn);
      bookList.append(bookResult);

  
    }

    $('.search-title-btn').on('click', function () {
      console.log($(this).attr('data-title'));
      var title = $(this).attr('data-title');
      var queryObj = {};
      if (title && title !== '') {
          queryObj.q = title;
      }

      listenApiSearch(queryObj).then(function (podResponse) {
        console.log(podResponse);
        showPodcastEpisodeResults(podResponse.results);
      });
    });
    
    $('.search-author-btn').on('click', function () {
      console.log($(this).attr('data-author'));
      var author = $(this).attr('data-author');
      var queryObj = {};
      if (author && author !== '') {
        queryObj.q = author;
      }

      listenApiSearch(queryObj).then(function (podResponse) {
        console.log(podResponse);
        showPodcastEpisodeResults(podResponse.results);
      });
    });

  });

  
});

