import { useState, useEffect } from "react";
import Router from "next/router";
import {
  Box,
  Card,
  Grid,
  Divider,
  Avatar,
  Typography,
  Button,
  TextField,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import { Person } from "@mui/icons-material";

import DropZone from "components/DropZone";
import { FlexBox } from "components/flex-box";
import BazaarImage from "components/BazaarImage";
import { H4, H5 } from "components/Typography";
import UserDashboardHeader from "components/header/UserDashboardHeader";
import CustomerDashboardLayout from "components/layouts/customer-dashboard";
import CustomerDashboardNavigation from "components/layouts/customer-dashboard/Navigations";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import api from "utils/__api__/users";

// Styled components
const UploadImageBox = styled("div")(() => ({
  position: "relative",
  width: 120,
  height: 120,
  border: "1px solid #ccc",
  borderRadius: 8,
  overflow: "hidden",
}));

const StyledClear = styled(IconButton)(() => ({
  position: "absolute",
  top: 4,
  right: 4,
  background: "#fff",
  zIndex: 2,
  "&:hover": {
    background: "#f1f1f1",
  },
}));

export default function Profile({ user: initialUser }) {
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState(initialUser);
  const [signatureFile, setSignatureFile] = useState([]);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setFormData(initialUser);
    if (initialUser.signature_url) {
      setSignatureFile([
        {
          name: "signature.jpg",
          preview: initialUser.signature_url,
          uploaded: true,
        },
      ]);
    }
  }, [initialUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileDelete = (fileToRemove) => () => {
    setSignatureFile((prev) =>
      prev.filter((file) => file.preview !== fileToRemove.preview)
    );
  };

  const handleSave = async () => {
    try {
      // Add API logic for saving signature file and formData
      await api.updateUser(formData); // Your API update
      setUser(formData);
      setEditMode(false);
      Router.push("/admin/profile");
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const HEADER_LINK = (
    <Box display="flex" gap={2}>
      {editMode ? (
        <>
          <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setEditMode(false);
              setFormData(user);
              if (user.signature_url) {
                setSignatureFile([
                  {
                    name: "signature.jpg",
                    preview: user.signature_url,
                    uploaded: true,
                  },
                ]);
              } else {
                setSignatureFile([]);
              }
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button
          color="primary"
          sx={{ px: 3, bgcolor: "primary.light" }}
          onClick={() => setEditMode(true)}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );

  return (
    <CustomerDashboardLayout>
    
      <>
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
              <H5>{user.name}</H5>
            </Box>
          </FlexBox>

          <Section title="Business Details">
            <Grid container spacing={2}>
              <ProfileItem name="pan_number" title="PAN Number" value={formData.pan_number} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="gst_number" title="GST Number" value={formData.gst_number} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="contact_person" title="Contact Person" value={formData.contact_person} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="contact_mobile" title="Contact Mobile" value={formData.contact_mobile} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="address" title="Address" value={formData.address} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="city" title="City" value={formData.city} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="state" title="State" value={formData.state} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="pin_code" title="Pin Code" value={formData.pin_code} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="msme_number" title="MSME Number" value={formData.msme_number} editMode={editMode} onChange={handleChange} />
            </Grid>
          </Section>

          <Section title="Bank Details">
            <Grid container spacing={2}>
              <ProfileItem name="bank_name" title="Bank Name" value={formData.bank_name} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="ifsc_code" title="IFSC Code" value={formData.ifsc_code} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="account_number" title="Account Number" value={formData.account_number} editMode={editMode} onChange={handleChange} />
              <ProfileItem name="branch" title="Branch" value={formData.branch} editMode={editMode} onChange={handleChange} />
            </Grid>
          </Section>

          <Section title="Signature with Stamp">
            <Grid item xs={12}>
              {!signatureFile.length ? (
                editMode && (
                  <DropZone
                    title="Upload Signature with Stamp"
                    maxFiles={1}
                    accept={{ "image/*": [] }}
                    onChange={(selectedFiles) => {
                      const file = selectedFiles[0];
                      if (file) {
                        const updatedFile = Object.assign(file, {
                          preview: URL.createObjectURL(file),
                        });
                        setSignatureFile([updatedFile]);
                        setImgLoaded(false);
                      }
                    } } />
                )
              ) : (
                <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                  {signatureFile.map((file, index) => (
                    <UploadImageBox key={index}>
                      {!imgLoaded && (
                        <CircularProgress
                          size={24}
                          sx={{ position: "absolute", top: "40%", left: "40%" }} />
                      )}
                      <BazaarImage
                        src={file.preview}
                        width="100%"
                        height="100%"
                        alt="Signature"
                        style={{ objectFit: "contain" }}
                        onLoad={() => setImgLoaded(true)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-signature.png";
                        } } />
                      {editMode && (
                        <StyledClear onClick={handleFileDelete(file)}>
                          <ClearIcon fontSize="small" />
                        </StyledClear>
                      )}
                    </UploadImageBox>
                  ))}
                </FlexBox>
              )}
            </Grid>
          </Section>
        </Card>
      </Box></>

    </CustomerDashboardLayout> 
  );
}

// Profile field component
const ProfileItem = ({ title, name, value, editMode, onChange }) => (
  <Grid item xs={12} md={6}>
    <Typography color="grey.600" fontSize={13}>
      {title}
    </Typography>
    {editMode ? (
      <TextField
        fullWidth
        size="small"
        name={name}
        value={value || ""}
        onChange={onChange}
      />
    ) : (
      <Typography fontWeight={500}>{value || "-"}</Typography>
    )}
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

// Dashboard layout wrapper
Profile.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};


export const getStaticProps = async () => {
  const user = await api.getUser(); 
  return {
    props: { user },
  };
};
