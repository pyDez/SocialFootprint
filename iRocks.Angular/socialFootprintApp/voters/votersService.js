(function () {

    var votersService = function ($http, ngAuthSettings) {



        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var profileFactory = {};

        var _getVoters = function (postId) {

            return $http.get(serviceBase + 'api/currentuser/vote?postId=' + postId).then(function (results) {
                return results;
            });
        };

        profileFactory.getVoters = _getVoters;
        return profileFactory;
    };

    var module = angular.module("socialFootprintApp");
    module.factory('votersService', ['$http', 'ngAuthSettings', votersService]);
}());