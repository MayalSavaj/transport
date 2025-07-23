import { Delete, Edit } from "@mui/icons-material";
import { StyledTableRow, CategoryWrapper, StyledIconButton, StyledTableCell } from "../StyledComponents";
import { useRouter } from "next/router";

const ordersRow = ({
  item,
}) => {
  const {
    id, party, city, date, lrNo, freight, status
  } = item;
  const router = useRouter();
  const handleNavigate = () => router.push(`/admin/orders/${slug}`);
  return <StyledTableRow>
    <StyledTableCell align="left">#{id.split("-")[0]}</StyledTableCell>
    <StyledTableCell align="left">{date}</StyledTableCell>

    <StyledTableCell align="left">{lrNo}</StyledTableCell>

    <StyledTableCell align="left">
      <CategoryWrapper>{party}</CategoryWrapper>
    </StyledTableCell>

    <StyledTableCell align="left">{city}</StyledTableCell>



    <StyledTableCell align="left">{freight}</StyledTableCell>

    <StyledTableCell align="left">{status}</StyledTableCell>


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
export default ordersRow;