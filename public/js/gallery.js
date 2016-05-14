$(document).ready(function () {
  var serverAddress = 'http://honey-server.apps.dulcetsoftware.com';

  var pswpElement = document.querySelectorAll('.pswp')[0];

  function initGallery(images, startingImageIndex) {
    // define options (if needed)
    var index = startingImageIndex || 0;
    var options = {
      // optionName: 'option value'
      // for example:
      index: index //0 is first slide
    };

// Initializes and opens PhotoSwipe
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, images, options);
    gallery.init();
  }

  function fetchAllImages(callback) {
    superagent
        .get(serverAddress + '/cloudinary/imagegallery')
        .end(function (err, result) {
          if (err) throw err;
          result = JSON.parse(result.text);
          console.log(result);
          var imageNames = [];
          var imageArray = result.reduce(function (acc, resource) {
            acc.push({
              src:   resource.secure_url,
              w:     600,
              h:     600,
              title: extractCaption(resource)
            });
            imageNames.push(extractName(resource.secure_url));
            return acc;
          }, []);
          var referringImageName = getReferringImageName();
          console.log('referringImageName', referringImageName);
          var referringImageId = getReferringImageIndex(referringImageName, imageNames);
          console.log('referringImageId', referringImageId);
          callback(imageArray, referringImageId);
        })
  }

  function extractName(url){
    var frags = url.split('/');
    return frags[frags.length-1].split('.')[0];
  }

  function getReferringImageIndex(name, names){
    return names.indexOf(name) >= 0 ? names.indexOf(name) : 0;
  }

  function getReferringImageName(){
    return document.getElementById('referrer').dataset['name'] || '';
  }

  fetchAllImages(initGallery);

  function extractCaption(image) {
    var tags = image['tags'];
    var caption = '';
    tags.forEach((tag) => {
      if (tag.match('^caption-')) {
        caption = tag.split('').splice(8).join('');
      }
    });
    return caption;
  }

});
