$(document).ready(function () {
  console.log('Hello world!');
  // /*
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // Comments go here.
  // */
  searchOpenLibrary({
    title: 'The Lord of the Rings',
    author: 'tolkein',
  }).then(function (response) {
    console.log(response);
    getBookInformation(response.docs[0].key).then(function (bookResponse) {
      console.log(bookResponse);
    });
  });
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
  var baseUrl = 'https://openlibrary.org/search.json';
  var queryUrl = baseUrl + '?';
  if (typeof searchQuery !== 'object') {
    return;
  }
  queryUrl += $.param(searchQuery);
  return $.ajax({
    url: queryUrl,
    method: 'GET',
  });
}

/*
 * Expects the bookKey taken from the result of a searchOpenLibrary call
 * if response is what is returned from searchOpenLibrary then you would pass
 * response.docs[i].key to this function to get detailed book information about the specific book,
 * where i is the index of the book to search for
 */
function getBookInformation(bookKey) {
  var baseUrl = 'https://openlibrary.org';
  var queryUrl = baseUrl + bookKey + '.json';
  return $.ajax({
    url: queryUrl,
    method: 'GET',
  });
}
