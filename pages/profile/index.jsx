import Link from "next/link";
import { format } from "date-fns";
import { Person } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { H4, H5, Small } from "components/Typography";
import { FlexBetween, FlexBox } from "components/flex-box";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import api from "utils/__api__/users";

// ========================

const Profile = ({ user }) => {
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));

 const HEADER_LINK = (
  <Box display="flex" gap={2}>
    <Link href={`/profile/${user.id}`} passHref>
      <Button color="primary" sx={{ px: 3, bgcolor: "primary.light" }}>
        Edit Profile
      </Button>
    </Link>
    <Link href="/admin/orders" passHref>
      <Button color="secondary" sx={{ px: 3 }}>
        Go to Dashboard
      </Button>
    </Link>
  </Box>
);


  return (
    <CustomerDashboardLayout>
      <UserDashboardHeader
        icon={Person}
        title="My Profile"
        button={HEADER_LINK}
        navigation={<CustomerDashboardNavigation />}
      />

      <Box mb={4}>
        <Card sx={{ p: 4 }}>
          <FlexBox alignItems="center" mb={4}>
            <Avatar src={user.avatar} sx={{ height: 80, width: 80 }} />
            <Box ml={2}>
              <H5>{`${user.name}`}</H5>
            </Box>
          </FlexBox>

          {/* BUSINESS DETAILS */}
          <Section title="Business Details">
            <Grid container spacing={2}>
              <ProfileItem title="PAN Number" value={user.pan_number} />
              <ProfileItem title="GST Number" value={user.gst_number} />
              <ProfileItem title="Contact Person" value={user.contact_person} />
              <ProfileItem title="Contact Mobile" value={user.contact_mobile} />
              <ProfileItem title="Address" value={user.address} />
              <ProfileItem title="City" value={user.city} />
              <ProfileItem title="State" value={user.state} />
              <ProfileItem title="Pin Code" value={user.pin_code} />
              <ProfileItem title="MSME Number" value={user.msme_number} />
            </Grid>
          </Section>

          {/* BANK DETAILS */}
          <Section title="Bank Details">
            <Grid container spacing={2}>
              <ProfileItem title="Bank Name" value={user.bank_name} />
              <ProfileItem title="IFSC Code" value={user.ifsc_code} />
              <ProfileItem title="Account Number" value={user.account_number} />
              <ProfileItem title="Branch" value={user.branch} />
            </Grid>
          </Section>
        </Card>
      </Box>
    </CustomerDashboardLayout>
  );
};

// Profile item for each grid cell
const ProfileItem = ({ title, value }) => (
  <Grid item xs={12} md={6}>
    <Typography color="grey.600" fontSize={13}>
      {title}
    </Typography>
    <Typography fontWeight={500}>{value || "-"}</Typography>
  </Grid>
);

// Section wrapper
const Section = ({ title, children }) => (
  <Box mb={4}>
    <H4 mb={2}>{title}</H4>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Box>
);

export const getStaticProps = async () => {
  const user = await api.getUser();
  return {
    props: { user },
  };
};

export default Profile;
