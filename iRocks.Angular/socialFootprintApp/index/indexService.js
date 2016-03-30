(function () {

    var indexService = function ($http, $q, ngAuthSettings) {



        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var indexFactory = {};

        var _getCategories = function (locale) {
            var apiPath = 'api/category';
            if (locale)
            {
                apiPath += '?locale=' + locale;
            }
            return $http.get(serviceBase + apiPath).then(function (results) {
                return results;
            });
        };
        var _getFriends = function () {

            return $http.get(serviceBase + 'api/User').then(function (results) {
                return results;
            });
        };
        var _patchNotifications = function (notifications) {

            var deferred = $q.defer();
            $http.patch(serviceBase + 'api/notification', notifications).success(function (response) {

                deferred.resolve(response);

            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        indexFactory.getFriends = _getFriends;
        indexFactory.getCategories = _getCategories;
        indexFactory.patchNotifications = _patchNotifications;
        return indexFactory;
    };

    var module = angular.module("socialFootprintApp");
    module.factory('indexService', ['$http', '$q', 'ngAuthSettings', indexService]);
}());