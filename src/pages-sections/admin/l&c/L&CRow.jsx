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
  const handleNavigate = (id) => {
    router.push(`/admin/t&c/${id}`);
  }

  return <StyledTableRow>
    <StyledTableCell align="left">#{id}</StyledTableCell>

    <StyledTableCell align="left">
      <CategoryWrapper>{content}</CategoryWrapper>
    </StyledTableCell>

    <StyledTableCell align="left">{type}</StyledTableCell>

    <StyledTableCell align="center">
      <StyledIconButton onClick={() => handleNavigate(id)}>
        <Edit />
      </StyledIconButton>

      <StyledIconButton onClick={() => handleNavigate(id)}>
        <RemoveRedEye />
      </StyledIconButton>

      {/* <StyledIconButton>
        <Delete />
      </StyledIconButton> */}
    </StyledTableCell>
  </StyledTableRow>;
};
export default LCRow;