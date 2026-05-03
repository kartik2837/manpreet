// import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
// import { useState } from 'react'
// import { mainCategory } from '../../../data/category/mainCategory'
// import CategorySheet from './CategorySheet';

// const DrawerList = ({toggleDrawer}:any) => {
//     const [selectedCategory,setSelectedCategory]=useState("");

//   return (
//     <Box sx={{ width: 250 }} role="presentation" 
//     // onClick={toggleDrawer(false)}
//     >
//     <List>

//       <ListItem>
//         <ListItemButton>

//           <ListItemText primary={<h1 className='logo text-2xl text-[#f4501e]'>Selfy Snap</h1>} />
//         </ListItemButton>
//       </ListItem>
//       <Divider />
     
//       {mainCategory.map((item) => <ListItem key={item.name} disablePadding>
//         <ListItemButton onClick={()=>setSelectedCategory(item.categoryId)}>
//           <ListItemText primary={item.name} />
//         </ListItemButton>
//       </ListItem>
//       )}


//     </List>

//     {selectedCategory && <div
//         // onMouseLeave={() => setShowSheet(false)}
//         // onMouseEnter={() => setShowSheet(true)} 
//         className='categorySheet absolute top-[4.41rem] left-0 right-0 h-[400px]'>
//         <CategorySheet toggleDrawer={toggleDrawer} selectedCategory={selectedCategory}/>
//       </div>}

//   </Box>
//   )
// }

// export default DrawerList















import { Box, Divider, List, ListItem, ListItemButton, ListItemText, IconButton } from "@mui/material";
import { useState } from "react";
import CategorySheet from "./CategorySheet";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface DrawerListProps {
  toggleDrawer: (open: boolean) => () => void;
  categories?: any[]; // from Redux (levelOneCategories)
}

const DrawerList = ({ toggleDrawer, categories = [] }: DrawerListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const closeSheet = () => setSelectedCategory(null);

  // If a category is selected, show the CategorySheet with a back button
  if (selectedCategory) {
    return (
      <Box sx={{ width: 250, height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
          <IconButton onClick={closeSheet}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <CategorySheet
            selectedCategory={selectedCategory}
            onClose={closeSheet}
            toggleDrawer={toggleDrawer}
          />
        </Box>
      </Box>
    );
  }

  // Otherwise show the main menu list
  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemText primary={<h1 className="logo text-2xl text-[#f4501e]">Selfy Snap</h1>} />
          </ListItemButton>
        </ListItem>
        <Divider />
        {categories.length > 0 ? (
          categories.map((item) => (
            <ListItem key={item.categoryId} disablePadding>
              <ListItemButton onClick={() => handleCategoryClick(item.categoryId)}>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No categories found" />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default DrawerList;






