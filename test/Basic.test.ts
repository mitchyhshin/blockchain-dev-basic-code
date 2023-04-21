import { expect } from 'chai';

describe('Basic', () => {
  before(() => {
    console.log('execute before');
  });

  beforeEach(() => {
    console.log('execute beforeEach');
  });

  it('test', () => {
    console.log('execute test');
  });

  it('test2 ', () => {
    console.log('execute test2');

    const str = 'mo mo mo';
    const strArray = str.split(' ');
    expect(strArray.length).to.be.equal(3);

    expect(strArray[0]).to.be.equal('mo');
    expect(strArray[1]).to.be.equal('mo');
    expect(strArray[2]).to.be.equal('mo');
  });
});
