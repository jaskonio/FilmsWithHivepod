angular.module('myApp').controller('SelectN1Controller', ['$http', '$scope', '$location', '$translate', '$q', '$timeout', 'NavigationService', 'EntityUtilService', 'N1Service', function($http, $scope, $location, $translate, $q, $timeout, NavigationService, EntityUtilService, N1Service) {

	$scope.dataList = [];
	$scope.selectionContext = {
		allSelected:  false,
		noneSelected: true
	};
	$scope.searchContext = {
		sort: {},
		pageSize: 12,
		currentPage: 1,
		searchText: '',
		totalItems: 0,
		isSearching: false,
		criteria: null
	};
	$scope.sortBy = function(field) {
		EntityUtilService.sortBy($scope.searchContext, field);
		$scope.refresh();
	};
	$scope.select = function(retData) {
		NavigationService.setReturnData({parent: $scope.parent, entity: retData});
		$location.path(NavigationService.getReturnUrl());
	};	
	$scope.loadCurrentPage = function () {
		$scope.dataReceived = false;
		$scope.searchContext.isSearching = true;
		N1Service.getList({ 
			'page'       : $scope.searchContext.currentPage,
			'pageSize'   : $scope.searchContext.pageSize,
			'searchText' : $scope.searchContext.searchText,
			'sort'		 : $scope.searchContext.sort,
			'criteria'   : $scope.searchContext.criteria
		})
		.then(onLoadData)
		.catch(onError)
		.finally(onLoadDataFinally);
	};	

	function onLoadData(httpResponse) {
		$scope.dataList = httpResponse.data;
	} 
	function onError(err) {
		$scope.error = err;
	}
	function onLoadDataFinally() {
		$scope.searchContext.isSearching = false;
		$scope.dataReceived = true;
		$scope.$digest();
	} 	
	
	$scope.updateRecordCount = function () {
		$scope.searchContext.totalItems = null;
		N1Service.getCount({ 
			'searchText' : $scope.searchContext.searchText,
			'criteria'   : $scope.searchContext.criteria
		})
		.then(onUpdateCount, onError);
	};

	function onUpdateCount(httpResponse) {
		$scope.searchContext.totalItems = Number(httpResponse.data);
	} 

	$scope.refresh = function () {
		if(NavigationService.getState().criteria) {
			$scope.searchContext.criteria = NavigationService.getState().criteria;
		}
		$scope.updateRecordCount();
		$scope.searchContext.currentPage = 1;
		$scope.loadCurrentPage();
	};

	function init() {
		var state = NavigationService.getState();
		if (state) {
			$scope.parent = state.parent;
			if(state.criteria) {
				$scope.searchContext.criteria = state.criteria;
			}
		}
		$scope.refresh();
	}

	init();
}]);
