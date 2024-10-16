"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import qs from "query-string";
import { formatISO, set } from "date-fns";
import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModal = () => {
    const searchModal = useSearchModal();
    const router = useRouter();
    const params = useSearchParams();

    const [location, setLocation] = useState<CountrySelectValue>();
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection"
    });

    const Map = useMemo(() => dynamic(() => import("../Map"), {
        ssr: false
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value- 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) {
            return onNext();
        }

    let currentuery = {};
        if (params) {
            currentuery = qs.parse(params.toString());
        }

        const updatedQuery = {
            ...currentuery,
            location: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
            startDate: undefined as string | undefined,
            endDate: undefined as string | undefined
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: "/",
            query: updatedQuery
        }, { skipNull: true });

        setStep(STEPS.LOCATION);
        searchModal.onClose();

        router.push(url);

    }, [
        step, 
        onNext, 
        params, 
        location, 
        guestCount, 
        roomCount, 
        bathroomCount, 
        dateRange, 
        searchModal, 
        router
    ]);

    const ActionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return "Search";
        }

        return "Next";
    }, [step]);

    const SecondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }

        return "Back";
    }, [step]);

    let bodycontent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Where are you going?"
                subtitle="Add your destination"
            />
            <CountrySelect
                value={location}
                onChange={(value) =>
                    setLocation(value as CountrySelectValue)
                }
            />
            <hr />
            <Map center={location?.latling} />
        </div>
    )

    if (step === STEPS.DATE) {
        bodycontent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="When are you going?"
                    subtitle="Add your dates"
                />
                <Calendar
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)} disabledDates={[]} />
            </div>
        );
    }

    if (step === STEPS.INFO) {
        bodycontent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="More Information"
                    subtitle="Find your perfect stay"
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests are coming?"
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms do you need?"
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <Counter 
                    title="Bathrooms"
                    subtitle="How many bathrooms do you need?"
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        )
    }

    return ( 
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={ActionLabel}
            secondaryActionLabel={SecondaryActionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            body={bodycontent}
        />
     );
}
 
export default SearchModal;