import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { StyledTableRow, CategoryWrapper, StyledIconButton, StyledTableCell } from "../StyledComponents";
import { useRouter } from "next/router";

const LCRow = ({
  item,
}) => {
  const {
    id, content, type
  } = item;
  const router = useRouter();
  const handleNavigate = () => router.push(`/admin/t&c/${slug}`);


  return <StyledTableRow>
    <StyledTableCell align="left">#{id}</StyledTableCell>

    <StyledTableCell align="left">
      <CategoryWrapper>{content}</CategoryWrapper>
    </StyledTableCell>

    <StyledTableCell align="left">{type}</StyledTableCell>

    <StyledTableCell align="center">
      <StyledIconButton onClick={handleNavigate}>
        <Edit />
      </StyledIconButton>

      <StyledIconButton onClick={handleNavigate}>
        <RemoveRedEye />
      </StyledIconButton>

      <StyledIconButton>
        <Delete />
      </StyledIconButton>
    </StyledTableCell>
  </StyledTableRow>;
};
export default LCRow;