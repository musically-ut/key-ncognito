var body = document.body;
if (body) {
    // There are pages which do not have the body tag, e.g. links on Google
    // search results page are to a page which only contains a script tag.
    body.addEventListener('click', keyncognitoHandler());
}
