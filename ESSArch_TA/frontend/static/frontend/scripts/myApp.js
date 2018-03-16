/*
    ESSArch is an open source archiving and digital preservation system

    ESSArch Tools for Archive (ETA)
    Copyright (C) 2005-2017 ES Solutions AB

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.

    Contact information:
    Web - http://www.essolutions.se
    Email - essarch@essolutions.se
    */

Object.resolve = function (path, obj) {
    return path.split('.').reduce(function (prev, curr) {
        return prev ? prev[curr] : undefined
    }, obj || self)
}

function nestedPermissions(page) {
    // If page is an array it means that page is the field _permissions
    if (Array.isArray(page)) {
        return page;
    } else if (typeof (page) == "object") {
        var temp = [];
        for (var entry in page) {
            // Recursively build permission list
            temp = temp.concat(nestedPermissions(page[entry]));
        }
        return temp;
    }
}

/**
 * Check if state has a sub state that requires no permissions
 * @param {*} page
 */
function nestedEmptyPermissions(page) {
    if(Array.isArray(page)) {
        return page.length == 0;
    } else if(typeof(page) == "object") {
        for(var entry in page) {
            if(nestedEmptyPermissions(page[entry])) {
                return true;
            }
        }
        return false;
    }
}

angular.module('myApp', ['ngRoute', 'treeControl', 'ui.bootstrap', 'formly', 'formlyBootstrap', 'smart-table', 'treeGrid', 'ui.router', 'ngCookies', 'permission', 'permission.ui', 'pascalprecht.translate', 'ngSanitize', 'ui.bootstrap.datetimepicker', 'ui.dateTimeInput', 'ngAnimate', 'ngMessages', 'myApp.config', 'ig.linkHeaderParser', 'hc.marked', 'ngFilesizeFilter', 'angular-clipboard', 'ngResource', 'relativeDate', 'permission.config', 'ngWebSocket', 'prettyXml'])
    .config(function($routeProvider, formlyConfigProvider, $stateProvider, $urlRouterProvider, $rootScopeProvider, $uibTooltipProvider, $urlMatcherFactoryProvider, permissionConfig) {

        $urlMatcherFactoryProvider.strictMode(false);

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/static/frontend/views/home.html',
            })
            .state('login', {
                url: '/login',
                templateUrl: '/static/frontend/views/login.html',
                controller: 'LoginCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            })
            .state('home.userSettings', {
                url: 'user-settings',
                templateUrl: '/static/frontend/views/user_settings.html',
                controller: 'UserSettingsCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            })
            .state('home.versionInfo', {
                url: 'version',
                templateUrl: '/static/frontend/views/version_info.html',
                controller: 'VersionCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            })
            .state('home.info', {
                url: 'info',
                templateUrl: '/static/frontend/views/info_page.html',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            })
            .state('home.reception', {
                url: 'reception',
                templateUrl: '/static/frontend/views/receive_sip_reception.html',
                controller: 'ReceptionCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                },
                data: {
                    permissions: {
                        only: nestedPermissions(Object.resolve("home.reception", permissionConfig)),
                        redirectTo: 'home.restricted'
                    }
                }
            })
            .state('home.qualityControl', {
                url: 'quality-control',
                templateUrl: '/static/frontend/views/receive_sip_quality_control.html',
                controller: 'QualityControlCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            })
            .state('home.catalogue', {
                url: 'catalogue',
                templateUrl: '/static/frontend/views/receive_sip_catalogue.html',
                controller: 'CatalogueCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            })
            .state('home.workarea', {
                url: 'workarea',
                templateUrl: '/static/frontend/views/workarea.html',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                },
                data: {
                    permissions: {
                        only: nestedPermissions(Object.resolve("home.workarea", permissionConfig)),
                        redirectTo: 'home.restricted'
                    }
                },
            })
            .state('home.workarea.validation', {
                url: '/validation',
                templateUrl: '/static/frontend/views/workarea_validation.html',
                controller: 'WorkareaValidationCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                },
                data: {
                    permissions: {
                        only: nestedPermissions(Object.resolve("home.workarea.validation", permissionConfig)),
                        redirectTo: 'home.restricted'
                    }
                },
            })
            .state('home.workarea.transformation', {
                url: '/transformation',
                templateUrl: '/static/frontend/views/workarea_transformation.html',
                controller: 'TransformationCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                },
                data: {
                    permissions: {
                        only: nestedPermissions(Object.resolve("home.workarea.transformation", permissionConfig)),
                        redirectTo: 'home.restricted'
                    }
                },
            })
            .state('home.transferSip', {
                url: 'transfer-SIP',
                templateUrl: '/static/frontend/views/receive_sip_transfer_sip.html',
                controller: 'TransferSipCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                },
                data: {
                    permissions: {
                        only: nestedPermissions(Object.resolve("home.transferSip", permissionConfig)),
                        redirectTo: 'home.restricted'
                    }
                }
            })
            .state('home.administration', {
                url: 'administration',
                templateUrl: '/static/frontend/views/administration.html',
                redirectTo: 'home.administration.import',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            })
            .state('home.administration.import', {
                url: '/import',
                templateUrl: '/static/frontend/views/import.html',
                controller: 'ImportCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            })
            .state('home.restricted', {
                url: 'restricted',
                templateUrl: '/static/frontend/views/restricted.html',
                controller: 'RestrictedCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            })
            .state('authRequired', {
                url: '/auth-required',
                templateUrl: '/static/frontend/views/auth_required.html',
                controller: 'authRequiredCtrl as vm',
                resolve: {
                    authenticated: ['djangoAuth', function(djangoAuth){
                        return djangoAuth.authenticationStatus();
                    }],
                }
            });
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go('home.info');
        });
        $urlRouterProvider.deferIntercept();
    })
    .config(function($animateProvider) {
        // Only animate elements with the 'angular-animate' class
        $animateProvider.classNameFilter(/angular-animate|ui-select-/);
    })
    .config(['$httpProvider', function($httpProvider, $rootScope) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(['$resourceProvider', function ($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .config(['markedProvider', function (markedProvider) {
        function isURL(str) {
            var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
            var url = new RegExp(urlRegex, 'i');
            return str.length < 2083 && url.test(str);
        }
        markedProvider.setOptions({
            gfm: true,
            tables: true,
        });
        markedProvider.setRenderer({
            link: function(href, title, text) {
                if(!isURL(href)) {
                    return "<a ng-click='scrollToLink(\"" + href + "\")'" + ">" + text + "</a>";
                } else {
                    return "<a href='" + href + "'" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
                }
            }
        });
    }])
    .config(['$httpProvider', '$windowProvider', function($httpProvider, $windowProvider) {
        var $window = $windowProvider.$get();
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.interceptors.push(['$q', '$location', '$rootScope', function ($q, $location, $rootScope) {
            return {
                'response': function(response) {
                    if($rootScope.disconnected) {
                        $rootScope.disconnected = null;
                        $rootScope.$broadcast("reconnected", {detail: "Connection has been restored"});
                    }
                    return response;
                },
                'responseError': function(response) {
                    if(response.status == 500) {
                        var msg = "Internal server error";
                        if(response.data.detail) {
                            msg = response.data.detail;
                        }
                        $rootScope.$broadcast('add_top_alert', { message: msg, level: "error", time: null});
                    }
                    if(response.status = 503) {
                        var msg = "Request failed, try again";
                        if(response.data.detail) {
                            msg = response.data.detail;
                        }
                        $rootScope.$broadcast('add_top_alert', { message: msg, level: "error", time: null});
                    }
                    if((response.status === 401 || response.status === 403) && !response.config.noAuth) {
                        if ($location.path() != '/login' && $location.path() != '' && $location.path() != '/info'){
                            $window.location.assign('/');
                        }
                    }
                    if(response.status <= 0) {
                        $rootScope.$broadcast("disconnected", {detail: "Lost connection to server"});
                    }
                    return $q.reject(response);
                }
            };
        }]);
    }])
    .config(function(stConfig) {
        stConfig.sort.delay = -1;
    })
    .config(['$uibTooltipProvider', function($uibTooltipProvider) {
        var parser = new UAParser();
        var result = parser.getResult();
        var touch = result.device && (result.device.type === 'tablet' || result.device.type === 'mobile');
        if ( touch ){
            $uibTooltipProvider.options({trigger: 'dontTrigger'});
        } else {
            $uibTooltipProvider.options({trigger: 'mouseenter'});
        }
    }])
    .config(['$compileProvider', 'appConfig', '$logProvider', function ($compileProvider, appConfig, $logProvider) {
        $compileProvider.debugInfoEnabled(appConfig.debugInfo);
        $compileProvider.commentDirectivesEnabled(appConfig.commentDirectives);
        $compileProvider.cssClassDirectivesEnabled(appConfig.cssClassDirectives);
        $logProvider.debugEnabled(appConfig.logDebug);
    }])
    .config(function (formlyConfigProvider){
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true
                });
            } else {
                obj[key] = value;
            }
            return obj;
        };

        formlyConfigProvider.setType({
            name: 'input',
            templateUrl: 'static/frontend/views/form_template_input.html',
            overwriteOk: true,
            wrapper: ['bootstrapHasError'],
            defaultOptions: function(options) {
                return {
                    templateOptions: {
                        validation: {
                            show: true
                        }
                    }
                };
            }
        });

        formlyConfigProvider.setType({
            name: 'select',
            templateUrl: 'static/frontend/views/form_template_select.html',
            overwriteOk: true,
            wrapper: ['bootstrapHasError'],
            defaultOptions: function defaultOptions(options) {
                var ngOptions = options.templateOptions.ngOptions || 'option[to.valueProp || \'value\'] as option[to.labelProp || \'name\'] group by option[to.groupProp || \'group\'] for option in to.options';
                return {
                    templateOptions: {
                        validation: {
                            show: true
                        }
                    },
                    ngModelAttrs: _defineProperty({}, ngOptions, {
                        value: options.templateOptions.optionsAttr || 'ng-options'
                    })
                };
            },
        });

        formlyConfigProvider.setType({
            name: 'datepicker',
            templateUrl: "static/frontend/views/datepicker_template.html",
            overwriteOk: true,
            wrapper: ['bootstrapHasError'],
            defaultOptions: function defaultOptions(options) {
                return {
                    templateOptions: {
                        validation: {
                            show: true
                        }
                    }
                };
            }
        });

        formlyConfigProvider.setType({
            name: 'select-tree-edit',
            template: '<select class="form-control" ng-model="model[options.key]"><option value="" disabled hidden>Choose here</option></select>',
            wrapper: ['bootstrapLabel', 'bootstrapHasError'],
            defaultOptions: function defaultOptions(options) {
                /* jshint maxlen:195 */
                var ngOptions = options.templateOptions.ngOptions || "option[to.valueProp || 'value'] as option[to.labelProp || 'name'] group by option[to.groupProp || 'group'] for option in to.options";
                return {
                    ngModelAttrs: _defineProperty({}, ngOptions, {
                        value: options.templateOptions.optionsAttr || 'ng-options'
                    })
                };
            },

            apiCheck: function apiCheck(check) {
                return {
                    templateOptions: {
                        options: check.arrayOf(check.object),
                        optionsAttr: check.string.optional,
                        labelProp: check.string.optional,
                        valueProp: check.string.optional,
                        groupProp: check.string.optional
                    }
                };
            }
        });

        formlyConfigProvider.setWrapper({
            name: 'validation',
            types: ['input', 'datepicker', 'select'],
            templateUrl: 'static/frontend/views/form_error_messages.html'
        });
    })
    .directive('setTouched', function MainCtrl() {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model
                element.on('blur', function() {
                    var modelControllers = scope.$eval(attrs.setTouched);
                    if(angular.isArray(modelControllers)) {
                        angular.forEach(modelControllers, function(modelCntrl) {
                            modelCntrl.$setTouched();
                        });
                    }
                });
            }
        };
    })
    .run(function (djangoAuth, $rootScope, $state, $location, $cookies, PermPermissionStore, PermRoleStore, $http, myService, formlyConfig, formlyValidationMessages, $urlRouter, permissionConfig) {
        formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'form.$submitted || fc.$touched || fc[0].$touched';
        formlyValidationMessages.addStringMessage('required', 'This field is required');

        djangoAuth.initialize('/rest-auth', false).then(function (response) {
            $rootScope.auth = response.data;
            myService.getPermissions(response.data.permissions);
            // kick-off router and start the application rendering
            $urlRouter.sync();
            // Also enable router to listen to url changes
            $urlRouter.listen();
            $rootScope.listViewColumns = myService.generateColumns(response.data.ip_list_columns).activeColumns;
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                if (toState.name === 'login') {
                    return;
                }
                if (djangoAuth.authenticated !== true) {
                    event.preventDefault();
                    $state.go('login'); // go to login
                }

                // now, redirect only not authenticated
            });
        }).catch(function (status) {
            $state.go('login');
        });
        $rootScope.$on('disconnected', function (event, data) {
            $rootScope.disconnected = {message: data.detail, time: new Date()};
        });
        $rootScope.$on('reconnected', function (event, data) {
            $rootScope.disconnected = null;
        });
        $rootScope.$on('$stateChangeStart', function (evt, to, params, from) {
            if (to.redirectTo) {
                evt.preventDefault();
                $state.go(to.redirectTo, params, { location: 'replace' })
            }
            if(to.name == 'login' && djangoAuth.authenticated) {
                evt.preventDefault();
                if(from.name != "") {
                    $state.transitionTo(from.name);
                } else {
                    $state.transitionTo('home.info');
                }
            }
            if(to.name == "home.administration" || to.name == "home.workarea") {
                evt.preventDefault();
                var resolved = Object.resolve(to.name, permissionConfig);
                for( var key in resolved) {
                    if(key != "_permissions" && myService.checkPermissions(nestedPermissions(resolved[key]))) {
                        $state.go(to.name + "." + key);
                        return;
                    }
                }
                $state.go("home.restricted");
                return;
            }
        });

    });
