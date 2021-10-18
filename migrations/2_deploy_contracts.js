const Freenet = artifacts.require("Freenet");

module.exports = async function(deployer) {
  await deployer.deploy(Freenet);
};
