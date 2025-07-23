import { useRouter } from "next/router";
import { Delete, Edit } from "@mui/icons-material";
import { StyledTableRow, StyledTableCell, StyledIconButton } from "../StyledComponents";

const PartysRow = ({
  product
}) => {
  const {
    id,
    name,
    gst_number,
    contact_person,
    contact_number,
    city
  } = product;
  const router = useRouter();
  return <StyledTableRow>
    <StyledTableCell align="left">#{id.split("-")[0]}</StyledTableCell>
    <StyledTableCell align="left">{name}</StyledTableCell>
    <StyledTableCell align="left">{gst_number}</StyledTableCell>
    <StyledTableCell align="left">{contact_person}</StyledTableCell>
    <StyledTableCell align="left">{contact_number}</StyledTableCell>
    <StyledTableCell align="left">{city}</StyledTableCell>

    <StyledTableCell align="center">
      <StyledIconButton onClick={() => router.push(`/admin/Partys/${slug}`)}>
        <Edit />
      </StyledIconButton>

      <StyledIconButton>
        <Delete />
      </StyledIconButton>
    </StyledTableCell>
  </StyledTableRow>;
};
export default PartysRow;