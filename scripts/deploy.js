const hre = require("hardhat");

async function main() {
    const EventTicket = await hre.ethers.getContractFactory("EventTicket");
    const eventTicket = await EventTicket.deploy();

    await eventTicket.waitForDeployment();

    console.log("EventTicket deployed to:", await eventTicket.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 