"use client";

import { useEffect } from "react";
import EmptyState from "./components/EmptyState";

interface ErrorSateProps {
    error: Error
}

const ErrorState: React.FC<ErrorSateProps> = ({
    error
}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <EmptyState
            title="An error occurred"
            subtitle="Please try again later"
        />
    )
};

export default ErrorState;
