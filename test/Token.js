const {expect} = require("chai");
const {ethers} = require("hardhat"); //yes i want it to be explicit
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token contract", function (){


    async function deployTokenFixture(){
        const [owner, addr1, addr2] = await ethers.getSigners(); //kena sign setiap address
        const hardhatToken = await ethers.deployContract("Token"); //start deploy tpkens contract
        await hardhatToken.waitForDeployment();
        return {hardhatToken, owner, addr1, addr2};
    }

    describe("Deployment", function(){
        it("Should set the right owner",  async function(){
            const {hardhatToken, owner} = await loadFixture(deployTokenFixture);
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });
    
        it("Deployment should assign the total supply of tokens to the owner", async function(){
            const {hardhatToken, owner} = await loadFixture(deployTokenFixture);
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });
    })
    
    describe("Transactions", function(){
            //test for using different account
        it("Should transfer tokens", async function(){
            
            const {hardhatToken, owner ,addr1, addr2} = await loadFixture(deployTokenFixture);
    
            //prev Transfer 50 token from owner to addr1
            // await hardhatToken.transfer(addr1.address, 50);
            // expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    
            await expect(() => hardhatToken.transfer(addr1.address, 50))
                .to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);
    
            //prev Transfer 50 tokens from addr1 to addr2
            // await hardhatToken.connect(addr1).transfer(addr2.address, 50);
            // expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
    
            await expect(() => hardhatToken.connect(addr1).transfer(addr2.address, 50))
                .to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
        });
    
        it("Should emit Transfer events", async function() {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
        
            await expect(hardhatToken.transfer(addr1.address, 50))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(owner.address, addr1.address, 50);
        
            await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(addr1.address, addr2.address, 50);
        });
    
    
    
        it("Should fail if sender doesn't have enough tokens", async function () {
            const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
        
            // Try to send 1 token from addr1 (0 tokens) to owner.
            // `require` will evaluate false and revert the transaction.
            await expect(
                hardhatToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("Not enough tokens, the transaction will be revert");
        
            // Owner balance shouldn't have changed.
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });
    })
    

});


