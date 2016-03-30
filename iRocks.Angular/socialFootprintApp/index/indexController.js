(function (app) {
    var indexController = function ($scope, $location, $http, authService, profileService, indexService, sharedService, footprintTools, $window, translationService, notificationService) {

        $scope.logOut = function () {
            authService.logOut();
            $location.path('/login');
        }
        _getUserInfo = function () {
            profileService.getMyProfile("UserProfile").then(function (results) {
                $scope.profile = results.data.Result;
                translationService.getTranslation(results.data.Result.Locale.substring(0, 2)).then(function (results) {
                    $scope.translations = translationService.translations;
                   // $scope.notificationService.notifications = $scope.profile.Notifications;
                    for (i = 0; i < $scope.profile.Notifications.length; i++) {

                        $scope.notificationService.addNotification($scope.profile.Notifications[i]);

                        //$scope.notificationService.notifications[i].sinceTime = footprintTools.timeSince($scope.notificationService.notifications[i].NotificationDate, translationService);
                        //$scope.notificationService.notifications[i].dateWellFormated = new Date($scope.notificationService.notifications[i].NotificationDate).toLocaleString();
                        //if (!$scope.notificationService.notifications[i].IsRed) {
                        //    ++$scope.notificationService.nbNewNotification;
                        //}
                    }
                }, function (error) {
                });

                _getCategories(results.data.Result.Locale);
                
            }, function (error) {
            });
        }
        _getCategories = function (locale) {
            indexService.getCategories(locale).then(function (results) {
                $scope.shared.categories = results.data;
            }, function (error) {
            });
        }
        _getUserFriends = function () {
            indexService.getFriends().then(function (results) {
                $scope.friends = results.data;
            }, function (error) {
            });
        }

        _changeSearch = function () {
            $scope.searchResult = [];
            if ($scope.searchText != "") {
                for (i = 0; i < $scope.friends.length; i++) {
                    var name = $scope.friends[i].FirstName;
                    if ($scope.friends[i].LastName != null)
                        name = $scope.friends[i].FirstName + " " + $scope.friends[i].LastName + " " + $scope.friends[i].FirstName;
                    if (name.toLowerCase().indexOf($scope.searchText.toLowerCase()) >= 0)
                        $scope.searchResult.push($scope.friends[i])
                }
            }
        };
        _resetSearch = function () {
            $scope.searchResult = [];
            $scope.searchText = "";
        };
        _readNotification = function () {
            for (i = 0; i < $scope.notificationService.notifications.length; i++) {
                $scope.notificationService.notifications[i].IsRed = true;
                $scope.notificationService.notifications[i].Snapshot = null; //avoid bug in server 
            }
            indexService.patchNotifications($scope.notificationService.notifications);
            $scope.notificationService.nbNewNotification = 0;
        };

       
        

        $scope.$on('updateFrameWithUserInfo', function (event) {
            _getUserInfo();
            _getUserFriends();
        });
        var lang = $window.navigator.language || $window.navigator.userLanguage;
        lang = lang.substring(0, 2);
        translationService.getTranslation(lang).then(function (results) {
            $scope.translations = translationService.translations;
        }, function (error) {
        });
        $scope.shared = sharedService;
        _getCategories();
        $scope.searchResult = [];
        $scope.searchText = "";
        $scope.resetSearch = _resetSearch;
        $scope.authentication = authService.authentication;
        $scope.changeSearch = _changeSearch;
        $scope.readNotification = _readNotification;
        $scope.notificationService = notificationService;
        if($scope.authentication.isAuth)
        {
            _getUserInfo();
            _getUserFriends();
        }

        

       

    };
    app.controller("indexController", ['$scope', '$location', '$http', 'authService', 'profileService', 'indexService', 'sharedService', 'footprintTools', '$window', 'translationService', 'notificationService', indexController]);
}(angular.module("socialFootprintApp")));