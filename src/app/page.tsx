'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { ethers } from 'ethers';
import EventTicket from '@/artifacts/contracts/EventTicket.sol/EventTicket.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export default function Home() {
  const { account, library, activate, active } = useWeb3();
  const [events, setEvents] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (active && library) {
      loadEvents();
      loadMyTickets();
    }
  }, [active, library, account]);

  const loadEvents = async () => {
    if (!library) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EventTicket.abi, library);
      const eventCount = await contract.getEventCount();
      const eventsList = [];

      for (let i = 0; i < eventCount; i++) {
        const event = await contract.getEventDetails(i);
        eventsList.push({
          id: i,
          name: event.name,
          timestamp: new Date(Number(event.timestamp) * 1000),
          ticketPrice: ethers.formatEther(event.ticketPrice),
          totalSupply: Number(event.totalSupply),
          ticketsSold: Number(event.ticketsSold),
          isActive: event.isActive
        });
      }

      setEvents(eventsList);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadMyTickets = async () => {
    if (!library || !account) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EventTicket.abi, library);
      const tickets = await contract.getMyTickets();
      setMyTickets(tickets.map((id: any) => Number(id)));
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const buyTicket = async (eventId: number, price: string) => {
    if (!library || !account) return;
    try {
      setLoading(true);
      const signer = await library.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EventTicket.abi, signer);
      const tx = await contract.buyTicket(eventId, { value: ethers.parseEther(price) });
      await tx.wait();
      await loadMyTickets();
    } catch (error) {
      console.error('Error buying ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">NFT Ticketing System</h1>
          {!active ? (
            <button
              onClick={() => activate()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="text-sm">
              Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Events</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border p-4 rounded-lg">
                  <h3 className="text-xl font-semibold">{event.name}</h3>
                  <p>Date: {event.timestamp.toLocaleDateString()}</p>
                  <p>Price: {event.ticketPrice} ETH</p>
                  <p>Tickets: {event.ticketsSold}/{event.totalSupply}</p>
                  <button
                    onClick={() => buyTicket(event.id, event.ticketPrice)}
                    disabled={loading || !event.isActive || event.ticketsSold >= event.totalSupply}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : 'Buy Ticket'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">My Tickets</h2>
            <div className="space-y-4">
              {myTickets.length > 0 ? (
                myTickets.map((ticketId) => (
                  <div key={ticketId} className="border p-4 rounded-lg">
                    <p>Ticket ID: {ticketId}</p>
                  </div>
                ))
              ) : (
                <p>No tickets owned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
