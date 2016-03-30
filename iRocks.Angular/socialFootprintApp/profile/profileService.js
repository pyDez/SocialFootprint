(function () {

    var profileService = function ($http, ngAuthSettings) {

        

            var serviceBase = ngAuthSettings.apiServiceBaseUri;

            var profileFactory = {};

            var _getProfile = function (appUserId) {

                return $http.get(serviceBase + 'api/user/'+ appUserId).then(function (results) {
                    return results;
                });
            };
            var _getMyProfile = function (dephtLevel) {

                return $http.get(serviceBase + 'api/CurrentUser?dephtLevel=' + dephtLevel).then(function (results) {
                    return results;
                });
            };
            
            profileFactory.getProfile = _getProfile;
            profileFactory.getMyProfile = _getMyProfile;
            return profileFactory;
    };

    var module = angular.module("socialFootprintApp");
    module.factory('profileService', ['$http', 'ngAuthSettings', profileService]);
}());