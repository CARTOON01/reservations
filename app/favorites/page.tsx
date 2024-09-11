import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListing";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import FavoritesClient from "./FavoritesClient";

const ListingPage = async() => {
    const listings = await getFavoriteListings();
    const currentUser = await getCurrentUser();

    if (listings.length === 0) {
        return ( 
            <ClientOnly>
                <EmptyState
                    title="You Have no favorites"
                    subtitle="Looks like you have no favorite Listings."
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <FavoritesClient
                listings={listings}
                curentUser={currentUser}
            />
        </ClientOnly>
    )
}
 
export default ListingPage;