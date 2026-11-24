import express from 'express';
import { showMainPage } from "./controllers/index.js";
import { showOrganizationsPage, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from "./controllers/organizations.js";
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation } from "./controllers/projects.js";
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm } from "./controllers/categories.js";
import { showOrganizationDetailsPage, showNewOrganizationForm } from "./controllers/organizations.js";


const router = express.Router();

/**
  * Routes
  */
router.get('/', showMainPage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage); // Route for category details page
router.get('/project/:id', showProjectDetailsPage); // Route for project details page
router.get('/new-organization', showNewOrganizationForm); // Route for new organization page
router.post('/new-organization', organizationValidation, processNewOrganizationForm); // Route to handle new organization form submission
router.get('/edit-organization/:id', showEditOrganizationForm); // Route for edit organization page
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm); // Route to handle edit organization form submission
router.get('/new-project', showNewProjectForm); // Route for new project page
router.post('/new-project', projectValidation, processNewProjectForm); // Route to handle new project form submission

router.get('/assign-categories/:id', showAssignCategoriesForm); // Route for assigning categories to a project

router.post('/assign-categories/:id', processAssignCategoriesForm); // Route to handle assigning categories to a project

// Route for organization details page
router.get('/organizations/:id', showOrganizationDetailsPage);

//Error-handling routes
//router.get('/test-error', handle500Error);

export default router;