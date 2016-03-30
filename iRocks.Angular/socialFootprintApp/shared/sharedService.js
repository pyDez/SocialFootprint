(function () {

    var sharedService = function ($window, $rootScope) {

        var sharedFactory = {};

        _getBreakpoint = function () {
            //set a $scope variable or a service variable that reused

            var currentBreakpoint = 'xs';
            if ($window.innerWidth >= 768) {
                currentBreakpoint = 'sm';
            }
            if ($window.innerWidth >= 992) {
                currentBreakpoint = 'md';
            }
            if ($window.innerWidth >= 1200) {
                currentBreakpoint = 'lg';
            }
            return currentBreakpoint;
        };
        angular.element($window).bind('resize', function () {
            sharedFactory.currentBreakpoint = _getBreakpoint();
            $rootScope.$apply();
        });
        sharedFactory.tooltipIdentifier = "";
        sharedFactory.categories = [];
        sharedFactory.getBreakpoint = _getBreakpoint;
        sharedFactory.currentBreakpoint = _getBreakpoint();
        return sharedFactory;
    };

    var module = angular.module("socialFootprintApp");
    module.factory('sharedService', ['$window', '$rootScope', sharedService]);
}());



(function () {
    var footprintTools = function () {
        return {
            initFootprint: function (viewScope, footprint) {
                viewScope.footprintData = [];
                for (i = 0; i < footprint.length; i++) {
                    viewScope.footprintData.push(footprint[i]);
                    viewScope.footprintData[i].SkillLevelAsync = 0;
                }
                return viewScope;
            },
            createFootprint: function (viewScope, footprint) {
                for (i = 0; i < footprint.length; i++) {
                    viewScope.footprintData[i].SkillLevelAsync = (Math.round((footprint[i].SkillLevel) * 100) / 100);
                    var value = viewScope.footprintData[i].SkillLevelAsync;
                    if (value < 25) {
                        type = 'danger';
                    } else if (value < 50) {
                        type = 'warning';
                    } else if (value < 75) {
                        type = 'middlePlusLevel';
                    } else {
                        type = 'success';
                    }
                    viewScope.footprintData[i].type = type;
                }

                return viewScope;
            },
            openInNewTab: function (windowService, href) {
                windowService.open(href, '_blank');
            },
            videoOptions: {
                link: false,                   //convert links into anchor tags
                code: {
                    highlight: false,               //to allow code highlighting of code written in markdown
                    //requires highligh.js (https://highlightjs.org/) as dependency.
                    lineNumbers: false               //to show line numbers
                },
                basicVideo: true,
                gdevAuth: 'AIzaSyCPbCexI3X25PHsSjBLIXHQR9nu2rv-jLE',
                video: {
                    embed: true,
                    width: null,          //width of embedded player
                    height: null,          //height of embedded player
                    ytTheme: 'light',        //youtube player theme (light/dark)
                    details: true
                },
                tweetEmbed: false
            },
            timeSince: function (date, translationService) {
                var dateFormat = new Date(date + 'Z');
                var seconds = Math.floor((new Date().getTime() - dateFormat - (new Date()).getTimezoneOffset() * 100000) / 1000);


                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return interval + " " + translationService.translations.YEARS;
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return interval + " " + translationService.translations.MONTHS;
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + " " + translationService.translations.DAYS;
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + " " + translationService.translations.HOURS;
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " " + translationService.translations.MINUTES;
                }
                return Math.floor(seconds) + " " + translationService.translations.SECONDS;
            },
            tutorial: false
        };
    };

    var module = angular.module("socialFootprintApp");
    module.factory('footprintTools', [footprintTools]);
}());

(function () {
    var notificationService = function (footprintTools, translationService) {
        return {
            notifications: [],
            nbNewNotification: 0,
            addNotification: function (notification) {

                notification.sinceTime = footprintTools.timeSince(notification.NotificationDate, translationService);
                notification.dateWellFormated = new Date(notification.NotificationDate).toLocaleString();
                if (!notification.IsRed) {
                    ++this.nbNewNotification;
                }
                this.notifications.push(notification);
            }
        };
    };

    var module = angular.module("socialFootprintApp");
    module.factory('notificationService', ['footprintTools', 'translationService', notificationService]);
}());