# TradeChain

A blockchain-assisted international trade and shipment traceability platform. It helps exporters, importers and customers track shipments, verify recorded quantities, and investigate delivery discrepancies.

## The problem

An exporter sends 1,000 units. The customer receives 850 and refuses to pay for the missing 150. Neither side has a reliable, shared record of what happened at each stage.

## The solution

TradeChain records shipment events and quantities at every stage, so the history is traceable and tamper-evident. A mismatch is flagged as "requires investigation". It never blames a participant automatically.

> The blockchain records events submitted by authorized participants. It does not independently prove the physical contents of a package.

## Features

- Three role portals: Exporter, Importer, Customer
- Exporter creates shipments with any expected quantity
- Importer records the received quantity, and the difference is calculated automatically
- Shipment journey timeline showing every recorded event
- Customer view with delivery progress and discrepancy status
- Recorded history table with a reference for each event
- Single data layer (src/api.js) so a real backend can replace the demo data with one setting

## Tech stack

- React + Vite
- React Router
- Plain CSS
- Planned: Node.js + Express, database, Solidity smart contract, ethers.js

## Run locally

bash
git clone https://github.com/Sheetal-1706/tradechain.git
cd tradechain
npm install
npm run dev


Open http://localhost:5173

## Project status

The frontend is complete and runs on demo data stored in the browser. The login is a placeholder. Backend integration, real authentication and on-chain recording are in progress.

## Screenshots

Screenshots will be added here.
