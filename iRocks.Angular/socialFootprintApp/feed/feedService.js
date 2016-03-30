(function () {

    var feedService = function ($http, $q, ngAuthSettings) {



        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var feedFactory = {};

        var _getFeed = function (update, displayedPosts) {

            //return $http.get(serviceBase + 'api/currentuser/NewsFeed').then(function (results) {
            //    return results;
            //});
            var deferred = $q.defer();
            $http.post(serviceBase + 'api/currentuser/NewsFeed?update=' + update, displayedPosts).success(function (response) {

                deferred.resolve(response);

            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };
        var _getUpFeed = function (update, displayedPosts) {

            //return $http.get(serviceBase + 'api/currentuser/UpPostsFeed').then(function (results) {
            //    return results;
            //});
            var deferred = $q.defer();
            $http.post(serviceBase + 'api/currentuser/NewsFeed?update=' + update + '&topFlop=top', displayedPosts).success(function (response) {

                deferred.resolve(response);

            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };
        var _getDownFeed = function (update, displayedPosts) {

            //return $http.get(serviceBase + 'api/currentuser/DownPostsFeed').then(function (results) {
            //    return results;
            //});
            var deferred = $q.defer();
            $http.post(serviceBase + 'api/currentuser/NewsFeed?update=' + update + '&topFlop=flop', displayedPosts).success(function (response) {

                deferred.resolve(response);

            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };
        var _getNext = function (nextPageUrl, displayedPosts) {
            if (nextPageUrl) {
                var deferred = $q.defer();
                $http.post(nextPageUrl, displayedPosts).success(function (response) {

                    deferred.resolve(response);

                }).error(function (err, status) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }
        };









        var _vote = function (vote) {

            var deferred = $q.defer();

            $http.post(ngAuthSettings.apiServiceBaseUri + 'api/currentuser/vote', vote).success(function (response) {
                deferred.resolve(response);

            });
            return deferred.promise;
        };


        feedFactory.vote = _vote;
        feedFactory.getFeed = _getFeed;
        feedFactory.getDownFeed = _getDownFeed;
        feedFactory.getUpFeed = _getUpFeed;
        feedFactory.getNext = _getNext;

        return feedFactory;
    };

    var module = angular.module("socialFootprintApp");
    module.factory('feedService', ['$http', '$q', 'ngAuthSettings', feedService]);
}());