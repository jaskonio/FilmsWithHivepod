var fixtures = require('./fixtures');

describe('User relationships', function () {
    before(fixtures.fakeserver.init);
    after(fixtures.fakeserver.deinit);
    beforeEach(fixtures.testData.createUserTestData);
    beforeEach(fixtures.testData.setUserIds);
    beforeEach(fixtures.testData.createPlaceTestData);
    beforeEach(fixtures.testData.setPlaceIds);

	describe('VisitedPlaces', function () {
        it('"POST /users/{id}/visitedPlaces" should link a user to a VisitedPlaces', function (done) {

            var userId = fixtures.testData.getUserIds()[0];
            var placeId = fixtures.testData.getPlaceIds()[0];

            var options = {
                url: 'http://127.0.0.1:8012/api/users/' + userId + '/visitedPlaces',
                json: true,
                body: { id: placeId }
            };

            request.post(options, function (err, response, body) {
                if (err) {
                    return done(err);
                }

                expect(response.statusCode).to.be(200);
                expect(body._id.toString()).to.be(userId.toString());
                expect(body.visitedPlaces.toString()).to.be(placeId.toString());
                done();
            });
        });
        it('"GET /users/{id}/visitedPlaces" with wrong id should return 404', function (done) {

            var options = {
                url: 'http://127.0.0.1:8012/api/users/00000759a6d4007c2e410b25/visitedPlaces',
                json: true
            };

            request.get(options, function (err, response, body) {
                if (err) {
                    return done(err);
                }

                expect(response.statusCode).to.be(404);
                expect(body.error).to.be('Not Found');

                done();
            });
        });

        it('"GET /users/{id}/visitedPlaces"  with Invalid id should return 500', function (done) {

            var options = {
                url: 'http://127.0.0.1:8012/api/users/00000/visitedPlaces',
                json: true
            };

            request.get(options, function (err, response, body) {
                if (err) {
                    return done(err);
                }

                expect(response.statusCode).to.be(500);
                expect(body.error.name).to.be('CastError');

                done();
            });
        });
	});
});
