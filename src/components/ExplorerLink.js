import React from 'react';
import { EXPLORER_URL } from '../config';


const ExplorerLink = ({ txHash }) => (
    <a href={`${EXPLORER_URL}/transaction/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
    >
        {txHash}
    </a>
)

export default ExplorerLink;