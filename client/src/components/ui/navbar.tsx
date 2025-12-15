import { Box, IconButton, Text} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <Box as="nav" padding="5" bg="bg.muted" display="flex" direction='row' alignContent='center' justifyContent="space-between">
            <Text fontWeight='600' fontSize='3xl'>JamSpace</Text>
            <IconButton onClick={() => navigate(-1)}><ArrowLeft/></IconButton>
        </Box>
    );
}
