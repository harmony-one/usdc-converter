const { ethers } = require("ethers");

// Contract addresses
const TOKEN_CONVERTER_ADDRESS = "0x003f4d122982ccCcb5AF817dE055E5F841509CCC";
const INPUT_TOKEN_1_ADDRESS = "0x5573264539929ed86F81bF18Ac05A99502557ACe";
const OUTPUT_TOKEN_ADDRESS = "0x3BC1d310e8B1d52ab96D7fE43c9A90eb0EC6FE39";

// ABI (example, ensure it matches your contracts)
const TOKEN_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) public view returns (uint256)"
];
const TOKEN_CONVERTER_ABI = [
  "function convert(address inputToken, uint256 amount) public"
];

// Setting up provider and wallet
const provider = new ethers.providers.JsonRpcProvider("https://api.harmony.one");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

// Main function
async function convertTokens() {
  const inputToken = new ethers.Contract(INPUT_TOKEN_1_ADDRESS, TOKEN_ABI, wallet);
  const outputToken = new ethers.Contract(OUTPUT_TOKEN_ADDRESS, TOKEN_ABI, wallet);
  const tokenConverter = new ethers.Contract(TOKEN_CONVERTER_ADDRESS, TOKEN_CONVERTER_ABI, wallet);

  // Amount of tokens to convert (example)
  const amountToConvert = ethers.utils.parseUnits("10", 18); // 10 tokens with 18 decimals

  // Step 1: Check balance
  const balance = await inputToken.balanceOf(wallet.address);
  console.log(`Your Input Token 1 balance: ${ethers.utils.formatUnits(balance, 18)} tokens`);

  if (balance.lt(amountToConvert)) {
    console.error("Insufficient funds for conversion.");
    return;
  }

  // Step 2: Approve tokens for the contract
  console.log("Approving tokens...");
  const approveTx = await inputToken.approve(TOKEN_CONVERTER_ADDRESS, amountToConvert);
  await approveTx.wait();
  console.log("Tokens approved.");

  // Step 3: Perform the conversion
  console.log("Initiating token conversion...");
  const convertTx = await tokenConverter.convert(INPUT_TOKEN_1_ADDRESS, amountToConvert);
  const receipt = await convertTx.wait();
  console.log("Conversion successful. Transaction hash:", receipt.transactionHash);

  // Step 4: Check new balance of the output token
  const newBalance = await outputToken.balanceOf(wallet.address);
  console.log(`Your new Output Token balance: ${ethers.utils.formatUnits(newBalance, 18)} tokens`);
}

// Run the function
convertTokens().catch((error) => {
  console.error("Error:", error);
});
