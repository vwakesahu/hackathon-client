const { ethers } = require("ethers");
const { chains } = require("./constants");

/**
 * Prepares encodedData and total amount of ETH to send across all chains
 *
 * @param {string[]} recipients - List of recipient addresses
 * @param {bigint[]} amounts - List of amounts corresponding to each recipient
 * @param {string[]} chainNames - Chain names to loop over
 * @param {Object} domainIds - Mapping of chainName => domainId (Hyperlane)
 *
 * @returns {{ encodedData: string, finalTotal: bigint }}
 */
function prepareDistributions(recipients, amounts, domainIds) {
  const chainNames = chains
    .map((chain) => chain.name.toLowerCase().replace(/\s+/g, "")) // e.g. "Base Sepolia" -> "basesepolia"
    .filter((name) =>
      [
        "basesepolia",
        "arbitrumsepolia",
        "mantlesepolia",
        "amoy",
        "scrollsepolia",
        "sepolia",
        "optimismsepolia",
      ].includes(name)
    );

  if (recipients.length !== amounts.length) {
    throw new Error("Recipients and amounts array length mismatch");
  }

  const distributions = [];
  let finalTotal = 0n;

  for (const chainName of chainNames) {
    const domainId = domainIds[chainName];
    const total = amounts.reduce((sum, a) => sum + a, 0n);
    finalTotal += total;

    distributions.push([recipients, amounts, total, domainId]);
  }

  const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
    ["tuple(address[],uint256[],uint256,uint32)[]"],
    [distributions]
  );

  return { encodedData, finalTotal };
}

module.exports = prepareDistributions;
