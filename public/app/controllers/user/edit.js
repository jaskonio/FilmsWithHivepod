angular.module('myApp').controller('EditUserController', 
  ['$scope', '$routeParams', '$location', '$translate', '$timeout', 'UserErrorService', 'NavigationService', 'EntityUtilService', 'SecurityService', 'UserService', 'PlaceService', 
  function($scope, $routeParams, $location, $translate, $timeout, UserErrorService, NavigationService, EntityUtilService, SecurityService, UserService, PlaceService) {

	$scope.isEdition = false;
	$scope.isCreation = false;
	$scope.isDeletion = false;
	$scope.isView = false;
	$scope.canEdit = false;
	$scope.canDelete = false;	
	$scope.readOnly = false;
	$scope.dataReceived = false;
	$scope.ui = {


	};
	$scope.obj = {
		name : null,
		lastname : null,
		age : null,
		isActive : false,
		actualVisitedPlaces : {},
		enableVisitedPlaces : true
	};

	var saveIndex = 0;
	var manyToManyCount = 0;

	$scope.add = function () {
		$scope.uiWorking = true;
		$scope.obj._id = undefined;
		UserService.add(dataToServer($scope.obj)).then(function (httpResponse) {
			if($scope.parent) {
				NavigationService.setReturnData({parent: $scope.parent, entity: httpResponse.data});
				$location.path(NavigationService.getReturnUrl());
			}
			else {
				gotoList();
			}
	    }, errorHandlerAdd, progressNotify);
	};
	
	$scope.update = function () {
		$scope.uiWorking = true;
		UserService.update(dataToServer($scope.obj)).then(function () { //httpResponse
				returnBack();
			}, errorHandlerUpdate, progressNotify);
	};

	$scope.delete = function () {
		$scope.uiWorking = true;
		UserService.delete($scope.obj._id).then(returnBack, errorHandlerDelete, progressNotify);
	};

	function progressNotify() { //update
	}

	function errorHandlerAdd(httpError) {
		$scope.uiWorking = false;
		$scope.dataReceived = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "add");
	}

	function errorHandlerUpdate(httpError) {
		$scope.uiWorking = false;
		$scope.dataReceived = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "update");
	}

	function errorHandlerDelete(httpError) {
		$scope.uiWorking = false;
		$scope.dataReceived = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "delete");
	}

	function errorHandlerLoad(httpError) {
		$scope.uiWorking = false;
		$scope.dataReceived = true;
		$scope.errors = UserErrorService.translateErrors(httpError, "query");
	}

	function dataToServer(obj) {
	
		return obj;
	}		

	function loadVisitedPlaces(httpResponse) {
		$scope.obj.actualVisitedPlaces = httpResponse.data;
	}

	function loadData(httpResponse) {
		$scope.obj = httpResponse.data;

		$scope.obj.enableVisitedPlaces = true;
		if($scope.obj.visitedPlaces) {
			PlaceService.getDocument($scope.obj.visitedPlaces)
				.then(loadVisitedPlaces, errorHandlerLoad);
		}


		$scope.canEdit = $scope.isView && EntityUtilService.hasActionCapability($scope.obj, 'edit');
		$scope.canDelete = $scope.isView && EntityUtilService.hasActionCapability($scope.obj, 'delete');
		$scope.errors = null;
		$scope.dataReceived = true;
	}
	function returnBack() {
		if ($scope.parent) {
			NavigationService.setReturnData({ parent: $scope.parent });
			$location.path(NavigationService.getReturnUrl());
		}
		else {
			gotoList();
		}
	}

	$scope.cancel = returnBack;

	$scope.gotoEdit = function() {
		$location.path('/user/edit/' + $routeParams.id);		
	};

	$scope.gotoDelete = function() {
		$location.path('/user/delete/' + $routeParams.id);		
	};


	function saveAllThenGotoList() {
		saveIndex++;
		if (saveIndex === manyToManyCount) {
			returnBack();
		}
	}


	function gotoList() {
		$scope.uiWorking = false;
		$location.path('/user/');		
	}

	$scope.submit = function() {
		if ($scope.isCreation && !$scope.editForm.$invalid) {
			$scope.add();
		}
		else if ($scope.isEdition && !$scope.editForm.$invalid) {
			$scope.update();
		}
		else if ($scope.isDeletion) {
			$scope.delete();
		}
	};

	$scope.selectVisitedPlaces = function() {
		//save context
		NavigationService.push($location.path(), "SelectVisitedPlaces", {parent: $scope.obj});
		$location.path('/place/select');
	};
	
	$scope.clearVisitedPlaces = function() {

		$scope.obj.visitedPlaces = null;
		$scope.obj.actualVisitedPlaces = null;
	};
	
	function selectVisitedPlacesBack() {
		var navItem = popNavItem();
		if(navItem.returnData) {
			var user = navItem.returnData.parent;
			if(user) {
				setObj(user);
				$scope.dataReceived = true;
				var visitedPlaces = navItem.returnData.entity;
				if(visitedPlaces){

					$scope.obj.visitedPlaces = visitedPlaces._id;
					$timeout(function() {
					  $scope.obj.actualVisitedPlaces = visitedPlaces;
					}, 100);
				}
				return;
			}
		}

		UserService.getDocument($routeParams.id).then(loadData, errorHandlerLoad);

	}



	function init() {
		$scope.isDeletion = isDeletionContext();
		$scope.isView     = isViewContext();
		$scope.readOnly   = $scope.isDeletion || $scope.isView;
		if ($routeParams.id) {
			$scope.isEdition = !$scope.readOnly;
			$scope.isCreation = false;
			setParent();
		}
		else {
			$scope.isEdition = false;
			$scope.isCreation = true;
			$scope.dataReceived = true;
			$scope.obj._id = 'new';
			setNavigationStatus();
		}


		if (NavigationService.isReturnFrom('SelectVisitedPlaces')) {
			selectVisitedPlacesBack();
			return;
		}

		if ($routeParams.id) {
			UserService.getDocument($routeParams.id).then(loadData, errorHandlerLoad);		
		}

	}

	function isDeletionContext() {
		return stringContains($location.path(), '/delete/');
	}

	function isViewContext() {
		return stringContains($location.path(), '/view/');
	}

	
	function stringContains(text, substring) {
		return text.indexOf(substring) > -1;
	}
	function setParent() {
		var state = NavigationService.getState();
		$scope.parent = (state && state.parent) ? state.parent : null;
		return state;
	}


	function popNavItem() {
		var navItem = NavigationService.pop();
		setNavigationStatus();
		return navItem;
	}

	function setObj(obj) {
		$scope.obj = obj;
		if($scope.editForm) {
			$scope.editForm.$dirty = true;
		}

		if ($routeParams.id && !$scope.obj) {
			UserService.getDocument($routeParams.id).then(loadData, errorHandlerLoad);
		}

	}


	function setNavigationStatus() {

		var state = setParent();
		if ($scope.parent) {
			switch (state.parentClass) {
				case 'place':
					$scope.obj.actualVisitedPlaces = state.parent;
					$scope.obj.visitedPlaces = (state.parent._id === 'new') ? undefined : state.parent._id;
					$scope.obj.enableVisitedPlaces = false;
					break;

				default:
					break;
			}
		}

	}

	init();
}]);
