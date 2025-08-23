import { useState } from "react";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { Delete, RemoveRedEye } from "@mui/icons-material";
import BazaarSwitch from "components/BazaarSwitch";
import { StyledIconButton, StyledTableCell, StyledTableRow } from "../StyledComponents";

// ========================================================================

// ========================================================================

const SuppliersRow = ({
  brand,
  selected
}) => {
  const {
    name,
    id,
    pan_number,
    gst_number,
    route_name,
    rood,
    address,
    city,
    state,
    pin_code,
    contact_person,
    contact_number,
  } = brand;
  const router = useRouter();

  const handleNavigate = () => router.push(`/admin/suppliers/${id}`);
  return <StyledTableRow>
    <StyledTableCell align="center">#{id}</StyledTableCell>

    <StyledTableCell align="center">{name}</StyledTableCell>

    {/* <StyledTableCell align="center">{pan_number}</StyledTableCell> */}
    {/* <StyledTableCell align="center">{gst_number}</StyledTableCell> */}
    {/* <StyledTableCell align="center">{rood}</StyledTableCell> */}

    {/* <StyledTableCell align="center">{route_name}</StyledTableCell> */}
    {/* <StyledTableCell align="center">{address}</StyledTableCell> */}
    {/* <StyledTableCell align="center">{city}</StyledTableCell> */}
    {/* <StyledTableCell align="center">{state}</StyledTableCell> */}
    {/* <StyledTableCell align="center">{pin_code}</StyledTableCell> */}
    <StyledTableCell align="center">{contact_person}</StyledTableCell>
    <StyledTableCell align="center">{contact_number}</StyledTableCell>

    <StyledTableCell align="center">
      <StyledIconButton onClick={handleNavigate}>
        <RemoveRedEye />
      </StyledIconButton>

      <StyledIconButton>
        <Delete />
      </StyledIconButton>
    </StyledTableCell>
  </StyledTableRow>;
};
export default SuppliersRow;