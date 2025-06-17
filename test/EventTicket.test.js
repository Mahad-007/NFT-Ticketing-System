const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventTicket", function () {
    let eventTicket;
    let owner;
    let buyer;
    let eventId;

    beforeEach(async function () {
        [owner, buyer] = await ethers.getSigners();
        const EventTicket = await ethers.getContractFactory("EventTicket");
        eventTicket = await EventTicket.deploy();
        await eventTicket.waitForDeployment();

        // Create a test event
        const tx = await eventTicket.createEvent(
            "Test Event",
            Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
            ethers.parseEther("0.1"),
            100
        );
        const receipt = await tx.wait();
        const event = receipt.logs.find(log => log.fragment.name === 'EventCreated');
        eventId = event.args.eventId;
    });

    describe("Event Creation", function () {
        it("Should create an event with correct parameters", async function () {
            const event = await eventTicket.events(eventId);
            expect(event.name).to.equal("Test Event");
            expect(event.ticketPrice).to.equal(ethers.parseEther("0.1"));
            expect(event.totalSupply).to.equal(100);
            expect(event.ticketsSold).to.equal(0);
            expect(event.isActive).to.be.true;
        });
    });

    describe("Ticket Purchase", function () {
        it("Should allow buying a ticket", async function () {
            const price = ethers.parseEther("0.1");
            await eventTicket.connect(buyer).buyTicket(eventId, { value: price });

            const tickets = await eventTicket.getMyTickets();
            expect(tickets.length).to.equal(1);

            const event = await eventTicket.events(eventId);
            expect(event.ticketsSold).to.equal(1);
        });

        it("Should fail when sending insufficient payment", async function () {
            const price = ethers.parseEther("0.05");
            await expect(
                eventTicket.connect(buyer).buyTicket(eventId, { value: price })
            ).to.be.revertedWith("Insufficient payment");
        });
    });

    describe("Ticket Verification", function () {
        it("Should verify ticket ownership correctly", async function () {
            const price = ethers.parseEther("0.1");
            await eventTicket.connect(buyer).buyTicket(eventId, { value: price });

            const tickets = await eventTicket.getMyTickets();
            const ticketId = tickets[0];

            const isOwner = await eventTicket.verifyOwnership(buyer.address, ticketId);
            expect(isOwner).to.be.true;

            const isNotOwner = await eventTicket.verifyOwnership(owner.address, ticketId);
            expect(isNotOwner).to.be.false;
        });
    });
}); 