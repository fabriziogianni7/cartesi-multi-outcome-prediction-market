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
import { useWriteContract, useTransactionReceipt } from 'wagmi'

import { marketId, MultiOutcomePredictionMarket, MultiOutcomePredictionMarketAddress } from '../contracts-abi/MultiOutcomePredictionMarketABI'
import { useEffect } from "react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

interface OutcomeDrawerProps {
    outcomes: string[];
    probabilities: number[];
}

interface OutcomeData {
    outcome: string;
    probability: number;
    index: number;
}

function calculateColor(probability: number, maxProbability: number): string {
    const ratio = probability / maxProbability;
    const gold = { r: 255, g: 215, b: 0 };
    const green = { r: 0, g: 128, b: 0 };
    const r = Math.round(green.r + (gold.r - green.r) * ratio);
    const g = Math.round(green.g + (gold.g - green.g) * ratio);
    const b = Math.round(green.b + (gold.b - green.b) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
}

const CustomBar = ({ x, y, width, height, fill, onClick, index, ...others }: any) => {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width + 100}
                height={height}
                fill={fill}
                onClick={() => onClick(index)}
                style={{ cursor: 'pointer' }}
            />
            {React.Children.map(others.children, child =>
                React.cloneElement(child, { x, y, width, height })
            )}
        </g>
    );
};

export function OutcomeDrawer({ outcomes, probabilities }: OutcomeDrawerProps) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedOutcome, setSelectedOutcome] = React.useState<OutcomeData | null>(null);
    const [shares, setShares] = React.useState<number | ''>('');
    const { writeContract, data: txHash } = useWriteContract();
    const { isSuccess, isError, isLoading } = useTransactionReceipt({ hash: txHash });


    useEffect(() => {

        if (isLoading) {
            setDrawerOpen(false)
            toast("Transaction is pending", {
                description: `tx hash: ${txHash}`,
                action: {
                    label: "View",
                    onClick: () => window.open(`https://holesky.etherscan.io/tx/${txHash}`),
                },
            })
        }
    }, [isLoading])

    useEffect(() => {
        if (isSuccess) {
            setDrawerOpen(false)
            toast("Transaction is succesful", {
                description: `tx hash: ${txHash}`,
                action: {
                    label: "View",
                    onClick: () => window.open(`https://holesky.etherscan.io/tx/${txHash}`),
                },
            })
        }
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            setDrawerOpen(false)
            toast("Transaction was not successful", {
                description: `tx hash: ${txHash}`,
                action: {
                    label: "View",
                    onClick: () => window.open(`https://holesky.etherscan.io/tx/${txHash}`),
                },
            })
        }
    }, [isError])

    // Transform data with index
    const data = React.useMemo(() => {
        return outcomes.map((outcome, index) => ({
            outcome,
            probability: probabilities[index],
            index: index // Explicitly include index in the data
        }));
    }, [outcomes, probabilities]);

    const maxProbability = Math.max(...probabilities);

    const handleBarClick = (index: number) => {
        const selectedData = data[index];
        console.log('Bar clicked:', {
            outcome: selectedData.outcome,
            probability: selectedData.probability,
            index: selectedData.index,
            rawData: selectedData
        });
        setSelectedOutcome(selectedData);
        setDialogOpen(true);
    };

    const handleConfirm = async () => {
        if (!shares) {
            alert('Please enter the number of shares.');
            return;
        }

        if (!selectedOutcome) {
            alert('Please select an outcome first.');
            return;
        }

        console.log('Confirming purchase:', {
            marketId: 1,
            outcomeIndex: selectedOutcome.index,
            shares: shares
        });

        try {
            await writeContract({
                abi: MultiOutcomePredictionMarket,
                address: MultiOutcomePredictionMarketAddress as string,
                functionName: 'prepareCallAndRunExecution',
                args: [
                    BigInt(marketId as string), // marketId hardcoded to 1
                    BigInt(selectedOutcome.index), // outcomeIndex from selected option
                    BigInt(shares), // nShares from input field
                ],
            });
            setDialogOpen(false);
            setShares('');
        } catch (error) {
            console.error('Transaction failed:', error);
            alert('Transaction failed. Please try again.');
        }
    };

    return (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">See Possible Outcomes</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-6xl">
                    <DrawerHeader>
                        <DrawerTitle>Who will end in the top 3 in 2025 F1 Champrionship?</DrawerTitle>
                        <DrawerDescription>Place your prediction.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}
                                    margin={{
                                        top: 55,
                                        right: 30,
                                        left: 20,
                                        bottom: 50,
                                    }}>
                                    <Bar dataKey="probability" barSize={40} shape={(props: any) => (
                                        <CustomBar
                                            {...props}
                                            index={props.index}
                                            fill={calculateColor(props.payload.probability, maxProbability)}
                                            onClick={handleBarClick}
                                        />
                                    )}>
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
                                        <LabelList
                                            dataKey="probability"
                                            position="bottom"
                                            formatter={(value: any) => `${(Math.floor(value * 10) / 10).toFixed(1) + '%'}`}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedOutcome?.outcome}</DialogTitle>
                            <DialogDescription>
                                Current probability: {selectedOutcome?.probability.toFixed(12)}%
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
            <Toaster />
        </Drawer>
    );
}