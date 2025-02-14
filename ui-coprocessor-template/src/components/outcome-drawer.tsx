"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Bar, BarChart, LabelList, ResponsiveContainer } from "recharts"
import { Input } from "./ui/input"
import { useWriteContract, useReadContract } from 'wagmi'
import { testAbi } from '../contracts-abi/abis'
// Assuming you have a smart contract with a function to buy shares
const CONTRACT_ADDRESS = '0xYourSmartContractAddress' // Replace with your actual contract address


// Expanded data for different outcomes
const data = [
    { outcome: "Max Verstappen", votes: 20 },
    { outcome: "Lewis Hamilton", votes: 15 },
    { outcome: "Charles Leclerc", votes: 10 },
    { outcome: "Lando Norris", votes: 12.5 },
    { outcome: "Sergio Perez", votes: 14 },
    { outcome: "George Russell", votes: 11 },
    { outcome: "Carlos Sainz", votes: 9 },
    { outcome: "Fernando Alonso", votes: 7.5 },
    { outcome: "Pierre Gasly", votes: 6 },
    { outcome: "Esteban Ocon", votes: 5 },
    { outcome: "Oscar Piastri", votes: 5.5 },
    { outcome: "Yuki Tsunoda", votes: 4.5 },
    { outcome: "Liam Lawson", votes: 4.25 },
    { outcome: "Kimi Antonelli", votes: 3.75 },
    { outcome: "Jack Doohan", votes: 3.5 },
    { outcome: "Gabriel Bortoleto", votes: 3.25 },
    { outcome: "Oliver Bearman", votes: 3 },
    { outcome: "Isack Hadjar", votes: 2.75 },
    { outcome: "Nico Hulkenberg", votes: 2.5 },
    { outcome: "Alex Albon", votes: 2.25 }
];


// Function to calculate color based on votes
function calculateColor(votes: number, maxVotes: number): string {
    const ratio = votes / maxVotes;
    const gold = { r: 255, g: 215, b: 0 };
    const green = { r: 0, g: 128, b: 0 }; // Green color
    const r = Math.round(green.r + (gold.r - green.r) * ratio);
    const g = Math.round(green.g + (gold.g - green.g) * ratio);
    const b = Math.round(green.b + (gold.b - green.b) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
}

const maxVotes = Math.max(...data.map(d => d.votes));

// Custom shape for bar to apply dynamic colors
const CustomBar = ({ x, y, width, height, fill, onClick, ...others }: any) => {
    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill={fill} onClick={onClick} style={{ cursor: 'pointer' }} />
            {React.Children.map(others.children, child =>
                React.cloneElement(child, { x, y, width, height })
            )}
        </g>
    );
};

interface OutcomeDrawerProps {
    outcomes: string[]; // Accept outcomes as a prop
    probabilities: number[]; // Accept probabilities as a prop
}

export function OutcomeDrawer({ outcomes, probabilities }: OutcomeDrawerProps) {
    const [open, setOpen] = React.useState(false);
    const [shares, setShares] = React.useState<number | ''>('');
    const { writeContract } = useWriteContract();

    const handleConfirm = async () => {
        if (!shares) {
            alert('Please enter the number of shares.');
            return;
        }
        // Implement your contract write logic here
    };

    // Log outcomes and probabilities for debugging
    console.log('Outcomes:', outcomes);
    console.log('Probabilities:', probabilities);

    // Check if outcomes and probabilities are defined and have the same length
    if (!outcomes || !probabilities || outcomes.length !== probabilities.length) {
        return <p>Error: Outcomes and probabilities must be defined and of the same length.</p>;
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>See Possible Outcomes</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Possible Outcomes</DrawerTitle>
                    <DrawerDescription>Place your prediction.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0">
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={outcomes.map((outcome, index) => ({ outcome, votes: probabilities[index] }))} // Map outcomes and probabilities
                                margin={{
                                    top: 55,
                                    right: 30,
                                    left: 20,
                                    bottom: 50,
                                }}>
                                <Bar dataKey="votes" barSize={40} shape={(props: any) => (
                                    <CustomBar {...props} fill={calculateColor(props.payload.votes, Math.max(...probabilities))} />
                                )}>
                                    <LabelList
                                        dataKey="outcome"
                                        position="top"
                                        angle={-75}
                                        style={{ fill: 'red', fontWeight: 'bold' }}
                                    />
                                    <LabelList
                                        dataKey="votes"
                                        position="bottom"
                                        formatter={(value: any) => `${value}%`}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Select Outcome</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                            <label htmlFor="shares" className="block mb-1">Number of Shares:</label>
                            <Input
                                id="shares"
                                type="number"
                                value={shares}
                                onChange={(e) => setShares(e.target.value ? parseInt(e.target.value) : '')}
                                placeholder="Enter number of shares"
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={handleConfirm}>Purchase</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DrawerContent>
        </Drawer>
    )
}