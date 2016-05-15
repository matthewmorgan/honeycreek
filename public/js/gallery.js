var serverAddress = 'http://honey-server.apps.dulcetsoftware.com';

function fetchAllImages(callback) {
  superagent
      .get(serverAddress + '/cloudinary/imagegallery')
      .end(function (err, result) {
        if (err) throw err;
        result = JSON.parse(result.text);
        var imageNames = [];
        var imageArray = result.reduce(function (acc, resource) {
          acc.push({
            link:   resource.secure_url,
            image: resource.secure_url,
            description: extractCaption(resource)
          });
          imageNames.push(extractName(resource.secure_url));
          return acc;
        }, []);
        callback(imageArray);
      })
}

function extractName(url){
  var frags = url.split('/');
  return frags[frags.length-1].split('.')[0];
}

function deriveThumb(url){
  var frags = url.split('/');
  var targetIndex = frags.length-2;
  frags[targetIndex] = 'w_100, h_100, c_fill';
  return frags.join('/');
}

function deriveBig(url){
  var frags = url.split('/');
  var targetIndex = frags.length-2;
  frags[targetIndex] = 'w_1000, h_1000, c_fill';
  return frags.join('/');
}

function extractCaption(image) {
  var tags = image['tags'];
  var caption = '';
  tags.forEach(function(tag) {
    if (tag.match('^caption-')) {
      caption = tag.split('').splice(8).join('');
    }
  });
  return caption;
}


$(document).ready(function () {

  //var data = [
  //  {
  //    image: 'img1.jpg',
  //    thumb: 'thumb1.jpg',
  //    big: 'big1.jpg',
  //    title: 'my first image',
  //    description: 'Lorem ipsum caption',
  //    link: 'http://domain.com'
  //  },
  //  {
  //    video: 'http://www.youtube.com/watch?v=GCZrz8siv4Q',
  //    title: 'my second image',
  //    description: 'Another caption'
  //  }
  //];

  function initGallery(data){
    Galleria.loadTheme('/js/galleria-classic-min.js');
    Galleria.run('.galleria', {
      dataSource: data
    });
  }

  fetchAllImages(initGallery);

});
