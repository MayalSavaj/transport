import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import axios from "utils/axios";

export default function ProfileCheckModal({ children }) {
    // State to track if the profile is incomplete from the API
    const [profileIncomplete, setProfileIncomplete] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const res = await axios.get("/user/profile-check");
                // We only set the state based on the API response
                setProfileIncomplete(!res.data.complete);
            } catch (err) {
                console.error("Profile check failed:", err);
                setProfileIncomplete(false); // Assume profile is fine on error
            }
        };

        checkProfile();
    }, []); // This effect only needs to run once to check the user's status

    const excludedPaths = ["/admin/profile", "/logout", 'admin/login', ""];

    // The modal should only be open if BOTH conditions are true:
    // 1. The profile is incomplete.
    // 2. The current page is NOT in the excluded list.
    const showModal = profileIncomplete && !excludedPaths.includes(router.pathname);

    return (
        <>
            {children}

            {/* The "open" prop is now derived from our logic above */}
            <Dialog open={showModal}>
                <DialogTitle>Complete Your Profile</DialogTitle>
                <DialogContent>
                    Please fill in your profile details before continuing.
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push("/admin/profile")}
                    >
                        Go to Profile
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}