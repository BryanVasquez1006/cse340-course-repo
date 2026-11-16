import express from 'express';
import { showMainPage } from "./controllers/index.js";
import { showOrganizationsPage } from "./controllers/organizations.js";
import { showProjectsPage } from "./controllers/projects.js";
import { showCategoriesPage } from "./controllers/categories.js";
import { handle500Error } from "./controllers/errors.js";
import { showOrganizationDetailsPage } from "./controllers/organizations.js";

const router = express.Router();

/**
  * Routes
  */
router.get('/', showMainPage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Route for organization details page
router.get('/organizations/:id', showOrganizationDetailsPage);

//Error-handling routes
router.get('/test-error', handle500Error);

export default router;