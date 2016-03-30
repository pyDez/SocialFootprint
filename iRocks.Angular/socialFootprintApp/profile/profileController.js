(function (app) {

    var profileController = function ($scope, profileService, $routeParams, footprintTools, $window, $timeout, $location, translationService) {

        function contains(a, obj) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        }

        var _parseProfile = function (data) {
            $scope.isAuthenticated = data.isAuthenticated;
            $scope.profile = data.Result;
            var tempPost = data.Result.Posts.slice(0); //clone des posts
            $scope.profile.Posts = [];
            for (i = 0; i < tempPost.length; i++) {
                $scope.profile.Posts.push({
                    Post: tempPost[i],
                    User: data.Result
                });
            }
            var tempBadges = $scope.profile.Badges;
            $scope.profile.PostBadges = [];
            $scope.profile.XpBadge = null;
            var badgeIds = [];



            for (i = 0; i < tempBadges.length; i++) {

                if (tempBadges[i].Badge.CategoryId > 0 && !tempBadges[i].PostId)// Category Badge
                {
                    for (var j = 0; j < $scope.profile.Footprint.length; j++) {

                        if (tempBadges[i].Badge.CategoryId == $scope.profile.Footprint[j].CategoryId) {
                            if (!$scope.profile.Footprint[j].CategoryBadges) {
                                $scope.profile.Footprint[j].CategoryBadges = [];
                            }
                            $scope.profile.Footprint[j].CategoryBadges.push(tempBadges[i]);
                        }

                    }
                }
                if (tempBadges[i].Badge.CategoryId == 0 && !tempBadges[i].PostId)// XP Badge
                {
                    ///!\ for XP badges, we need to display only the best !
                    if ($scope.profile.XpBadge) {
                        if (tempBadges[i].Badge.Level > $scope.profile.XpBadge.Badge.Level) {
                            $scope.profile.XpBadge = tempBadges[i];
                        }
                    }
                    else {
                        $scope.profile.XpBadge = tempBadges[i];
                    }

                }
                if (tempBadges[i].Badge.CategoryId == 0 && tempBadges[i].PostId)// Post Badge
                {
                    var contains = false;
                    for (var j = 0; j < $scope.profile.PostBadges.length; j++) {

                        if (tempBadges[i].Badge.BadgeId == $scope.profile.PostBadges[j].Badge.BadgeId) {
                            contains = true;
                            ++$scope.profile.PostBadges[j].Count;
                        }

                    }
                    if (!contains) {
                        $scope.profile.PostBadges.push(tempBadges[i]);
                        $scope.profile.PostBadges[$scope.profile.PostBadges.length - 1].Count = 1;
                    }
                }


            }

            $scope = footprintTools.initFootprint($scope, $scope.profile.Footprint);
            

            $timeout(function () {
                $scope = footprintTools.createFootprint($scope, $scope.profile.Footprint);
            }, 100);
            $scope.dataLoaded = true;
        };

        var _getMyProfile = function () {
            profileService.getMyProfile("Friends").then(function (results) {

                _parseProfile(results.data);
                $scope.profileUrl += "/" + results.data.Result.AppUserId;
                $scope.displayShareButtons = true;
            }, function (error) {
                //alert(error.data.message);
            });
        };


        if (!$routeParams.appuserid) {
            _getMyProfile();
        }
        else {
            profileService.getProfile($routeParams.appuserid).then(function (results) {

                _parseProfile(results.data);
            }, function (error) {
                _getMyProfile();
            });
        }

        var _openInNewTab = function (href) {
            footprintTools.openInNewTab($window, href)
        };
        $scope.dataLoaded = false;
        $scope.isAuthenticated = true;
        $scope.displayShareButtons = false;
        $scope.isDuel = false;
        $scope.openInNewTab = _openInNewTab;
        $scope.profileUrl = $location.absUrl();
        $scope.logoUrl = $location.absUrl().substring(0, $location.absUrl().indexOf("profile")) + "images/square360.png"
        $scope.translationService = translationService;
    };
    app.controller("profileController", ["$scope", 'profileService', '$routeParams', 'footprintTools', '$window', '$timeout', '$location', 'translationService', profileController]);
}(angular.module("socialFootprintApp")));

