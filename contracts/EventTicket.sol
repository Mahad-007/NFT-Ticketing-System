// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicket is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint256 private _nextEventId;

    struct Event {
        string name;
        uint256 timestamp;
        uint256 ticketPrice;
        uint256 totalSupply;
        uint256 ticketsSold;
        bool isActive;
    }

    // Mapping from event ID to Event struct
    mapping(uint256 => Event) public events;
    // Mapping from token ID to event ID
    mapping(uint256 => uint256) public tokenToEvent;
    // Mapping from user address to their ticket token IDs
    mapping(address => uint256[]) public userTickets;

    event EventCreated(uint256 indexed eventId, string name, uint256 timestamp, uint256 ticketPrice, uint256 totalSupply);
    event TicketPurchased(address indexed buyer, uint256 indexed eventId, uint256 tokenId);

    constructor() ERC721("EventTicket", "ETKT") Ownable(msg.sender) {}

    function createEvent(
        string memory name,
        uint256 timestamp,
        uint256 ticketPrice,
        uint256 totalSupply
    ) external onlyOwner returns (uint256) {
        require(timestamp > block.timestamp, "Event must be in the future");
        require(totalSupply > 0, "Total supply must be greater than 0");
        require(ticketPrice > 0, "Ticket price must be greater than 0");

        uint256 eventId = _nextEventId;
        events[eventId] = Event({
            name: name,
            timestamp: timestamp,
            ticketPrice: ticketPrice,
            totalSupply: totalSupply,
            ticketsSold: 0,
            isActive: true
        });

        emit EventCreated(eventId, name, timestamp, ticketPrice, totalSupply);
        _nextEventId++;
        return eventId;
    }

    function buyTicket(uint256 eventId) external payable {
        Event storage event_ = events[eventId];
        require(event_.isActive, "Event is not active");
        require(event_.ticketsSold < event_.totalSupply, "Event is sold out");
        require(msg.value >= event_.ticketPrice, "Insufficient payment");
        require(block.timestamp < event_.timestamp, "Event has already started");

        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        tokenToEvent[tokenId] = eventId;
        userTickets[msg.sender].push(tokenId);
        event_.ticketsSold++;

        emit TicketPurchased(msg.sender, eventId, tokenId);
        _nextTokenId++;
    }

    function getMyTickets() external view returns (uint256[] memory) {
        return userTickets[msg.sender];
    }

    function verifyOwnership(address owner, uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) == owner;
    }

    function getEventDetails(uint256 eventId) external view returns (
        string memory name,
        uint256 timestamp,
        uint256 ticketPrice,
        uint256 totalSupply,
        uint256 ticketsSold,
        bool isActive
    ) {
        Event storage event_ = events[eventId];
        return (
            event_.name,
            event_.timestamp,
            event_.ticketPrice,
            event_.totalSupply,
            event_.ticketsSold,
            event_.isActive
        );
    }

    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
} 