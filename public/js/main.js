var userId = 'unknown';
var isSubmitting = false;
var serverAddress = 'http://honey-server.apps.dulcetsoftware.com';
var sessionSubmittedImages = {};

function updatePhotoCaption(imageId, captionText) {
  var captionBox = $('.gallery-row').find('#caption-' + imageId);
  captionBox.fadeTo("fast", 0.33);
  var public_id = imageId.split('-')[1],
      tags = [
        'user-' + userId,
        'caption-' + captionText.split(',').join(' ')
      ];

  var paramString = '?public_id=' + public_id + '&tags=' + encodeURIComponent(tags);

  superagent
      .put(serverAddress + '/cloudinary/updatecaption' + paramString)
      .end(function (err) {
        if (err) throw err;
        captionBox.fadeTo("fast", 1.0);
      })
}

function deleteImage(imageId) {
  var public_id = imageId.split('-')[1];

  superagent
      .del(serverAddress + '/cloudinary/' + public_id)
      .end(function (err) {
        if (err) throw err;
        delete(sessionSubmittedImages[imageId]);
        $('.gallery-row').fadeOut("slow");
        buildGallery(sessionSubmittedImages, function () {
          $('.gallery-row').fadeIn("fast");
        });
      })
}

function buildArticle(imageHtml) {
  var imageId = 'img-' + (imageHtml.match("[a-z0-9]+\.(jpg|png|bmp|gif|tif)")[0].split('.')[0]);
  var galleryRowEl = $('.gallery-row');
  galleryRowEl.on('change', '#caption-' + imageId, function () {
    var captionText = $('#caption-' + imageId).val().trim();
    updatePhotoCaption(imageId, captionText);
  });

  galleryRowEl.on('click', '#delete-' + imageId, function () {
    deleteImage(imageId);
  });

  return '<div class="4u 12u(mobile)">' +
      '<article class="box style2">' +
      '<div class="image featured">' + imageHtml + '</div>' +
      '<textarea id="caption-' + imageId + '" style="resize:vertical" placeholder="add a caption!"></textarea>' +
      '<a id="delete-' + imageId + '" class="remove-shadow">delete this image</a>' +
      '</article></div>';
}

function buildGallery(images, callback) {
  var galleryRowEl = $('.gallery-row');
  galleryRowEl.off();
  var galleryHtml = Object.keys(images).reduce(function (acc, imageId) {
    acc += buildArticle(images[imageId]);
    return acc;
  }, '');
  galleryRowEl.html(galleryHtml);
  $('#photomessage').text("Thanks for sharing!");
  $('.cloudinary-button').text('Upload another image!');
  if (callback !== null && typeof callback === 'function') {
    callback();
  }
}

function attachUploadWidget() {
  $('#upload_widget_opener').cloudinary_upload_widget(
      {
        cloud_name:               'hztzss4vs',
        upload_preset:            'dz49gmc6',
        sources:                  ['local', 'url'],
        cropping:                 'server',
        thumbnails:               '#dummy_thumbnail_gallery',
        thumbnail_transformation: {width: 383, height: 383, crop: 'fill'},
        tags:                     'user-' + userId
      },
      function (err, result) {
        if (err) throw err;
        result.forEach(function (image) {
          var imageHtml = '<img src="' + image.thumbnail_url + '"/>';
          var imageId = 'img-' + image.public_id;
          sessionSubmittedImages[imageId] = imageHtml;
        });
        buildGallery(sessionSubmittedImages);
      });
  $('.cloudinary-button').text('Upload an image!');
}

function revealImageUploadButton(callback) {
  $('.upload_widget_wrapper').removeClass('hidden');
  if (callback !== null && typeof callback === 'function') {
    callback();
  }
}

