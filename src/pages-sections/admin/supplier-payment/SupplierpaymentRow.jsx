import { Delete, Edit } from "@mui/icons-material";
import { StyledTableRow, CategoryWrapper, StyledIconButton, StyledTableCell } from "../StyledComponents";
import { useRouter } from "next/router";

const SupplierpaymentRow = ({
  item,
}) => {
  const {
    id, name,amount
  } = item;
  const router = useRouter();
  const handleNavigate = () => router.push(`/admin/party-Settle`);

  return <StyledTableRow>
    <StyledTableCell align="left">#{id.split("-")[0]}</StyledTableCell>

    <StyledTableCell align="left" onClick={handleNavigate}>
      <CategoryWrapper>{name}</CategoryWrapper>
    </StyledTableCell>

    <StyledTableCell align="left">{amount}</StyledTableCell>

    <StyledTableCell align="center">
      <StyledIconButton onClick={handleNavigate}>
        <Edit />
      </StyledIconButton>

      <StyledIconButton>
        <Delete />
      </StyledIconButton>
    </StyledTableCell>
  </StyledTableRow>;
};
export default SupplierpaymentRow;