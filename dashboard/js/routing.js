/**
 * Created by phonnavalli on 5/8/17.
 */

dashboard.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "dashboard.html"
        })
        .when("/dashboard", {
            templateUrl : "dashboard.html"

        })
        .when("/Spaces", {
            templateUrl : "Space.html"
        })
        .when("/Users", {
            templateUrl : "User.html"
        })
        .when("/SpaceDetail", {
            templateUrl : "SpaceDetail.html"
        })
        .when("/SpaceEdit", {
            templateUrl : "SpaceEdit.html"
        })
        .when("/UserDetail", {
            templateUrl : "UserDetail.html"
        })
        .when("/UserEdit", {
            templateUrl : "UserEdit.html"
        })



});
