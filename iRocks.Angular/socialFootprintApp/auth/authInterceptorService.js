(function () {
    authInterceptorService = function ($q, $location, localStorageService, $injector) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            if (config.url.indexOf("googleapis") <= -1) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }
        }

        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            if (rejection.config.url.toLowerCase().indexOf("api/user/") >= 0) {
                $location.path('/unauthorizedProfile');
            }
            else {
                var authService = $injector.get('authService');//avoid circular dependency
                authService.logOut();
                //$location.path('/login');
            }
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
};

var module = angular.module("socialFootprintApp");
module.factory("authInterceptorService", ['$q', '$location', 'localStorageService', '$injector', authInterceptorService]);
}());