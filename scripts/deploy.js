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

    const whiteList = [
        "0xBC594CABd205bD993e7FfA6F3e9ceA75c1110da5",
        "0x44cED87b9F1492Bf2DCf5c16004832569f7f6cBa",
        "0x9b5fae311A4A4b9d838f301C9c27b55d19BAa4Fb",
        "0xC8468C26345dcC4DaE328BeFA0e8cF4Dd968BEa9",
        "0x9c5C877DB2A5a37733Fe1a0bdcae8411Cdc8c5B3"
    ];

    const tokenConverter = await TokenConverter.deploy(
        // [inputToken1.address, inputToken2.address],
        whiteList,
        outputToken.address
    );
    await tokenConverter.deployed();
    console.log(`TokenConverter deployed at: ${tokenConverter.address}`);

    // 3. Transfer minting rights for the output token to the TokenConverter contract
    console.log("Transferring ownership of the output token to the TokenConverter contract...");
    const transferTx = await outputToken.transferOwnership(tokenConverter.address);
    await transferTx.wait();
    console.log("Ownership transferred.");

    /*

    // 4. Mint tokens to a test user
    console.log("Minting input tokens to a test user...");
    const [deployer] = await ethers.getSigners();

    const mintTx1 = await inputToken1.mint(deployer.address, ethers.utils.parseEther("1000"));
    await mintTx1.wait();
    console.log(`Minted 1000 IN1 tokens to: ${deployer.address}`);

    const mintTx2 = await inputToken2.mint(deployer.address, ethers.utils.parseEther("1000"));
    await mintTx2.wait();
    console.log(`Minted 1000 IN2 tokens to: ${deployer.address}`);
    */

    console.log("Deployment and initialization complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });