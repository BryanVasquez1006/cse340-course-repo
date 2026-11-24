import { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments} from "../models/categories.js";
import { getProjectsByCategoryId, getProjectDetails  } from "../models/projects.js";



const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Categories";
  res.render("categories", { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await getCategoryDetails(categoryId);
  if (!category) {
    const err = new Error('Category Not Found');
    err.status = 404;
    return next(err);
  }
  const projects = await getProjectsByCategoryId(categoryId);
  res.render("categoryDetails", { title: category.name, category, projects });
} 
 // Show the form for assigning categories to a project
const showAssignCategoriesForm = async (req, res, next) => {
  const projectId = req.params.id;

  // Fetch project details
  const projectDetails = await getProjectDetails(projectId);

  // Check if project exists
  if (!projectDetails) {
    const err = new Error('Project Not Found');
    err.status = 404;
    return next(err);
  }

  const categoriesDetails = await getAllCategories();
  // Check if categories exist
  if (!categoriesDetails || categoriesDetails.length === 0) {
    const err = new Error('Categories Not Found');
    err.status = 404;
    return next(err);
  }

  const categories = await getCategoriesByProjectId(projectId);
  res.render('assign-categories', { 
    title: 'Assign Categories to Project',
    projectDetails: projectDetails,
    allCategories: categoriesDetails,
    assignedCategories: categories
  });
};

  // Process the form submission for assigning categories to a project
  const processAssignCategoriesForm = async (req, res, next) => {
  const projectId = req.params.id;
  const selectedCategories = req.body.categoryIds;

  // Update category assignments for the project
  try {
    // Update the category assignments in the database
    await updateCategoryAssignments(projectId, selectedCategories);
    // Notify the user of success and redirect to the project page
    req.flash('success', 'Categories updated successfully');
    // Redirect to the project page after successful update
    res.redirect(`/project/${projectId}`);
  } catch (err) {
    return next(err);
  }
};

export {showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm};