
import { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory } from "../models/categories.js";
import { getProjectsByCategoryId, getProjectDetails  } from "../models/projects.js";
import {body, validationResult} from "express-validator";

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Name is too short")
    .isLength({ max: 100 })
    .withMessage("Name is too long"),
];


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
    title: 'Assign Categories to ' + projectDetails.title,
    projectDetails: projectDetails,
    allCategories: categoriesDetails,
    assignedCategories: categories
  });
};

  // Process the form submission for assigning categories to a project
  const processAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.id;
    const selectedCategories = req.body.categoryIds;

    // Debugging
    console.log("Project ID:", projectId);
    console.log("Selected categories:", selectedCategories);
    console.log("Request body:", req.body);

    // Update category assignments for the project
    try {
      // Update the category assignments in the database
      await updateCategoryAssignments(projectId, selectedCategories);
      // Notify the user of success and redirect to the project page
      req.flash("success", "Categories updated successfully");
      // Redirect to the project page after successful update
      res.redirect(`/project/${projectId}`);
    } catch (err) {
      return next(err);
    }
  };;

const showNewCategoryForm =  (req, res) => {
  res.render('new-category', { title: 'Create New Category' });
};


const processNewCategoryForm = async (req, res, next) => {
  const {name} = req.body;
  const errors = validationResult(req);

  // Check for validation errors
  if (!errors.isEmpty()) {
     errors.array().forEach((error) => {
      req.flash('error', error.msg);
     });
    return res.redirect('/new-category');
  } 

  
  
  try {
    const categoryId = await createCategory(name);
    req.flash('success', 'Category created successfully');
    res.redirect(`/category/${categoryId}`);
  } catch (err) {
    return next(err);
  }
};

const showEditCategoryForm = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await getCategoryDetails(categoryId);

  if (!category) {
    const err = new Error('Category Not Found');
    err.status = 404;
    return next(err);
  }
  res.render('edit-category', { title: 'Edit Category', category });
};

const processEditCategoryForm = async (req, res, next) => {
  const categoryId = req.params.id;
  const {name} = req.body;
  const errors = validationResult(req);

  // Check for validation errors
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => req.flash('error', error.msg));
    return res.redirect(`/edit-category/${categoryId}`);
  }

  try {
    await updateCategory(categoryId, name);
  } catch (err) {
    req.flash('error', 'Failed to update category');
    return next(err);
  }
  req.flash('success', 'Category updated!');
  res.redirect(`/category/${categoryId}`);
  
};

export {showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, categoryValidation, processEditCategoryForm, showEditCategoryForm};