function validateFormData() {
  var form = $('#contact-form');
  var nameFilledOut = form.find('#name').val().trim().match('[a-zA-Z]+');  //Safari 7 doesn't like w regex!
  var validEmail = validateEmail(form.find('#email').val().trim());
  return (nameFilledOut && validEmail);
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function storeUserData(data, callback) {
  data.email = data.email.toLowerCase();
  var affiliation = $('select').val();
  data.affiliation = affiliation !== 'Other' ? (affiliation || 'Friend') : data.otheraffiliation;
  superagent
      .post(serverAddress + '/user')
      .send(data)
      .end(function (err, result) {
        if (err) {
          alert('There was an error storing your information!');
          throw err;
        }
        callback(result);
      })

}

function fetchThreeImages(callback) {
  superagent
      .get(serverAddress + '/cloudinary/randomimages/3')
      .end(function (err, result) {
        if (err) throw err;
        result = JSON.parse(result.text);
        var imageArray = result.reduce(function (acc, resource) {
          acc.push({url: resource.url, tags: resource.tags});
          return acc;
        }, []);
        callback(imageArray);
      })
}


function showComments(comments) {
  //create UL using comments, attach to scroller
  var commentHtml = JSON.parse(comments).reduce(function (list, comment) {
        list += '<li>' + comment + '</li>';
        return list;
      }, '<ul id="scroller">') + '</ul>';
  $('#scroll-container').html(commentHtml);
  $("#scroller").simplyScroll({

    orientation: 'vertical'
  });
}

function loadComments(showComments) {
  superagent
      .get(serverAddress + '/comments/all')
      .end(function (err, result) {
        if (err) throw err;
        result = result.text;
        showComments(result);
      })
}


function hideRegistrationForm() {
  $('.fadable').fadeOut();
}

function attachFormHandler() {
  $('#form-submit-button').click(function (event) {
        event.preventDefault();
        if (!isSubmitting) {
          if (validateFormData()) {
            var data = $("#contact-form").serializeArray()
                .filter(function (el) {
                  return $.trim(el)
                })
                .reduce(function (acc, x) {
                  acc[x.name] = x.value;
                  return acc;
                }, {});

            storeUserData(data, function (result) {
              userId = JSON.parse(result.text).value._id;
              attachUploadWidget();
              hideRegistrationForm();
              revealImageUploadButton();
              isSubmitting = false;
            })
          } else {
            alert('Please enter your name and a valid email!');
          }
        }
      }
  );
}


function displayImagesInGallery(displayedImageElements, displayedCaptions, imageArray) {
  if (imageArray.length < 3) return false;
  imageArray.forEach(function (image, index) {
    displayOne(displayedImageElements, displayedCaptions, image, index);
  });
  $('.thumbnails').fadeTo("fast", 1.0);
}

function displayOne(displayedImageElements, displayedCaptions, image, index) {
  var caption = image.tags.filter(function (tag) {
        return (tag.substring(0, 7) || 'no-caption') === 'caption';
      })[0].substring(8) || "";

  var partials = image.url.split('upload');
  var rightSizeUrl = partials[0] + 'upload/c_fill,h_335,w_335' + partials[1];
  $(displayedImageElements[index]).attr('src', rightSizeUrl);
  $(displayedCaptions[index]).text(caption)
}

function attachGalleryExpander() {

}

function showLogin() {
  $(document).find('.modaloverlay').css('visibility', 'visible');
}

function hideLogin() {
  $(document).find('.modaloverlay').css('visibility', 'hidden');
}

$.fn.scrollView = function () {
  return this.each(function () {
    $('html, body').animate({
      scrollTop: $(this).offset().top
    }, 2000);
  });
};


function fetchUserIdByEmail() {
  var email = $('#login-email-input').val().trim().toLowerCase();
  if (validateEmail(email)) {
    superagent
        .get(serverAddress + '/user/email/' + encodeURIComponent(email))
        .end(function (err, result) {
          if (err) {
            alert('Error looking up email.  Please try again!');
          } else {
            if (result.body._id) {
              hideLogin();
              userId = result.body._id;
              attachUploadWidget();
              hideRegistrationForm();
              revealImageUploadButton(function () {
                $('.upload_widget_wrapper').scrollView();
              });
            } else {
              alert('Email not found.  Please register!');
            }
          }
        })
  } else {
    alert('Email does not appear to be valid!');
  }
}

$(document).ready(function () {
  $('html').fadeTo("slow", 1.0);

  attachFormHandler();

  fetchThreeImages(function (randomImages) {
    var imagePlaceholders = $('.randomimage');
    var captionPlaceholders = $('.randomcaption');
    displayImagesInGallery(imagePlaceholders, captionPlaceholders, randomImages);
  });

  loadComments(function (comments) {
    showComments(comments);
  });

  //TODO
  attachGalleryExpander();
});
