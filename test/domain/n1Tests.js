var fixtures = require('./fixtures');

describe('N1 relationships', function () {
    before(fixtures.fakeserver.init);
    after(fixtures.fakeserver.deinit);
    beforeEach(fixtures.testData.createN1TestData);
    beforeEach(fixtures.testData.setN1Ids);

});
