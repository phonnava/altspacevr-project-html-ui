/**
 * Created by phonnavalli on 5/4/17.
 */



//Graphing Options
var userData
dashboard.controller('pieChart', function ($scope, $http) {
    var userHandler = Data.User.getAll();
    $scope.data = [];
    userHandler.then(function(data) {
        $scope.data.push({key:'Users',y:data.length});

    });
    var spaceHandler = Data.Space.getAll();
    spaceHandler.then(function(data) {
        $scope.data.push({key:'Spaces',y:data.length});
    });

    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 350,
            x: function(d){return d.key;},
            y: function(d){return d.y;},
            showLabels: true,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

}),

dashboard.controller('stackChart', function ($scope, $http) {
    var stack = $http.get('js/dbDevices.json');
    $scope.$on('$locationChangeStart', function (event) {
        window.onresize = null;
    });

    stack.then(function (data) {
        $scope.data = data.data;


        $scope.options = {
            chart: {
                type: 'stackedAreaChart',
                height: 350,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                },
                useVoronoi: false,
                clipEdge: true,
                duration: 100,
                useInteractiveGuideline: true,
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function (d) {
                        return d3.time.format('%x')(new Date(d))
                    }
                },
                yAxis: {
                    tickFormat: function (d) {
                        return d3.format(',.2f')(d);
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                }

            }

        };
        d3.select('#chart svg')
            .append("text")
            .attr("x", 200)
            .attr("y", 100)
            .attr("text-anchor", "middle")
            .text("Sample Charts");
    })


});


dashboard.controller('Model', function ($scope, $http,formService) {
    $scope.title = "Model";
    $scope.tests = $http.get('js/db.json');
    $scope.data = [];
    $scope.User = [];
    $scope.userHeader = [];
    $scope.Space = [];
    $scope.spaceHeader = [];
    $scope.count = 3;


//User Model
    var userHandler = Data.User.getAll();
    userHandler.then(function (data) {
        $scope.originalUserList = data;
        $scope.User = data;
        $scope.mapIdToUserName();
        var obj = $scope.User[0];
        $scope.userHeader = $.map(obj, function (element, index) {
            return index
        })
    });

    /*** Handling Space Model*/
    var spaceHandler = Data.Space.getAll();
    spaceHandler.then(function (data) {
        $scope.originalSpacesList = data;
        $scope.Space = data;
        var obj = $scope.Space[0];
        $scope.spaceHeader = $.map(obj, function (value, key) {
            return key
        });
        $scope.init();
    });


    //general functions

    $scope.edit = function (index, arraySet) {
        $scope.currentSelected = formService.editData(index, arraySet);


    };


    //Blank create form
    $scope.init = function () {
        $scope.createSpaceForm = angular.copy($scope.Space[0]);
        for (key in $scope.createSpaceForm) {
            if (typeof($scope.createSpaceForm[key]) == 'boolean') {
                $scope.createSpaceForm[key] = false;
            } else if (typeof($scope.createSpaceForm[key]) == 'number') {
                if (key == 'created_by') {
                    $scope.createSpaceForm[key] = 1;
                } else {
                    $scope.createSpaceForm[key] = "";
                }

            } else {
                $scope.createSpaceForm[key] = "";
            }
        }

        $scope.createUserForm = angular.copy($scope.User[0]);
        for (key in $scope.createUserForm) {
            if (typeof($scope.createUserForm[key]) == 'boolean') {
                $scope.createUserForm[key] = false;
            } else if (typeof($scope.createUserForm[key]) == 'number') {
                if (key == 'created_by') {
                    $scope.createUserForm[key] = 1;
                } else {
                    $scope.createUserForm[key] = "";
                }

            } else {
                $scope.createUserForm[key] = "";
            }
        }

    };

    $scope.createNew = function () {
        $scope.currentSelected = angular.copy($scope.createSpaceForm);
    };
    $scope.createNewUser = function () {
        $scope.currentSelected = angular.copy($scope.createUserForm);
    };

    $scope.close = function(){
        $window.close();
    };


    // Refreshing Scope after Save/Delete

    $scope.refreshSpaceModel = function (url) {

        var spaceHandler = Data.Space.getAll();
        spaceHandler.then(function (data) {
            $scope.originalSpacesList = data;
            $scope.Space = data;
            window.location.href = url;

        });

    };

    $scope.refreshUserModel = function (url) {

        var userHandler = Data.User.getAll();
        userHandler.then(function (data) {
            $scope.originalUserList = data;
            $scope.User = data;
            window.location.href = url;

        });

    };

    //Updating-Creating Space

    $scope.save = function (item) {
        var found = formService.isFound(item, $scope.originalUserList);
        for (var i = 0; i < item['members'].length; i++) {
            item['members'][i] = parseInt(item['members'][i]);
        }
        if (found) {
            userHandler = Data.Space.updateById(item.id, item);
            userHandler.then(function (data) {

                $scope.refreshSpaceModel("#!/SpaceDetail");


            });

        } else {
            userHandler = Data.Space.create(item);
            userHandler.then(function (data) {
                $scope.refreshSpaceModel("#!/Spaces");

            });
        }

    };

    $scope.saveUser = function (item) {
        var found = formService.isFound(item, $scope.originalUserList);
        if (found) {
            userHandler = Data.User.updateById(item.id, item);
            userHandler.then(function (data) {
                $scope.refreshUserModel("#!/UserDetail");

            });

        } else {
            userHandler = Data.User.create(item);
            userHandler.then(function (data) {
                $scope.refreshUserModel("#!/Users");

            });
        }

    };

    //Deleting
    $scope.delete = function (item) {
        var found = formService.isFound(item, $scope.originalSpacesList);
        if (found) {
            var spaceHandler = Data.Space.deleteById(item.id);
            spaceHandler.then(function (data) {
                $scope.refreshSpaceModel("#!/Spaces");

            });

        } else {
            console.log("Data not found");
        }
    };

    $scope.deleteUser = function (item) {
        var found = formService.isFound(item, $scope.originalUserList);
        if (found) {
            var userHandler = Data.User.deleteById(item.id);
            userHandler.then(function (data) {
                $scope.refreshUserModel("#!/Users");

            });

        } else {
            console.log("Data not found");
        }
    };


    //Id'd to Name Mapping
    $scope.mapIdToUserName = function () {
        $scope.userMap = [];
        for (item in $scope.User) {
            var id = $scope.User[item]['id'];
            var value = $scope.User[item]['first_name'] + $scope.User[item]['last_name'];

            $scope.userMap[id] = value;
        }

    };

    //Injecting $scope to service so we can use them

    $scope.getType = formService.getType;
    $scope.getUserNameFromId = formService.getUserNameFromId;
    $scope.getCurrentElementForEdit = formService.getCurrentElementForEdit;
    $scope.getReadOnly = formService.getReadOnly;


});













