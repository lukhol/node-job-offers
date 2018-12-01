const chai = require('chai');
const sinon = require('sinon');
var expect = chai.expect;

const JobOfferController = require('../../src/controllers/JobOfferController');
const Category = require('../../src/models/Category');
const JobOffer = require('../../src/models/JobOffer');

describe('----- JobOfferController -----', () => {
    const expectedUser = {
        _id: 'some-id',
        title: 'some title',
        from: 'fromdate',
        to: 'todate', 
        companyName: 'DNA',
        category: {
            _id: 'some-category-id'
        }
    };

    const jobOffer = {
        id: 'job-offer-id',
        from: 'from',
        to: 'to',
        companyName: 'company-name',
        category: 'category-id',
        user: 'user-id'
    };

    let req, res;

    beforeEach(() => {
        sinon.stub(JobOffer, 'findOne');
        sinon.stub(JobOffer, 'find');

        req = {
            params: {
                id: "5bf9c6720f0b7f2d5cc5576b"
            }
        };

        res = {
            status: sinon.stub(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        JobOffer.findOne.restore();
        JobOffer.find.restore();
    });

    context('GET BY ID' , function() {
        it('CANNOT - not exists', () => {
            JobOffer.findOne.yields({}, null);
    
            JobOfferController.getById(req, res, null);
    
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.json, {});
        });
    
        it('CAN - success', () => {
            JobOffer.findOne.yields(null, expectedUser);
    
            JobOfferController.getById(req, res, null);
    
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, {
                id: expectedUser._id,
                title: expectedUser.title,
                from: expectedUser.from,
                to: expectedUser.to, 
                companyName: expectedUser.companyName,
                categoryId: 'some-category-id'
            });
        });
    });

    context('GET ALL', function() {
        it('CANNOT - database call failed', function() {
            JobOffer.find.yields({}, null);
    
            JobOfferController.getAll(req, res, null);
    
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, {message: "Something went wrong. Sorry :("});
        }); 
    
        it('CAN - empty list', function() {
            JobOffer.find.yields(null, []);
    
            JobOfferController.getAll(req, res, null);
    
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, []);
        });
    
        it('CAN - more than one item', function() {
            //Arrange
            const expectedDocs = [expectedUser, {
                _id: 'some-id-2',
                title: 'some title 2',
                from: 'fromdate-2',
                to: 'todate-2', 
                companyName: 'DNA-2',
                category: {
                    _id: 'some-category-id-2'
                }
            }];
    
            JobOffer.find.yields(null, expectedDocs);
    
            //Act
            JobOfferController.getAll(req, res, null);
    
            //Assert
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, sinon.match.array);
    
            expect(res.json.calledOnce).to.be.true;
            expect(res.status.calledOnce).to.be.true;
            expect(res.json.getCall(0).args[0][0].categoryId).is.equal('some-category-id');
            expect(res.json.getCall(0).args[0][1].categoryId).is.equal('some-category-id-2');
            expect(res.json.getCall(0).args[0][0].id).is.not.undefined;
        });
    });

    context('SEARCH', function() {
        it("CANNOT - database error", async () => {
            JobOffer.find.restore();

            //Arrange
            sinon.stub(JobOffer, 'find').rejects();

            req.query = {
                categoryId: [],
                userId: []
            };

            //Act
            await JobOfferController.search(req, res, null);

            //Assert
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.json, { message: sinon.match.string });
        });

        it('CAN - success', async () => {
            JobOffer.find.restore();

            //Arrange
            sinon.stub(JobOffer, 'find').resolves([jobOffer, jobOffer]);

            req.query = {
                categoryId: [],
                userId: []
            };

            //Act
            await JobOfferController.search(req, res, null);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, [ sinon.match.object, sinon.match.object ]);

            //Alternatve to above
            expect(res.status.calledOnce).to.be.true;
            expect(res.status.firstCall.args[0]).to.equal(200);
            expect(res.json.calledOnce).to.be.true;
            expect(res.json.args[0][0]).to.be.an('array').that.has.length(2);
            expect(res.json.args[0][0][0]).to.be.an('object');
        });
    });

    context('POST', function() {
        it('CANNOT - validation failed', function() {

        });
    });
});