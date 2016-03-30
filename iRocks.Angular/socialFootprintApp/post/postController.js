
(function (app) {



    var postController = function ($scope, sharedService, postService, $window, footprintTools, $modal, $log, $timeout, translationService) {

        var _changeCategory = function (postId, categoryId) {
            for (i = 0; i < $scope.sharedFromService.categories.length; i++) {
                if ($scope.sharedFromService.categories[i].CategoryId == categoryId) {
                    $scope.post.Post.PostCategory = $scope.sharedFromService.categories[i];
                    $scope.$parent.$parent.$parent.duel.CategoryLabel = $scope.sharedFromService.categories[i].Label;
                }
            }


            var postBL = [];
            var secondPostId = -1;
            if ($scope.$parent.$parent.$parent.$parent.isDuel && $scope.$parent.$parent.$parent.duel.SecondPublication) {
                if ($scope.$parent.$parent.$parent.duel.FirstPublication.Post.PostId == postId) {
                    secondPostId = $scope.$parent.$parent.$parent.duel.SecondPublication.Post.PostId;
                    $scope.$parent.$parent.$parent.duel.SecondPublication.loaded = false;
                } else {
                    secondPostId = $scope.$parent.$parent.$parent.duel.FirstPublication.Post.PostId;
                    $scope.$parent.$parent.$parent.duel.FirstPublication.loaded = false;
                }

                var secondPostIndex = $.inArray(secondPostId, $scope.$parent.$parent.$parent.$parent.displayedPosts);
                if (secondPostIndex > -1) {
                    $scope.$parent.$parent.$parent.$parent.displayedPosts.splice(secondPostIndex, 1);
                }

                postBL = $scope.$parent.$parent.$parent.$parent.displayedPosts
            }
            postService.categorize(postId, categoryId, postBL).then(function (results) {
                //to do
                if ($scope.$parent.$parent.$parent.$parent.isDuel) {
                    var index = $scope.$parent.$parent.$parent.$parent.$index;
                    if (!index)
                        index = $scope.$parent.$parent.$parent.$index;
                    if (!results.SecondPublication) {
                        for (i = 0; i < $scope.$parent.$parent.$parent.$parent.imcompleteDuels.length; i++) {
                            if ($scope.$parent.$parent.$parent.$parent.imcompleteDuels[i].publication.Post.CategoryId == results.FirstPublication.Post.CategoryId) {

                                results.SecondPublication = $scope.$parent.$parent.$parent.$parent.imcompleteDuels[i].publication;
                                $scope.$parent.$parent.$parent.$parent.feeds.splice($scope.$parent.$parent.$parent.$parent.imcompleteDuels[i].index, 1);
                                $scope.$parent.$parent.$parent.$parent.imcompleteDuels.splice(i, 1);


                                i = $scope.$parent.$parent.$parent.$parent.imcompleteDuels.length;
                            }
                        }
                    }
                    var feed = { Results: [results] };
                    $scope.$parent.$parent.$parent.$parent.feeds.splice(index, 1);
                    $scope.$parent.$parent.$parent.$parent.handleResults(feed, index, true);
                }
                else // profile
                {
                    var index = $scope.$parent.$parent.$parent.$index;
                    $scope.$parent.$parent.$parent.$parent.profile.Posts.splice(index, 1, results.FirstPublication);


                }

            }, function (error) {
                //alert(error.data.message);
            });
        }

        $scope.isFootprintReady = false;
        //$scope = footprintTools.createFootprint($scope, $scope.$parent.$parent.post.User.Footprint);
        if ($scope.$parent.$parent.$parent.$parent.isDuel) {
            $scope.isFootprintReady = false;
            $scope = footprintTools.initFootprint($scope, $scope.$parent.$parent.post.User.Footprint);
            if ($scope.$parent.$parent.$parent.duel.DuelResult) {
                $timeout(function () {
                    $scope = footprintTools.createFootprint($scope, $scope.$parent.$parent.post.User.Footprint);
                    $scope.isFootprintReady = true;
                }, 0);
            }
            $scope.$on('updateFootprints', function (event) {
                $timeout(function () {
                    $scope = footprintTools.createFootprint($scope, $scope.$parent.$parent.post.User.Footprint);
                    if ($scope.$parent.$parent.$parent.duel.isVoted) {
                        $scope.isFootprintReady = true;
                    }
                }, 0);

            });
        }
        else {
            $scope.isFootprintReady = true;
            $scope.post.Looser = false;
        }

        var _openInNewTab = function (href) {
            footprintTools.openInNewTab($window, href)
        };
        
        
        var _zoomIn = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'socialFootprintApp/pictureZoomIn/zoomIn.html',
                controller: 'zoomInController',
                resolve: {
                    post: function () {
                        return $scope.$parent.$parent.post;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.selected = true;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        var _getVoters = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'socialFootprintApp/voters/voters.html',
                controller: 'votersController',
                resolve: {
                    post: function () {
                        return $scope.$parent.$parent.post;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.selected = true;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.categoryBadge = null;
        $scope.postBadge = null;
        var user = $scope.$parent.$parent.post.User;
        var post = $scope.$parent.$parent.post.Post;
        for (i = 0; i < user.Badges.length; i++) {
            if (user.Badges[i].Badge.CategoryId == post.CategoryId) {
                if ($scope.categoryBadge) {
                    if (user.Badges[i].Badge.Level > $scope.categoryBadge.Badge.Level)
                        $scope.categoryBadge = user.Badges[i];
                }
                else
                    $scope.categoryBadge = user.Badges[i];
            }

            if (user.Badges[i].PostId == post.PostId) {
                if ($scope.postBadge) {
                    if (user.Badges[i].Badge.Level > $scope.postBadge.Badge.Level)
                        $scope.postBadge = user.Badges[i];
                }
                else
                    $scope.postBadge = user.Badges[i];
            }
        }
        $scope.post.isChild = false;
        if ($scope.$parent.$parent.$parent.$parent.post != null)
        {
            $scope.post.isChild = true;
        }
        $scope.post.loaded = true;

        var time = $scope.$parent.$parent.post.Post.CreationDate;
        if ($scope.$parent.$parent.post.Post.IsFacebookProvided)
            time = $scope.$parent.$parent.post.Post.FacebookDetail.UpdateTime;
        if ($scope.$parent.$parent.post.Post.IsTwitterProvided)
            time = $scope.$parent.$parent.post.Post.TwitterDetail.CreationTime;

        $scope.sinceTime = footprintTools.timeSince(time, translationService);
        $scope.updateTime = new Date(time).toLocaleString();
        $scope.sharedFromService = sharedService;
        $scope.changeCategory = _changeCategory;
        $scope.openInNewTab = _openInNewTab;
        $scope.zoomIn = _zoomIn;
        $scope.getVoters = _getVoters;
        $scope.videoOptions = footprintTools.videoOptions;
        $scope.translationService = translationService;

    };
    app.controller("postController", ["$scope", "sharedService", "postService", "$window", "footprintTools", "$modal", "$log", "$timeout", "translationService", postController]);
}(angular.module("socialFootprintApp")));


