var mongoose = require('mongoose');
var async = require('async');

var userIds = [];
var userList = [
	{
		name: 'Name0',
		lastname: 'Lastname1',
		age: 20,
		isActive: false,
		visitedPlaces: '507f191e810c19729de860ea'	
	},
	{
		name: 'Name4',
		lastname: 'Lastname5',
		age: 60,
		isActive: false,
		visitedPlaces: '507f191e810c19729de860ea'	
	},
	{
		name: 'Name8',
		lastname: 'Lastname9',
		age: 100,
		isActive: false,
		visitedPlaces: '507f191e810c19729de860ea'	
	},
];
function createUserTestData(done) {
    var userModel = mongoose.model('user');

	var userModels = userList.map(function (user) {
        return new userModel(user);
    });

    var deferred = [
        userModel.remove.bind(userModel)
    ];

    deferred = deferred.concat(userModels.map(function (user) {
        return user.save.bind(user);
    }));

    async.series(deferred, done);
}
function setUserIds(done) {
    mongoose.model('user').find().exec(function (err, results) {
        if (err) {
            return done(err);
        }

        userIds = [];
        results.forEach(function(user){
            userIds.push(user._id);
        });

        return done();
    });
}
function getUserIds() {
    return userIds;
}

var placeIds = [];
var placeList = [
	{
		name: 'Name12',
		description: 'Description13',
		location: {
			coordinates: [
				-5.9859841,
				-5.9859841
			],
			type: 'Point'
		},
		picture: 'Picture15',
		user: '507f191e810c19729de860ea'	
	},
	{
		name: 'Name16',
		description: 'Description17',
		location: {
			coordinates: [
				-5.9859841,
				-5.9859841
			],
			type: 'Point'
		},
		picture: 'Picture19',
		user: '507f191e810c19729de860ea'	
	},
	{
		name: 'Name20',
		description: 'Description21',
		location: {
			coordinates: [
				-5.9859841,
				-5.9859841
			],
			type: 'Point'
		},
		picture: 'Picture23',
		user: '507f191e810c19729de860ea'	
	},
];
function createPlaceTestData(done) {
    var placeModel = mongoose.model('place');

	var placeModels = placeList.map(function (place) {
        return new placeModel(place);
    });

    var deferred = [
        placeModel.remove.bind(placeModel)
    ];

    deferred = deferred.concat(placeModels.map(function (place) {
        return place.save.bind(place);
    }));

    async.series(deferred, done);
}
function setPlaceIds(done) {
    mongoose.model('place').find().exec(function (err, results) {
        if (err) {
            return done(err);
        }

        placeIds = [];
        results.forEach(function(place){
            placeIds.push(place._id);
        });

        return done();
    });
}
function getPlaceIds() {
    return placeIds;
}

var n1Ids = [];
var n1List = [
	{
		score_phrase: 'Score_phrase24',
		title: 'Title25',
		url: 'Url26',
		platform: 'Platform27',
		score: 'Score28',
		genre: 'Genre29',
		editors_choice: 'Editors_choice30',
		release_year: 'Release_year31',
		release_month: 'Release_month32',
		release_day: 'Release_day33'	
	},
	{
		score_phrase: 'Score_phrase34',
		title: 'Title35',
		url: 'Url36',
		platform: 'Platform37',
		score: 'Score38',
		genre: 'Genre39',
		editors_choice: 'Editors_choice40',
		release_year: 'Release_year41',
		release_month: 'Release_month42',
		release_day: 'Release_day43'	
	},
	{
		score_phrase: 'Score_phrase44',
		title: 'Title45',
		url: 'Url46',
		platform: 'Platform47',
		score: 'Score48',
		genre: 'Genre49',
		editors_choice: 'Editors_choice50',
		release_year: 'Release_year51',
		release_month: 'Release_month52',
		release_day: 'Release_day53'	
	},
];
function createN1TestData(done) {
    var n1Model = mongoose.model('n1');

	var n1Models = n1List.map(function (n1) {
        return new n1Model(n1);
    });

    var deferred = [
        n1Model.remove.bind(n1Model)
    ];

    deferred = deferred.concat(n1Models.map(function (n1) {
        return n1.save.bind(n1);
    }));

    async.series(deferred, done);
}
function setN1Ids(done) {
    mongoose.model('n1').find().exec(function (err, results) {
        if (err) {
            return done(err);
        }

        n1Ids = [];
        results.forEach(function(n1){
            n1Ids.push(n1._id);
        });

        return done();
    });
}
function getN1Ids() {
    return n1Ids;
}

module.exports = {
    createUserTestData: createUserTestData,
    setUserIds: setUserIds,
	getUserIds: getUserIds,
    createPlaceTestData: createPlaceTestData,
    setPlaceIds: setPlaceIds,
	getPlaceIds: getPlaceIds,
    createN1TestData: createN1TestData,
    setN1Ids: setN1Ids,
	getN1Ids: getN1Ids,
};
