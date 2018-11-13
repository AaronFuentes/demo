import React from 'react';
import Spinner from 'react-spinkit';
import { primary } from '../styles/colors';

const LoadingSection = ({ size }) => (
    <Spinner
        name="cube-grid"
        color={primary}
        className="spinner"
    />
)

export default LoadingSection;