'use client';

import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { safeReservation, SafeUser } from "../types";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";
import { on } from "events";

interface ReservationsClientProps {
    reservations: safeReservation[];
    currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');

    const onCancel = useCallback((id: string) => {
        setDeletingId(id);

        axios.delete(`/api/reservations/${id}`)
        .then(() => {
            toast.success('Reservation has been cancelled');
            router.refresh();
        })
        .catch(() => {
            toast.error('Failed to cancel reservation');
        })
        .finally(() => {
            setDeletingId('');
        })

    }, [router]);

    return ( 
        <Container>
            <Heading
                title="Reservations"
                subtitle="Manage your reservations here"
            />
            <div
                className="
                    mt-10
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    xl:grid-cols-5
                    2xl:grid-cols-6
                    gap-8
                "
            >
                {reservations.map((reservations) => (
                    <ListingCard
                        key={reservations.id}
                        data={reservations.listing}
                        reservation={reservations}
                        actionId={reservations.id}
                        onAction={onCancel}
                        disabled={deletingId === reservations.id}
                        actionLabel="Cancel guest Reservation"
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </Container>
     );
}
 
export default ReservationsClient;