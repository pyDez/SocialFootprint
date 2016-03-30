(function () {

    var authService = function ($http, $q, localStorageService, ngAuthSettings, $location) {

        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            email: ""
        };

        var _saveRegistration = function (registration) {

            _logOut();

            return $http.post(ngAuthSettings.apiServiceBaseUri + 'api/Register', registration).then(function (response) {
                return response;
            });

        };

              

        var _login = function (loginData) {

            //var data = "grant_type=password&UserName=" + loginData.email + "&password=" + loginData.password;

            var deferred = $q.defer();

            $http.post(ngAuthSettings.apiServiceBaseUri + 'api/Login', loginData).success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, email: loginData.email });

                _authentication.isAuth = true;
                _authentication.email = loginData.email;
                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };


        var _registerExternal = function (registerExternalData) {

            var deferred = $q.defer();

            $http.post(ngAuthSettings.apiServiceBaseUri + 'api/ExternalRegister', registerExternalData).success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                _authentication.isAuth = true;
                _authentication.email = response.userName;
                _authentication.useRefreshTokens = false;

                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };


        var _obtainAccessToken = function (externalData) {

            var deferred = $q.defer();

            $http.post(ngAuthSettings.apiServiceBaseUri + 'api/ExternalLogin', externalData).success(function (response) {

                localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

                _fillAuthData();
                _authentication.useRefreshTokens = false;

                deferred.resolve(response);

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };


        var _logOut = function () {
            var deferred = $q.defer();
            $http.post(ngAuthSettings.apiServiceBaseUri + 'api/Logout').success(function (response) {
                localStorageService.remove('authorizationData');

                _authentication.isAuth = false;
                _authentication.email = "";
                if ($location.path() != "/associate")
                    $location.path('/login');
                deferred.resolve(response);
            });
        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.email = authData.userName;
            }

        }
        _fillAuthData();
        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.registerExternal = _registerExternal;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.obtainAccessToken = _obtainAccessToken;

        return authServiceFactory;
    };

    var module = angular.module("socialFootprintApp");
    module.factory("authService", ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$location', authService]);
}());