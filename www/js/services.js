angular.module('starter.services', [])

.factory("Pictures", function($firebaseArray) {
  var picturesRef = new Firebase("https://familycircle.firebaseio.com/pictures");
  return $firebaseArray(picturesRef);
})

.factory("FramePictures", function($firebaseArray) {
  var picturesRef = new Firebase("https://familycircle.firebaseio.com/framepictures");
  return $firebaseArray(picturesRef);
})

.factory("UploadService", function($q, $cordovaFileTransfer, cloudinary, $ionicLoading) {
  var service = {};
  service.uploadMedia = uploadMedia;
  return service;

  function uploadMedia(mediaObj) {

    var deferred = $q.defer();
    var fileSize;
    var percentage;

    window.resolveLocalFileSystemURL(mediaObj.fullPath, function(fileEntry) {
      fileEntry.file(function(fileObj) {

        fileSize = fileObj.size;
        $ionicLoading.show({
          template: 'Uploading media : ' + 0 + '%'
        });

        uploadFile();
      });
    });

    function uploadFile() {
      // Add the Cloudinary "upload preset" name to the headers
      var uploadOptions = {
        fileKey: 'file',
        fileName: mediaObj.name,
        chunkedMode: false,
        mimeType: mediaObj.type,
        params: {
          upload_preset: 'zdyqbini',
          tags: 'familycircle'
        }
      };

      $cordovaFileTransfer.upload('https://api.cloudinary.com/v1_1/websiddu/upload', mediaObj.fullPath, uploadOptions)

      .then(function(result) {
        // Let the user know the upload is completed
        $ionicLoading.show({
          template: 'Upload Completed',
          duration: 1000
        });

        var response = JSON.parse(decodeURIComponent(result.response));
        deferred.resolve(response);
      }, function(err) {
        // Uh oh!
        $ionicLoading.show({
          template: 'Upload Failed',
          duration: 3000
        });
        deferred.reject(err);
      }, function(progress) {
        // The upload plugin gives you information about how much data has been transferred
        // on some interval.  Use this with the original file size to show a progress indicator.
        percentage = Math.floor(progress.loaded / fileSize * 100);
        $ionicLoading.show({
          template: 'Uploading media : ' + percentage + '%'
        });
      });
    }
    return deferred.promise;
  }
})

.factory('Chats', function() {

  return {

  };
});
