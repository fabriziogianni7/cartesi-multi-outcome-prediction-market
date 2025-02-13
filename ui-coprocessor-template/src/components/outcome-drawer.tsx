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


export function OutcomeDrawer() {
    const [open, setOpen] = React.useState(false);
    const [selectedDriver, setSelectedDriver] = React.useState({ outcome: "", details: "" });
    const [shares, setShares] = React.useState<number | ''>('');
    const { writeContract } = useWriteContract()

    const result = useReadContract({
        abi: testAbi,
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        functionName: 'totalSupply',
    })




    const handleBarClick = (data: any) => {
        setSelectedDriver(data);
        setOpen(true);
    };


    const handleConfirm = async () => {
        if (!shares) {
            alert('Please enter the number of shares.');
            return;
        }
        writeContract({
            abi: testAbi,
            address: '0x6b175474e89094c44da98b954eedeac495271d0f',
            functionName: 'transferFrom',
            args: [
                '0xd2135CfB216b74109775236E36d4b433F1DF507B',
                '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
                BigInt(123),
            ],
        })

    };


    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">See Possible Outcomes</Button>
            </DrawerTrigger>
            <DrawerContent >
                <div className="mx-auto w-full max-w-6xl ">
                    <DrawerHeader>
                        <DrawerTitle>Who's going to win Formula 1 Championship in 2025?</DrawerTitle>
                        <DrawerDescription>Place your prediction.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}
                                    margin={{
                                        top: 55,
                                        right: 30, // Added right margin for better spacing
                                        left: 20,  // Added left margin for better spacing
                                        bottom: 50,
                                    }}>
                                    <Bar dataKey="votes" barSize={40} shape={(props: any) => (
                                        <CustomBar {...props} fill={calculateColor(props.payload.votes, maxVotes)}
                                            onClick={() => handleBarClick(props.payload)}
                                        />
                                    )}>
                                        {/* Driver names below the bar */}
                                        <LabelList
                                            dataKey="outcome"
                                            position="top"
                                            angle={-75}
                                            style={{ fill: 'red', fontWeight: 'bold' }}
                                            formatter={(value: any) => {
                                                const nameParts = value.split(' ');
                                                return nameParts[nameParts.length - 1];
                                            }}
                                        />
                                        {/* Votes percentage above the bar */}
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
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedDriver.outcome}</DialogTitle>
                            <DialogDescription>
                                {selectedDriver.details}
                            </DialogDescription>
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