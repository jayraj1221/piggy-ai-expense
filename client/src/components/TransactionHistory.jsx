import React, { useState } from 'react';

const TransactionHistory = ({ data = [] }) => {
    const [showAll, setShowAll] = useState(false);
    
    // Ensure data is an array to prevent errors
    const transactions = Array.isArray(data) ? [...data].reverse() : [];
    
    // Get either the latest 5 transactions or all transactions based on state
    const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);
    
    // Only show the View More button if there are more than 5 transactions
    const hasMoreTransactions = transactions.length > 5;

    return (
        <div className="space-y-4 overflow-y-auto">
            <div className="space-y-2 overflow-y-auto">
                {displayedTransactions.length > 0 ? (
                    displayedTransactions.map((item) => (
                        <TransactionItem
                            key={item.id || item._id}
                            title={item.description || ''}
                            daysAgo={
                                new Date(item.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                            }
                            amount={item.amount}
                            positive={item.amount > 0}
                        />
                    ))
                ) : (
                    <div className="text-gray-500 text-sm">No Transactions</div>
                )}
            </div>
            
            {hasMoreTransactions && (
                <button 
                    onClick={() => setShowAll(!showAll)} 
                    className="w-full py-2 text-sm  font-medium  focus:outline-none"
                >
                    {showAll ? 'Show Less' : 'View More'}
                </button>
            )}
        </div>
    );
};

function TransactionItem({ title, daysAgo, amount, positive = false }) {
    return (
        <div className="flex justify-between items-center bg-white p-4 border rounded-lg shadow-sm">
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-xs text-gray-500 ml-2">{daysAgo}</p>
            </div>
            <p className={`font-semibold ${positive ? 'text-green-600' : 'text-red-500'}`}>
                ₹ {amount}
            </p>
        </div>
    );
}

export default TransactionHistory;