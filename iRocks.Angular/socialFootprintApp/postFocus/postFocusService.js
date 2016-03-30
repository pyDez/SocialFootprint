(function () {

    var postFocusService = function ($http, ngAuthSettings) {



        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var postFocusFactory = {};

        var _getPublication = function (postId) {

            return $http.get(serviceBase + 'api/post/' + postId).then(function (result) {
                return result;
            });
        };
       
        postFocusFactory.getPublication = _getPublication;
        return postFocusFactory;
    };

    var module = angular.module("socialFootprintApp");
    module.factory('postFocusService', ['$http', 'ngAuthSettings', postFocusService]);
}());