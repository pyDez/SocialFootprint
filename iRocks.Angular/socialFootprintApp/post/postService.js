(function () {

    var postService = function ($http, $q, ngAuthSettings) {



        var serviceBase = ngAuthSettings.apiServiceBaseUri;

        var postFactory = {};

        var _categorize = function (postId, categoryId, postBlackList) {

            var categorizationModel = {
                PostId: postId,
                CategoryId: categoryId,
                PostsBlackList: postBlackList
            };
          
            var deferred = $q.defer();
            $http.post(serviceBase + 'api/category', categorizationModel).success(function (response) {

                    deferred.resolve(response);

                }).error(function (err, status) {
                    deferred.reject(err);
                });

                return deferred.promise;
            
        };


        postFactory.categorize = _categorize;
        return postFactory;
    };

    var module = angular.module("socialFootprintApp");
    module.factory('postService', ['$http', '$q', 'ngAuthSettings', postService]);
}());