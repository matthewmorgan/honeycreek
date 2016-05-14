var serverAddress = 'http://honey-server.apps.dulcetsoftware.com';

var pswpElement = document.querySelectorAll('.pswp')[0];

// build items array
//var items = [
//  {
//    src: 'https://placekitten.com/600/400',
//    w: 600,
//    h: 400
//  },
//  {
//    src: 'https://placekitten.com/1200/900',
//    w: 1200,
//    h: 900
//  }
//];


function initGallery(images){
  // define options (if needed)
  var options = {
    // optionName: 'option value'
    // for example:
    index: 0 // start at first slide
  };

// Initializes and opens PhotoSwipe
  var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, images, options);
  gallery.init();
}

function fetchAllImages(callback) {
  superagent
      .get(serverAddress + '/cloudinary/imagegallery')
      .end(function (err, result) {
        if (err) throw err;
        result = JSON.parse(result.text);
        console.log(result);
        var imageArray = result.reduce(function (acc, resource) {
          acc.push({
            src: resource.secure_url,
            w: 600,
            h: 600,
            title: extractCaption(resource)
          });
          return acc;
        }, []);
        callback(imageArray);
      })
}

fetchAllImages(initGallery);

function extractCaption(image){
  var tags = image['tags'];
  var caption ='';
  tags.forEach((tag) => {
    if (tag.match('^caption-')){
      caption = tag.split('').splice(8).join('');
    }
  });
  return caption;
}
