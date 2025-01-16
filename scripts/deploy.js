const { ethers } = require("hardhat");

async function main() {
    // 1. Deploy MintableToken contracts
    console.log("Deploying MintableToken contracts...");

    const MintableToken = await ethers.getContractFactory("Token");
    const outputToken = await MintableToken.deploy();
    await outputToken.deployed();
    await outputToken.initialize('USDCe', 'USDC');
    console.log(`Output Token deployed at: ${outputToken.address}`);

    const inputToken1 = await MintableToken.deploy();
    await inputToken1.deployed();
    await inputToken1.initialize("Input Token 1", "IN1");
    console.log(`Input Token 1 deployed at: ${inputToken1.address}`);

    const inputToken2 = await MintableToken.deploy();
    await inputToken2.deployed();
    await inputToken2.initialize("Input Token 2", "IN2");
    console.log(`Input Token 2 deployed at: ${inputToken2.address}`);

    // 2. Deploy TokenConverter contract
    console.log("Deploying TokenConverter contract...");
    const TokenConverter = await ethers.getContractFactory("TokenConverter");
    const tokenConverter = await TokenConverter.deploy(
        [inputToken1.address, inputToken2.address],
        outputToken.address
    );
    await tokenConverter.deployed();
    console.log(`TokenConverter deployed at: ${tokenConverter.address}`);

    // 3. Transfer minting rights for the output token to the TokenConverter contract
    console.log("Transferring ownership of the output token to the TokenConverter contract...");
    const transferTx = await outputToken.transferOwnership(tokenConverter.address);
    await transferTx.wait();
    console.log("Ownership transferred.");

    // 4. Mint tokens to a test user
    console.log("Minting input tokens to a test user...");
    const [deployer] = await ethers.getSigners();

    const mintTx1 = await inputToken1.mint(deployer.address, ethers.utils.parseEther("1000"));
    await mintTx1.wait();
    console.log(`Minted 1000 IN1 tokens to: ${deployer.address}`);

    const mintTx2 = await inputToken2.mint(deployer.address, ethers.utils.parseEther("1000"));
    await mintTx2.wait();
    console.log(`Minted 1000 IN2 tokens to: ${deployer.address}`);

    console.log("Deployment and initialization complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });