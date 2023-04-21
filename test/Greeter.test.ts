import { expect } from 'chai';
import { ethers, waffle } from 'hardhat';
import GreeterArtifact from '../artifacts/contracts/Greeter.sol/Greeter.json';
import { Greeter } from '../typechain';

describe('Greeter', () => {
  let greeter: Greeter;
  const initMsg = 'hello blockchain!!!';

  const [admin, other0, other1, other2, receiver] =
    waffle.provider.getWallets();

  before(async () => {});

  beforeEach(async () => {
    greeter = (await waffle.deployContract(admin, GreeterArtifact, [
      initMsg,
    ])) as Greeter;
  });

  it('constructor', async () => {
    const greetMsg = await greeter.getGreet();
    expect(greetMsg).to.be.equal(initMsg);
  });

  it('setGreeting', async () => {
    const secondMsg = 'second greeting msg';

    await greeter.setGreeting(secondMsg);
    const recvMsg = await greeter.getGreet();
    expect(recvMsg).to.be.equal(secondMsg);
  });

  it('setGreeting with event', async () => {
    const secondMsg = 'second greeting msg';

    const transaction = await greeter.setGreeting(secondMsg);
    const receipt = await transaction.wait();

    const event = receipt.events?.filter(x => {
      return x.event == 'SetGreeting';
    })[0];

    expect(event?.args?.sender).to.be.equal(admin.address);
    expect(event?.args?.oldGreeting).to.be.equal(initMsg);
    expect(event?.args?.newGreeting).to.be.equal(secondMsg);

    const thirdMsg = 'third greeting msg';
    await expect(greeter.setGreeting(thirdMsg))
      .to.emit(greeter, 'SetGreeting')
      .withArgs(admin.address, secondMsg, thirdMsg);
  });

  it('getGreetingHistory', async () => {
    const secondMsg = 'second greeting msg';

    const transaction = await greeter.setGreeting(secondMsg);
    const receipt = await transaction.wait();

    const thirdMsg = 'third greeting msg';
    await expect(greeter.setGreeting(thirdMsg))
      .to.emit(greeter, 'SetGreeting')
      .withArgs(admin.address, secondMsg, thirdMsg);

    const count = await greeter.getGreetingHistoryCount();
    expect(count).to.be.equal(3);

    const historyAll = await greeter.getGreetingHistoryAll();
    expect(historyAll.length).to.be.equal(3);
    expect(historyAll[0]).to.be.equal('');
    expect(historyAll[1]).to.be.equal(initMsg);
    expect(historyAll[2]).to.be.equal(secondMsg);

    const secondHistory = await greeter.getGreetingHistoryOne(1);
    expect(secondHistory).to.be.equal(initMsg);

    await expect(greeter.getGreetingHistoryOne(3)).to.reverted;
  });

  it('setGreetingPayable', async () => {
    const secondMsg = 'second greeting msg';

    await expect(greeter.setGreetingPayable(secondMsg)).to.reverted;
    await expect(greeter.setGreetingPayable(secondMsg)).to.revertedWith(
      'msg.value is not 0.1 ether',
    );

    await expect(
      greeter.setGreetingPayable(secondMsg, {
        value: ethers.utils.parseUnits('0.09', 'ether'),
      }),
    ).to.revertedWith('msg.value is not 0.1 ether');

    await expect(
      greeter.setGreetingPayable(secondMsg, {
        value: ethers.utils.parseUnits('0.11', 'ether'),
      }),
    ).to.revertedWith('msg.value is not 0.1 ether');

    await greeter.setGreetingPayable(secondMsg, {
      value: ethers.utils.parseUnits('0.1', 'ether'),
    });

    const recvMsg = await greeter.getGreet();
    expect(recvMsg).to.be.equal(secondMsg);
  });

  it('withdraw', async () => {
    const secondMsg = 'second greeting msg';

    const oldContractEther = await waffle.provider.getBalance(greeter.address);

    expect(oldContractEther).to.be.equal(ethers.utils.parseUnits('0', 'ether'));

    await greeter.connect(other0).setGreetingPayable(secondMsg, {
      value: ethers.utils.parseUnits('0.1', 'ether'),
    });
    await greeter.connect(other0).setGreetingPayable(secondMsg, {
      value: ethers.utils.parseUnits('0.1', 'ether'),
    });

    await greeter.connect(other1).setGreetingPayable(secondMsg, {
      value: ethers.utils.parseUnits('0.1', 'ether'),
    });
    await greeter.connect(other2).setGreetingPayable(secondMsg, {
      value: ethers.utils.parseUnits('0.1', 'ether'),
    });

    const newContractEther = await waffle.provider.getBalance(greeter.address);
    expect(newContractEther).to.be.equal(
      ethers.utils.parseUnits('0.4', 'ether'),
    );

    const other0Balance = await greeter.balances(other0.address);
    const other1Balance = await greeter.balances(other1.address);
    const other2Balance = await greeter.balances(other2.address);

    expect(other0Balance).to.be.equal(ethers.utils.parseUnits('0.2', 'ether'));
    expect(other1Balance).to.be.equal(ethers.utils.parseUnits('0.1', 'ether'));
    expect(other2Balance).to.be.equal(ethers.utils.parseUnits('0.1', 'ether'));

    const oldReceiverEther = await waffle.provider.getBalance(receiver.address);

    await expect(
      greeter.connect(other0).withdraw(receiver.address),
    ).to.revertedWith('only owner');

    await greeter.withdraw(receiver.address);
    const newReceiverEther = await waffle.provider.getBalance(receiver.address);

    expect(newReceiverEther.sub(oldReceiverEther)).to.be.equal(
      ethers.utils.parseUnits('0.4', 'ether'),
    );

    const lastContractEther = await waffle.provider.getBalance(greeter.address);
    expect(lastContractEther).to.be.equal(
      ethers.utils.parseUnits('0', 'ether'),
    );
  });
});
